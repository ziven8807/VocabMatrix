// src/main/java/com/vocabmatrix/backend/auth/service/mail/RegistrationEmailService.java

package com.vocabmatrix.backend.auth.service.mail;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.vocabmatrix.backend.auth.entity.mail.RegistrationEmailToken;
import com.vocabmatrix.backend.auth.repository.mail.RegistrationEmailTokenRepository;
import com.vocabmatrix.backend.common.mail.MailService;
import com.vocabmatrix.backend.common.util.TokenUtils;
import com.vocabmatrix.backend.user.entity.User;
import com.vocabmatrix.backend.user.repository.UserRepository;
import com.vocabmatrix.backend.user.service.UserService;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationEmailService {

    // 依賴注入：使用RegistrationEmailTokenRepository進行註冊信Token的CRUD
    private final RegistrationEmailTokenRepository tokenRepository;

    // 依賴注入：使用UserRepository裡的Jpa提供的findByEmail()方法查找要求重新寄註冊信的人的email，再次發給他
    private final UserRepository userRepository;

    // 依賴注入：使用MailService的寄信服務寄送註冊信
    private final MailService mailService;

    // 依賴注入：使用UserService裡的activateUser()方法正式啟用帳號（啟用才能登入）
    private final UserService userService;

    // application.yml配置：當系統發送「註冊驗證」郵件時，裡面需要包含一個點擊連結（例如：http://localhost:8080/api/auth/verify?token=...）。才能拼湊出正確的網址。
    @Value("${app.backend-url:http://localhost:8080}")
    private String backendUrl;

    // application.yml配置：定義「註冊驗證」重設連結在幾個小時內會失效（安全性考量）
    @Value("${app.email-verification.token-validity-hours:1}")
    private int verificationTokenValidityHours;




    // =========================================================================
    // 1. Token 產生與管理
    // =========================================================================

    /**
     * 為指定使用者生成一個新的 Email 驗證 token。
     * * @param user 要生成驗證 token 的使用者
     * @return 新生成並儲存的 RegistrationEmailToken 物件 (註：Entity中應儲存Hash值)
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public RegistrationEmailToken generateVerificationToken(User user) {

        // 刪除該使用者所有舊的帳號註冊Token (確保只有一個有效的重置請求)
        tokenRepository.deleteAllByUser(user);

        // 產生原始 Token 字串 (UUID)
        String rawToken = UUID.randomUUID().toString();

        // 使用TokenUtils的hashToken()方法將原始 Token 雜湊後儲存
        String tokenHash = TokenUtils.hashToken(rawToken);

        // 將所有必要的資訊（使用者、原始 Token、雜湊後的 Token、過期時間）組裝 (Build) 成一個新的 EmailVerificationToken 實體物件 (Entity)。
        RegistrationEmailToken tokenEntity = RegistrationEmailToken.builder()
                .user(user)
                .token(rawToken)
                .tokenHash(tokenHash)
                .expiryDate(OffsetDateTime.now().plusHours(verificationTokenValidityHours))
                .build();

        // 儲存結果到資料庫裡（注意：rawToken是沒有儲存進去的，因為他是token的明碼）
        return tokenRepository.save(tokenEntity);
    }

    /**
     * 根據 Token 字串查找 RegistrationEmailToken 實體。
     * * @param token 原始 Token 字串
     * @return 查找到的 Token 實體 (Optional)
     */
    public Optional<RegistrationEmailToken> findByTokenHash(String token) {
        // 使用TokenUtils的hashToken()方法將傳入的原始 token 雜湊後才能查詢資料庫
        String tokenHash = TokenUtils.hashToken(token);
        return tokenRepository.findByTokenHash(tokenHash);
    }

    /**
     * 刪除指定的 Email 驗證 Token。
     *
     * @param token Entity
     */
    @Transactional
    public void deleteToken(RegistrationEmailToken token) {
        tokenRepository.delete(token);
    }



    // =========================================================================
    // 2. 註冊信發送、註冊信內容生成
    // =========================================================================

    /**
     * 寄送 Email 驗證信給使用者 (呼叫 MailService 異步發送)。
     *
     * @param user 收件使用者
     * @param token 之前生成的 RegistrationEmailToken (包含原始 Token 字串)
     */
    public void sendRegistrationEmail(User user, RegistrationEmailToken token) {
        String link = backendUrl + "/api/auth/verify?token=" + token.getToken();
        String subject = "【VocabMatrix】Account verification email";
        String content = buildRegistrationEmailContent(user, link);

        mailService.sendMail(user.getEmail(), subject, content);
    }

    private String buildRegistrationEmailContent(User user, String link) {
        return String.format(
                """
                        Hello，%s：
                        
                        Please click the following link to activate your account：
                        %s
                        
                        This link is valid for %d hours.""",
                user.getUsername(),
                link,
                verificationTokenValidityHours
        );
    }



    // =========================================================================
    // 3. 核心驗證邏輯
    // =========================================================================

    /**
     * 驗證 Token 並啟用帳號。
     * @param token 來自驗證信連結的原始 Token 字串
     * @return 驗證結果訊息
     * @throws IllegalArgumentException Token 無效、已過期
     */
    @Transactional
    public String verifyAccount(String token) {

        // 1. 查找 Token (呼叫 findByTokenHash，該方法會先將傳入的原始 token 雜湊)
        RegistrationEmailToken verificationToken = this.findByTokenHash(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification link"));

        // 2. 檢查過期
        if (verificationToken.getExpiryDate().isBefore(OffsetDateTime.now())) {
            // 在拋出例外前用內部的deleteToken()方法刪除過期 Token
            this.deleteToken(verificationToken);
            throw new IllegalArgumentException("The verification link has expired. Please request a new one.");
        }

        // 後面步驟(3與4) 要用的使用者者資訊
        User user = verificationToken.getUser();

        // 3. 檢查是否已啟用
        if (user.isActiveStatus()) {
            // 帳號已經啟用的話：用內部的deleteToken()方法刪除 token (啟用的帳號不需要token)
            this.deleteToken(verificationToken);
            return "The account is already activated and does not require repeated verification.";
        }

        // 4. 正式啟用帳號 (呼叫 UserService 裡的activateUser 方法)（單向依賴）
        userService.activateUser(user.getId());

        // 5. 驗證完成後用內部的deleteToken()方法刪除 token (確保一次性使用)
        this.deleteToken(verificationToken);

        // 6. 帳號啟用成功回傳下列成功訊息
        return "Your account has been successfully activated, and you can log in now!";
    }

    // =========================================================================
    // 4. 重新發送驗證信邏輯 — resendRegistrationEmail()
    // =========================================================================

    /**
     * 根據 Email 查找使用者並重新發送驗證郵件。
     *
     * @param email 使用者的 Email 地址
     */
    @Transactional
    public void resendRegistrationEmail(String email) {
        // 1. 查找使用者 (使用 UserRepository的Jpa提供的findByEmail())
        User user = userRepository.findByEmail(email)
                .orElse(null); // 如果找不到，返回 null，以便進行防禦性處理

        // 2. 處理找不到用戶的情況 或 已經啟用的情況 (防禦性編程/防止 Email 枚舉攻擊)
        if (user == null || user.isActiveStatus()) {
            // 無論是找不到用戶，還是用戶已經啟用，都靜默成功地返回，不拋出錯誤。
            // 這樣可以防止攻擊者通過嘗試不同的 Email 來判斷哪些 Email 已經在系統中註冊。
            log.warn("Attempted to resend verification email to non-existent or already active user: {}", email);
            return;
        }

        // 3. 生成新的 Token 並發送郵件 (這會自動刪除舊 Token)
        try {
            RegistrationEmailToken newToken = generateVerificationToken(user);
            sendRegistrationEmail(user, newToken);

            log.info("Successfully resent verification email to: {}", user.getEmail());

        } catch (Exception e) {
            log.error("Failed to resend verification email to {}: {}", user.getEmail(), e.getMessage(), e);
            // 對於外部 API 呼叫的失敗，拋出運行時例外，讓 Controller 處理
            throw new RuntimeException("重發驗證郵件失敗，請稍後再試。", e);
        }
    }

}