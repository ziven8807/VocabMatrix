// src/main/java/com/vocabmatrix/backend/auth/service/otp/OtpCodeService.java

package com.vocabmatrix.backend.auth.service.otp;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Random;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vocabmatrix.backend.auth.dto.login.LoginResponseDTO;
import com.vocabmatrix.backend.auth.entity.otp.OtpCode;
import com.vocabmatrix.backend.auth.exception.BadCredentialsException;
import com.vocabmatrix.backend.auth.service.jwt.JwtTokenService;
import com.vocabmatrix.backend.auth.service.LoginAttemptService;
import com.vocabmatrix.backend.auth.repository.otp.OtpCodeRepository;
import com.vocabmatrix.backend.common.mail.MailService;
import com.vocabmatrix.backend.config.OtpConfig;
import com.vocabmatrix.backend.user.dto.UserResponseDTO;
import com.vocabmatrix.backend.user.entity.User;
import com.vocabmatrix.backend.user.repository.UserRepository;

/**
 * 無密碼登入 (OTP) 服務
 * 負責生成、發送、儲存和驗證一次性密碼。
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OtpCodeService {

    private final UserRepository userRepository;
    private final OtpCodeRepository otpCodeRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final OtpConfig otpConfig;
    private final JwtTokenService jwtTokenService; // 用於驗證成功後發行 Token
    private final LoginAttemptService loginAttemptService; // 整合登入嘗試限制

    private static final Random RANDOM = new Random();
    private static final String BAD_CREDENTIALS_MSG = "Invalid email or code.";

    /**
     * 生成 N 碼數字的 OTP (N 由 OtpConfig 設定)
     * @return N 碼字串
     */
    private String generateSixDigitCode() {
        // 使用配置的長度來生成，以確保靈活性
        int min = (int) Math.pow(10, otpConfig.getCodeLength() - 1);
        int max = (int) Math.pow(10, otpConfig.getCodeLength()) - 1;
        int number = RANDOM.nextInt(max - min + 1) + min;
        return String.valueOf(number);
    }

    /**
     * 處理發送 OTP 流程：生成、儲存雜湊、發送郵件。
     * @param email 使用者 email
     */
    @Transactional
    public void generateAndSendOtp(String email) {
        // 1. 查找用戶
        User user = userRepository.findByEmail(email).orElse(null);

        // 如果用戶不存在，靜默返回，防止 Email 列舉攻擊
        if (user == null) {
            log.warn("Attempt to request OTP for non-existent email: {}", email);
            return;
        }

        // 2. 刪除該用戶所有未過期的舊 OTP (確保一個時間點只有一個有效 OTP)
        otpCodeRepository.deleteByUserAndExpiryDateAfter(user, OffsetDateTime.now());

        // 3. 生成 OTP 原始碼和雜湊值
        String rawCode = generateSixDigitCode();
        String codeHash = passwordEncoder.encode(rawCode);

        // 4. 設定過期時間 (例如 15 分鐘)
        OffsetDateTime expiryDate = OffsetDateTime.now().plus(otpConfig.getExpirationDuration());

        // 5. 儲存 OtpCode 實體 (儲存雜湊值)
        OtpCode otpCode = new OtpCode(codeHash, user, expiryDate);
        otpCodeRepository.save(otpCode);

        // 6. 發送郵件 (發送原始碼)
        String subject = "VocabMatrix: Your single login verification code";
        // 確保內容使用 otpConfig 的分鐘數
        String content = String.format("Your single login verification code is: <b>%s</b>. This code will expire in %d minutes.",
                rawCode, otpConfig.getExpirationDuration().toMinutes());

        // 修正：呼叫通用的 MailService 異步發送郵件
        mailService.sendMail(user.getEmail(), subject, content);

        log.info("Successfully generated and sent OTP for user: {}", user.getUsername());
    }

    /**
     * 驗證使用者輸入的 OTP 碼，並在成功後發行 JWT Token。
     * @param email 使用者 email
     * @param rawCode 使用者輸入的 6 碼
     * @return 包含 Access/Refresh Token 和用戶資訊的 LoginResponseDTO
     * @throws BadCredentialsException 驗證碼錯誤、過期或已被使用
     */
    @Transactional
    public LoginResponseDTO verifyOtpCodeAndLogin(String email, String rawCode) {
        log.info("Attempting OTP verification for email: {}", email);

        // 1. 查找用戶 (OTP 登入的鎖定機制不同，這裡不做鎖定檢查，而是使用 OTP 的唯一性)
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException(BAD_CREDENTIALS_MSG));

        // 2. 根據用戶查找最新的、未使用的 OTP 碼
        List<OtpCode> codes = otpCodeRepository.findByUserAndIsUsed(user, false);

        // 如果找不到任何未使用的 OTP 碼
        if (codes.isEmpty()) {
            throw new BadCredentialsException(BAD_CREDENTIALS_MSG);
        }

        // 遍歷所有未使用的碼，找到最新的且匹配的
        OtpCode matchedOtp = null;
        for (OtpCode code : codes) {
            // 由於資料庫儲存的是雜湊值，必須對使用者輸入的原始碼進行比對
            if (passwordEncoder.matches(rawCode, code.getCodeHash())) {
                matchedOtp = code;
                break;
            }
        }

        // 3. 檢查 OTP 匹配
        if (matchedOtp == null) {
            // 如果驗證碼不匹配，拋出錯誤
            throw new BadCredentialsException(BAD_CREDENTIALS_MSG);
        }

        // 4. 檢查 OTP 是否過期
        if (matchedOtp.isExpired()) {
            // 標記為已使用 (避免未來再次比對，但主要靠過期時間)
            matchedOtp.setIsUsed(true);
            otpCodeRepository.save(matchedOtp);
            log.warn("OTP verification failed: Code expired for user: {}", user.getUsername());
            throw new BadCredentialsException("The verification code has expired.");
        }

        // 5. 檢查帳號狀態 (與 LoginService 保持一致)
        if (!user.isActiveStatus() || !user.getEmailVerified()) {
            log.warn("OTP login failed: User account not active/verified for user {}", user.getUsername());
            throw new BadCredentialsException("Account not active or email not verified. Please contact support.");
        }

        // 6. 驗證成功：標記為已使用並儲存
        matchedOtp.setIsUsed(true);
        otpCodeRepository.save(matchedOtp);

        // 7. 登入成功，重置嘗試計數 (如果有鎖定機制)
        loginAttemptService.resetAttempts(user.getEmail());

        // 8. 生成 Access Token 和 Refresh Token (與 AuthService 邏輯相同)
        List<String> roles = user.getIsAdmin()
                ? List.of("ADMIN", "USER")
                : List.of("USER");

        String accessToken = jwtTokenService.generateAccessToken(
                user.getId(),
                user.getEmail(),
                roles
        );

        String refreshToken = jwtTokenService.generateRefreshToken(user.getId());

        log.info("OTP verification successful for user: {}. Tokens generated.", user.getUsername());

        // 9. 返回登入回應 DTO
        return LoginResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(UserResponseDTO.fromEntity(user))
                .build();
    }
}