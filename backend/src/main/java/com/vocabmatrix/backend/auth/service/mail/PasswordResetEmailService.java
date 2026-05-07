// src/main/java/com/vocabmatrix/backend/auth/service/mail/PasswordResetEmailService.java

package com.vocabmatrix.backend.auth.service.mail;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.vocabmatrix.backend.auth.dto.passwordreset.PasswordResetRequestDTO;
import com.vocabmatrix.backend.auth.entity.mail.PasswordResetToken;
import com.vocabmatrix.backend.auth.exception.InvalidTokenException;
import com.vocabmatrix.backend.auth.exception.PasswordReuseException;
import com.vocabmatrix.backend.auth.exception.TokenExpiredException;
import com.vocabmatrix.backend.auth.repository.mail.PasswordResetTokenRepository;
import com.vocabmatrix.backend.auth.service.LoginService;
import com.vocabmatrix.backend.common.mail.MailService;
import com.vocabmatrix.backend.common.util.TokenUtils;
import com.vocabmatrix.backend.user.entity.User;
import com.vocabmatrix.backend.user.exception.ThirdPartyAccountException;
import com.vocabmatrix.backend.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetEmailService {

    // 依賴注入：使用PasswordResetTokenRepository用Jap造的findByUser()查找用戶，為了刪除該使用者所有舊的密碼重置Token
    private final PasswordResetTokenRepository tokenRepository;

    // 依賴注入：使用UserRepository用Jap造的save()方法儲存使用者輸入的新密碼
    private final UserRepository userRepository;

    // 依賴注入：使用MailService提供的寄信服務
    private final MailService mailService;

    // 依賴注入：使用PasswordEncoder加密使用者輸入的新密碼
    private final PasswordEncoder passwordEncoder;

    // 依賴注入：使用LoginService提供的revokeAllTokensForUser方法撤銷所有現存的 Refresh Token (強制重新登入)
    private final LoginService loginService;

    // application.yml配置：當系統發送「忘記密碼」郵件時，裡面需要包含一個點擊連結（例如：http://localhost:3000/reset-password?token=...）。後端必須知道前端現在在哪裡，才能拼湊出正確的網址。
    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    // application.yml配置：定義「忘記密碼」重設連結在幾個小時內會失效（安全性考量）
    @Value("${app.password-reset.token-validity-hours:1}")
    private int resetTokenValidityHours;




    // =========================================================================
    // 1. Token 產生與管理
    // =========================================================================

    /**
     * 為指定使用者生成一個新的密碼重置 token。
     *
     * @param user 要生成重置 token 的使用者
     * @return 新生成並儲存的 PasswordResetToken 物件
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public PasswordResetToken generateResetToken(User user) {

        // 刪除該使用者所有舊的密碼重置Token (確保只有一個有效的重置請求)
        tokenRepository.deleteAllByUser(user);

        // 產生原始 Token 字串 (UUID)
        String rawToken = UUID.randomUUID().toString();

        // 使用 TokenUtils 的 hashToken() 方法將原始 Token 雜湊後儲存
        String tokenHash = TokenUtils.hashToken(rawToken);

        // 組裝 PasswordResetToken 實體物件
        PasswordResetToken tokenEntity = PasswordResetToken.builder()
                .user(user)
                .token(rawToken)  // Transient，不會存入 DB
                .tokenHash(tokenHash)  // 實際存入 DB 的是 hash 值
                .expiryDate(OffsetDateTime.now().plusHours(resetTokenValidityHours))
                .build();

        // 儲存到資料庫
        return tokenRepository.save(tokenEntity);
    }

    /**
     * 根據 Token 字串查找 PasswordResetToken 實體。
     *
     * @param token 原始 Token 字串
     * @return 查找到的 Token 實體 (Optional)
     */
    public Optional<PasswordResetToken> findByTokenHash(String token) {
        // 將傳入的原始 token 雜湊後才能查詢資料庫
        String tokenHash = TokenUtils.hashToken(token);
        return tokenRepository.findByTokenHash(tokenHash);
    }

    /**
     * 刪除指定的密碼重置 Token。
     *
     * @param token Entity
     */
    @Transactional
    public void deleteToken(PasswordResetToken token) {
        tokenRepository.delete(token);
    }

    // =========================================================================
    // 2. 忘記密碼郵件發送
    // =========================================================================

    /**
     * 寄送密碼重置郵件給使用者。
     *
     * @param user 收件使用者
     * @param token 之前生成的 PasswordResetToken (包含原始 Token 字串)
     */
    public void sendResetPasswordEmail(User user, PasswordResetToken token) {
        // 注意：這裡應該導向前端的重置頁面，而不是後端 API
        String link = frontendUrl + "/auth/reset-password?token=" + token.getToken();
        String subject = "【VocabMatrix】Password reset request";
        String content = buildResetPasswordEmailContent(user, link);

        mailService.sendMail(user.getEmail(), subject, content);
    }

    private String buildResetPasswordEmailContent(User user, String link) {
        return String.format(
                """
                        Hello, %s:
                        
                        You have requested a password reset. Please click the following link to set a new password:
                        %s
                        
                        This link will be valid for %d hours.
                        
                        If you did not request a password reset, please ignore this email.""",
                user.getUsername(),
                link,
                resetTokenValidityHours
        );
    }

    // =========================================================================
    // 3. 核心重置密碼邏輯
    // =========================================================================

    /**
     * 驗證 Token 並重置密碼。
     *
     * @param dto 包含 Token、新密碼和確認密碼的請求 DTO
     * @return 重置結果訊息
     * @throws InvalidTokenException Token 無效
     * @throws TokenExpiredException Token 已過期
     * @throws PasswordReuseException 新密碼不能與舊密碼相同
     */
    @Transactional
    public String resetPassword(PasswordResetRequestDTO dto) {

        // 1. 驗證新密碼與確認密碼是否一致
        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new PasswordReuseException("新密碼與確認密碼不一致");
        }

        // 2. 查找 Token
        PasswordResetToken resetToken = this.findByTokenHash(dto.getToken())
                .orElseThrow(() -> new InvalidTokenException("無效的重置連結"));

        // 3. 檢查過期
        if (resetToken.getExpiryDate().isBefore(OffsetDateTime.now())) {
            this.deleteToken(resetToken);
            throw new TokenExpiredException("重置連結已過期，請重新申請。");
        }

        // 4. 獲取使用者
        User user = resetToken.getUser();

        // 5. 檢查用戶是否有密碼（排除純 OAuth 用戶）
        if (!user.hasPassword()) {
            throw new ThirdPartyAccountException("This account is a third-party login account and the password cannot be changed. Please use a third-party platform to manage your password.");
        }

        // 6. 檢查新密碼是否與舊密碼相同 (可選的安全檢查)
        if (passwordEncoder.matches(dto.getNewPassword(), user.getPasswordHash())) {
            throw new PasswordReuseException("新密碼不能與舊密碼相同");
        }

        // 7. 更新密碼
        String newPasswordHash = passwordEncoder.encode(dto.getNewPassword());
        user.setPasswordHash(newPasswordHash);
        userRepository.save(user);

        // 8. 刪除 Token (確保一次性使用)
        this.deleteToken(resetToken);

        // 9. [安全增強] 撤銷所有現存的 Refresh Token (強制重新登入)
        loginService.revokeAllTokensForUser(user.getId());

        log.info("Password successfully reset for user: {}", user.getEmail());

        // 10. 返回成功訊息
        return "Password reset successful. Please log in with your new password!";
    }
}