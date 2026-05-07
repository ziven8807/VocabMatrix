// src/main/java/com/vocabmatrix/backend/auth/controller/AuthController.java

package com.vocabmatrix.backend.auth.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

import com.vocabmatrix.backend.auth.dto.login.LoginRequestDTO;
import com.vocabmatrix.backend.auth.dto.login.LoginResponseDTO;
import com.vocabmatrix.backend.auth.dto.registration.ResendRegistrationEmailRequestDTO;
import com.vocabmatrix.backend.auth.dto.otp.OtpLoginRequestDTO;
import com.vocabmatrix.backend.auth.dto.otp.OtpRequestDTO;
import com.vocabmatrix.backend.auth.dto.passwordreset.PasswordForgotRequestDTO;
import com.vocabmatrix.backend.auth.dto.passwordreset.PasswordResetRequestDTO;
import com.vocabmatrix.backend.auth.dto.registration.RegistrationRequestDTO;
import com.vocabmatrix.backend.auth.service.LoginService;
import com.vocabmatrix.backend.auth.service.mail.RegistrationEmailService;
import com.vocabmatrix.backend.auth.service.PasswordResetService;
import com.vocabmatrix.backend.auth.service.RegistrationService;
import com.vocabmatrix.backend.auth.service.otp.OtpCodeService;
import com.vocabmatrix.backend.config.JwtConfig;
import com.vocabmatrix.backend.user.dto.UserResponseDTO;

/**
 * 處理與使用者身分驗證（Authentication）相關的流程，如註冊和信箱驗證。
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final RegistrationService registrationService;
    private final RegistrationEmailService registrationEmailService;
    private final LoginService loginService;
    private final JwtConfig jwtConfig;
    private final OtpCodeService otpCodeService;
    private final PasswordResetService passwordResetService;

    // =========================================================================
    // I. 註冊與 Email 驗證
    // =========================================================================
    /**
     * 處理新使用者註冊請求，並觸發驗證郵件發送。
     * POST /api/auth/register
     *
     * @param dto 註冊資料 (RegistrationRequestDTO)
     * @return 包含新使用者資訊的回應 (UserResponseDTO)
     */
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@Valid @RequestBody RegistrationRequestDTO dto) {
        log.info("Received new user registration request: {}", dto.getUsername());

        // UserService 內部處理了帳號建立、密碼雜湊、Token 生成和發信
        UserResponseDTO response = registrationService.registerUser(dto);

        // 註冊成功，返回 201 Created 狀態碼
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 處理電子郵件驗證連結點擊。
     * GET /api/auth/verify?token={rawToken}
     *
     * @param token 來自郵件連結的原始驗證 Token 字串
     * @return 驗證結果訊息
     */
    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        // 註：這裡只記錄 token 長度或前幾碼，避免將完整的原始 token 記錄到 Log 中。
        log.info("Received email verification request. Token length: {}", token.length());

        // EmailService 內部處理了 Token 雜湊、查找、檢查過期、啟用帳號和刪除 Token
        String resultMessage = registrationEmailService.verifyAccount(token);

        // 驗證成功，返回 200 OK 狀態碼
        // 實際前端應用會根據這個訊息或狀態進行頁面跳轉
        return ResponseEntity.ok(resultMessage);
    }

    // =========================================================================
    // 重新發送驗證信端點
    // =========================================================================

    /**
     * 處理重新發送驗證信的請求。
     * POST /api/auth/resend-registration-email
     *
     * @param request 包含 email 的請求 DTO，使用 @Valid 進行輸入驗證
     * @return 成功訊息
     */
    @PostMapping("/resend-registration-email")
    public ResponseEntity<String> resendRegistrationEmail(@Valid @RequestBody ResendRegistrationEmailRequestDTO request) {
        log.info("Received request to resend registration email for: {}", request.getEmail());

        // DTO 驗證通過後，將乾淨的 email 字串傳給 Service 層處理業務邏輯
        registrationEmailService.resendRegistrationEmail(request.getEmail());

        // 由於 resendRegistrationEmail()方法 會對找不到的用戶或已啟用的用戶靜默處理 (避免 email 枚舉攻擊)，
        // 因此我們總是返回一個通用的成功訊息，而不透露後端狀態。
        return ResponseEntity.ok("Registration email resent successfully, if the account exists and is not yet active.");
    }

    // =========================================================================
    // II. 登入
    // =========================================================================

    /**
     * 處理使用者登入請求。成功後返回 Access Token，並透過 HttpOnly Cookie 設置 Refresh Token。
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid LoginRequestDTO dto,
                                                  HttpServletResponse response) {

        // 1. 調用 LoginService 執行認證，並生成 Access/Refresh Token
        // LoginResponseDTO 現在包含 Access Token 和 Refresh Token 兩個字串
        LoginResponseDTO responseDTO = loginService.login(dto);

        // 2. 創建 HttpOnly Cookie 來傳輸 Refresh Token
        // 從 JwtConfig 中獲取所有配置
        ResponseCookie refreshCookie = ResponseCookie.from(jwtConfig.getRefreshTokenCookieName(), responseDTO.getRefreshToken())
                .httpOnly(true)
                .secure(jwtConfig.isCookieSecure())
                .path(jwtConfig.getRefreshTokenCookiePath())
                .maxAge(jwtConfig.getRefreshTokenExpiration())
                .sameSite(jwtConfig.getCookieSameSite())
                .build();

        // 3. 將 Refresh Token Cookie 加入到響應頭
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        // 4. 返回 Access Token 和用戶資訊（從返回體中移除 Refresh Token）
        return ResponseEntity.ok(
                LoginResponseDTO.builder()
                        .accessToken(responseDTO.getAccessToken())
                        .user(responseDTO.getUser())
                        .build()
        );
    }

    // =========================================================================
    // III. 刷新 Token
    // =========================================================================

    /**
     * 刷新 Access Token。從 HttpOnly Cookie 中讀取 Refresh Token，並返回新的 Access Token。
     */
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDTO> refresh(
            @CookieValue(name = "refresh_token") String refreshToken) {

        // 1. 調用 LoginService 刷新 Token
        LoginResponseDTO responseDTO = loginService.refreshToken(refreshToken);

        // 2. 返回新的 Access Token 和用戶資訊
        return ResponseEntity.ok(
                LoginResponseDTO.builder()
                        .accessToken(responseDTO.getAccessToken())
                        .user(responseDTO.getUser())
                        .build()
        );
    }

    // =========================================================================
    // IV. 登出
    // =========================================================================

    /**
     * 登出使用者，清除 HttpOnly Cookie 中的 Refresh Token。
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(value = "refresh_token", required = false) String refreshToken,
            HttpServletResponse response) {

        // 1. 執行伺服器端登出邏輯 (將 Refresh Token 列入黑名單，或從資料庫移除)
        if (refreshToken != null) {
            loginService.logout(refreshToken);
        }

        // 2. 清除客戶端瀏覽器上的 Refresh Token Cookie
        ResponseCookie clearCookie = ResponseCookie.from(jwtConfig.getRefreshTokenCookieName(), "")
                .httpOnly(true)
                .secure(jwtConfig.isCookieSecure())
                .path(jwtConfig.getRefreshTokenCookiePath())
                .maxAge(Duration.ZERO) // 立即過期
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, clearCookie.toString());

        // 3. 返回成功響應
        return ResponseEntity.noContent().build();
    }

    // =========================================================================
    // V. 無密碼登入 (OTP)
    // =========================================================================

    /**
     * 請求發送 OTP 驗證碼到指定電子郵件。
     * POST /api/auth/otp/request
     */
    @PostMapping("/otp/request")
    public ResponseEntity<String> requestOtpCode(@Valid @RequestBody OtpRequestDTO request) {
        log.info("Received OTP request for email: {}", request.getEmail());

        // 呼叫 Service 層處理 OTP 的生成、儲存和發送邏輯
        otpCodeService.generateAndSendOtp(request.getEmail());

        // 由於 Service 層對不存在的用戶會靜默處理，我們總是返回成功訊息以避免 Email 枚舉攻擊。
        return ResponseEntity.ok("OTP has been sent to your email, if the account exists.");
    }

    /**
     * 使用 OTP 驗證碼登入。
     * POST /api/auth/otp/login
     */
    @PostMapping("/otp/login")
    public ResponseEntity<LoginResponseDTO> otpLogin(@Valid @RequestBody OtpLoginRequestDTO dto,
                                                     HttpServletResponse response) {

        // 1. 調用 OtpCodeService 進行驗證並生成 Access/Refresh Token
        LoginResponseDTO responseDTO = otpCodeService.verifyOtpCodeAndLogin(
                dto.getEmail(),
                dto.getCode()
        );

        // 2. 創建 HttpOnly Cookie 來傳輸 Refresh Token (與密碼登入邏輯相同)
        ResponseCookie refreshCookie = ResponseCookie.from(jwtConfig.getRefreshTokenCookieName(), responseDTO.getRefreshToken())
                .httpOnly(true)
                .secure(jwtConfig.isCookieSecure())
                .path(jwtConfig.getRefreshTokenCookiePath())
                .maxAge(jwtConfig.getRefreshTokenExpiration())
                .sameSite(jwtConfig.getCookieSameSite())
                .build();

        // 3. 將 Refresh Token Cookie 加入到響應頭
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        // 4. 返回 Access Token 和用戶資訊
        return ResponseEntity.ok(
                LoginResponseDTO.builder()
                        .accessToken(responseDTO.getAccessToken())
                        .user(responseDTO.getUser())
                        // Refresh Token 必須從 JSON body 中移除
                        .refreshToken(null)
                        .build()
        );
    }

    // =========================================================================
