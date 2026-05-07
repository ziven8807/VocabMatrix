// src/main/java/com/vocabmatrix/backend/auth/service/LoginService.java

package com.vocabmatrix.backend.auth.service;

import java.time.Duration;
import java.util.Date;
import java.util.List;
import java.util.Set;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vocabmatrix.backend.auth.dto.login.LoginRequestDTO;
import com.vocabmatrix.backend.auth.dto.login.LoginResponseDTO;
import com.vocabmatrix.backend.auth.exception.AccountLockedException;
import com.vocabmatrix.backend.auth.exception.BadCredentialsException;
import com.vocabmatrix.backend.auth.service.jwt.JwtTokenService;
import com.vocabmatrix.backend.config.JwtConfig;
import com.vocabmatrix.backend.user.dto.UserResponseDTO;
import com.vocabmatrix.backend.user.entity.User;
import com.vocabmatrix.backend.user.repository.UserRepository;

/**
 * 認證服務 (Authentication Service)
 * 負責處理登入、密碼驗證、Token 生成與撤銷等安全相關的業務邏輯。
 * 核心目標是分離 Controller 與底層安全細節，確保業務邏輯的純粹性。
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LoginService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;
    private final StringRedisTemplate redisTemplate;
    private final JwtConfig jwtConfig;

    // --- 整合 LoginAttemptService ---
    private final LoginAttemptService loginAttemptService;

    /** Redis Key 前綴：用於標記被撤銷的 Refresh Token */
    private static final String REFRESH_TOKEN_BLACKLIST_PREFIX = "revoke:refresh:";

    /** Redis Key 前綴：用於儲存該用戶所有的活動 Refresh Token 字串 (使用 Set) */
    private static final String ACTIVE_REFRESH_TOKENS_PREFIX = "active:refresh:user:";

    /**
     * 處理使用者登入請求。
     *
     * 1. 查找使用者（Username 或 Email）。
     * 2. 檢查帳號是否被鎖定。
     * 3. 驗證密碼是否匹配。
     * 4. 檢查帳號狀態（啟用、信箱驗證）。
     * 5. 生成 Access Token 和 Refresh Token。
     *
     * @param dto 登入請求 DTO
     * @return LoginResponseDTO 包含 Access Token、Refresh Token 字串和 User 資訊
     * @throws BadCredentialsException 登入憑證無效 (用戶不存在、密碼錯誤、帳號未啟用)
     * @throws AccountLockedException 帳號因多次失敗而被鎖定
     */
    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginRequestDTO dto) {

        // 統一錯誤訊息，防止時序攻擊 (Timing Attack) 洩露資訊
        final String BAD_CREDENTIALS_MSG = "Invalid username/email or password.";

        User user = userRepository.findByUsernameOrEmail(dto.getIdentifier(), dto.getIdentifier())
                .orElseThrow(() -> {
                    // 如果用戶不存在，不記錄失敗嘗試。
                    log.warn("Login failed: User not found for identifier {}", dto.getIdentifier());
                    return new BadCredentialsException(BAD_CREDENTIALS_MSG);
                });

        // ------------------ 鎖定機制整合 1: 檢查鎖定狀態 ------------------
        if (loginAttemptService.isAccountLocked(user.getEmail())) {
            long remainingTime = loginAttemptService.getRemainingLockTime(user.getEmail());
            String message = String.format(
                    "Account is locked due to too many failed login attempts. Please try again in %d seconds.",
                    remainingTime
            );
            // 拋出鎖定例外，由 ControllerAdvice 處理為 403 Forbidden
            throw new AccountLockedException(message, remainingTime);
        }

        // 密碼驗證
        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            // ------------------ 鎖定機制整合 2: 記錄失敗嘗試 ------------------
            loginAttemptService.recordFailedAttempt(user.getEmail());

            // 由於 recordFailedAttempt 不拋出例外，我們需要額外檢查是否剛剛被鎖定
            if (loginAttemptService.isAccountLocked(user.getEmail())) {
                long remainingTime = loginAttemptService.getRemainingLockTime(user.getEmail());
                String message = String.format(
                        "Password mismatch. Account is now locked due to max attempts. Please try again in %d seconds.",
                        remainingTime
                );
                // 拋出鎖定例外
                throw new AccountLockedException(message, remainingTime);
            }

            log.warn("Login failed: Password mismatch for user {}", user.getUsername());
            throw new BadCredentialsException(BAD_CREDENTIALS_MSG);
        }

        // ------------------ 鎖定機制整合 3: 登入成功，重置嘗試計數 ------------------
        loginAttemptService.resetAttempts(user.getEmail());

        // 帳號狀態檢查
        if (!user.isActiveStatus() || !user.getEmailVerified()) {
            log.warn("Login failed: User account not active/verified for user {}", user.getUsername());
            throw new BadCredentialsException("Account not active or email not verified. Please check your email.");
        }

        // 準備角色
        List<String> roles = user.getIsAdmin()
                ? List.of("ADMIN", "USER")
                : List.of("USER");

        // 生成 Access Token (短效) 和 Refresh Token (長效)
        String accessToken = jwtTokenService.generateAccessToken(
                user.getId(),
                user.getEmail(),
                roles
        );

        String refreshToken = jwtTokenService.generateRefreshToken(user.getId());

        // 將 Token 加入活動 Set (Active Refresh Tokens Set)
        String activeTokensKey = ACTIVE_REFRESH_TOKENS_PREFIX + user.getId();
        redisTemplate.opsForSet().add(activeTokensKey, refreshToken);
        redisTemplate.expire(activeTokensKey, jwtConfig.getRefreshTokenExpiration());

        // 返回所有必要的資訊
        return LoginResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(UserResponseDTO.fromEntity(user))
                .build();
    }

    /**
     * 刷新 Token。
     * 1. 檢查 Refresh Token 是否被列入黑名單。
     * 2. 驗證 Refresh Token 的有效性。
     * 3. 根據 Token 資訊生成新的 Access Token。
     *
     * @param refreshToken 舊的 Refresh Token (來自 HttpOnly Cookie)
     * @return LoginResponseDTO 包含新的 Access Token 和舊的 Refresh Token
     * @throws BadCredentialsException Token 驗證失敗、用戶不存在或 Token 已被撤銷
     */
    @Transactional(readOnly = true)
    public LoginResponseDTO refreshToken(String refreshToken) {

        // 檢查 Token 是否已被撤銷 (黑名單)
        if (isTokenBlacklisted(refreshToken)) {
            log.warn("Refresh failed: Token found in blacklist.");
            throw new BadCredentialsException("The refresh token has been revoked.");
        }

        // 驗證 Token 並解析 Claims
        Claims claims = jwtTokenService.validateRefreshToken(refreshToken);

        Long userId = Long.parseLong(claims.getSubject());

        // 查找用戶以獲取最新資訊和角色
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadCredentialsException("Invalid refresh token payload: User not found."));

        List<String> roles = user.getIsAdmin()
                ? List.of("ADMIN", "USER")
                : List.of("USER");

        // 生成新的 Access Token
        String newAccessToken = jwtTokenService.generateAccessToken(
                user.getId(),
                user.getEmail(),
                roles
        );

        // 返回新的 Access Token，舊的 Refresh Token 繼續使用
        return LoginResponseDTO.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .user(UserResponseDTO.fromEntity(user))
                .build();
    }

    /**
     * 登出操作：使 Refresh Token 立即失效（加入 Redis 黑名單）。
     *
     * 1. 解析 Token，計算其剩餘生命週期 (TTL)。
     * 2. 將 Token 存入 Redis，TTL 設為剩餘生命週期。
     * 3. 這樣可以防止被盜用的 Token 在自然過期前被使用。
     *
     * @param refreshToken 待失效的 Refresh Token
     */
    public void logout(String refreshToken) {
        try {
            // 驗證 Token 以確定其到期時間
            Claims claims = jwtTokenService.validateRefreshToken(refreshToken);

            Date expiration = claims.getExpiration();
            long now = System.currentTimeMillis();

            // 如果 Token 已經過期，則無需加入黑名單
            if (expiration.getTime() <= now) {
                log.info("Logout request: Refresh Token already expired or invalid.");
                return;
            }

            // 計算 Token 剩餘的生命週期 (Time-To-Live)
            Duration timeToLive = Duration.ofMillis(expiration.getTime() - now);

            String key = REFRESH_TOKEN_BLACKLIST_PREFIX + refreshToken;

            // 將 Token 加入 Redis 黑名單，TTL 設定為剩餘時間
            redisTemplate.opsForValue().set(key, "revoked", timeToLive);
            log.info("Refresh Token for user ID {} added to blacklist with TTL: {} seconds.",
                    claims.getSubject(), timeToLive.getSeconds());

        } catch (Exception e) {
            // Token 無效時，仍然允許登出流程（Controller 負責清除 Cookie）
            log.warn("Logout request: Failed to validate token for blacklisting: {}", e.getMessage());
        }
    }

    /**
     * 檢查 Refresh Token 是否在黑名單中。
     *
     * @param token 待檢查的 Refresh Token
     * @return boolean True 如果 Token 已被撤銷。
     */
    private boolean isTokenBlacklisted(String token) {
        // 使用 equals(Boolean.TRUE, ...) 確保即使 redisTemplate.hasKey 返回 null 也能安全處理
        return Boolean.TRUE.equals(redisTemplate.hasKey(REFRESH_TOKEN_BLACKLIST_PREFIX + token));
    }

    /**
     * 強制撤銷指定用戶所有活動的 Refresh Token。
     * 用於在用戶密碼更改或帳號強制登出等安全事件後，使該用戶在所有設備上的會話立即失效。
     * 機制：遍歷 Redis 中該用戶的活動 Token 索引，將每個 Token 加入黑名單，然後清除該索引。
     *
     * @param userId 欲撤銷 Token 的使用者 ID
     * @see #logout(String)
     */
    @Transactional // 使用事務，確保 Redis 操作原子性
    public void revokeAllTokensForUser(Long userId) {
        String activeTokensKey = ACTIVE_REFRESH_TOKENS_PREFIX + userId;

        Set<String> activeTokens = redisTemplate.opsForSet().members(activeTokensKey);

        if (activeTokens == null || activeTokens.isEmpty()) {
            log.info("Revocation skipped: User ID {} has no active refresh tokens to revoke.", userId);
            return;
        }

        log.warn("Revoking {} active refresh tokens for user ID {}...", activeTokens.size(), userId);

        for (String token : activeTokens) {
            this.logout(token); // 重用 logout 邏輯將 Token 加入黑名單
        }

        redisTemplate.delete(activeTokensKey);
        log.info("Successfully revoked all tokens and cleaned up active token list for user ID {}.", userId);
    }

}