// VI. 密碼重置 (忘記密碼)
// =========================================================================

    /**
     * 忘記密碼 - 發送密碼重置郵件
     * POST /api/auth/forgot-password
     *
     * 不需要登入，公開端點
     *
     * @param dto 包含 Email 的請求 DTO
     * @return 成功訊息（為了防止 Email 枚舉，無論 Email 是否存在都返回成功）
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody PasswordForgotRequestDTO dto) {
        log.info("Password reset requested for email: {}", dto.getEmail());

        // 呼叫 PasswordResetService 處理密碼重置邏輯
        passwordResetService.requestPasswordReset(dto);

        // 統一回應，不透露 Email 是否存在（防止 Email 枚舉攻擊）
        return ResponseEntity.ok("If your email is registered, you will receive a password reset link shortly.");
    }

    /**
     * 重置密碼 - 使用 Token 設定新密碼
     * POST /api/auth/reset-password
     *
     * 不需要登入，公開端點（使用 Token 驗證身份）
     *
     * @param dto 包含 Token、新密碼和確認密碼的請求 DTO
     * @return 成功訊息
     */
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody PasswordResetRequestDTO dto) {  // ✅ 修正 DTO 名稱
        log.info("Password reset attempted with token (length: {})", dto.getToken().length());

        // 呼叫 PasswordResetService 驗證 Token 並重置密碼
        String result = passwordResetService.resetPassword(dto);

        return ResponseEntity.ok(result);
    }

}