// src/test/java/com/vocabmatrix/backend/auth/service/LoginServiceTest.java

package com.vocabmatrix.backend.auth.service;

import com.vocabmatrix.backend.auth.dto.login.LoginRequestDTO;
import com.vocabmatrix.backend.auth.dto.login.LoginResponseDTO;
import com.vocabmatrix.backend.auth.exception.AccountLockedException;
import com.vocabmatrix.backend.auth.exception.BadCredentialsException;
import com.vocabmatrix.backend.auth.service.jwt.JwtTokenService;
import com.vocabmatrix.backend.config.JwtConfig;
import com.vocabmatrix.backend.user.entity.User;
import com.vocabmatrix.backend.user.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Duration;
import java.util.Date;
import java.util.Optional;

import static com.vocabmatrix.backend.user.entity.User.UserStatus.ACTIVE;
import static com.vocabmatrix.backend.user.entity.User.UserStatus.INACTIVE;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

// 使用 Mockito 擴展，讓 @Mock 和 @InjectMocks 自動生效
// 不啟動 Spring Context，測試速度快
@ExtendWith(MockitoExtension.class)
class LoginServiceTest {

    // =========================================================
    // Mock 宣告
    // 這裡宣告的每一個 @Mock，都對應 LoginService 裡的一個 final 欄位。
    // 缺少任何一個，@InjectMocks 注入時那個欄位就會是 null，
    // 一旦程式碼呼叫到它就會拋出 NullPointerException。
    // =========================================================

    // 模擬資料庫查詢，不真正連線 PostgreSQL
    @Mock private UserRepository userRepository;

    // 模擬密碼加密器，避免真正執行 bcrypt 運算
    @Mock private PasswordEncoder passwordEncoder;

    // 模擬 JWT 簽發與驗證，不需要真實密鑰
    @Mock private JwtTokenService jwtTokenService;

    // 模擬 Redis 連線，不需要啟動真實 Redis
    @Mock private StringRedisTemplate redisTemplate;

    // 模擬 JWT 設定檔，控制 Token 過期時間等參數
    @Mock private JwtConfig jwtConfig;

    // 模擬登入失敗次數計數器（鎖定機制）
    @Mock private LoginAttemptService loginAttemptService;

    // redisTemplate.opsForValue() 回傳的操作物件（用於黑名單 set）
    @Mock private ValueOperations<String, String> valueOps;

    // redisTemplate.opsForSet() 回傳的操作物件（用於活動 Token 索引）
    @Mock private SetOperations<String, String> setOps;

    // JWT 解析後的 Claims 物件（Token 內容）
    @Mock private Claims claims;

    // 注入上面所有 Mock，建立真正的 LoginService 實例來測試
    @InjectMocks
    private LoginService loginService;

    // 每個測試共用的假資料
    private LoginRequestDTO loginDto;
    private User activeUser;

    // 每個測試執行前都會先跑這裡，準備共用的假資料
    @BeforeEach
    void setUp() {
        loginDto = new LoginRequestDTO();
        loginDto.setIdentifier("testuser");
        loginDto.setPassword("password123");

        // 正常、已啟用、已驗證信箱的使用者
        activeUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .passwordHash("encodedPassword")
                .status(ACTIVE)
                .emailVerified(true)
                .isAdmin(false)
                .build();
    }

    // =========================================================
    // login() 測試
    // =========================================================

    // 情境 1：正常登入流程，驗證回傳的 Token 和使用者資訊正確
    @Test
    void login_success() {
        // 假設帳號存在
        when(userRepository.findByUsernameOrEmail(any(), any()))
                .thenReturn(Optional.of(activeUser));
        // 假設帳號未被鎖定
        when(loginAttemptService.isAccountLocked(activeUser.getEmail()))
                .thenReturn(false);
        // 假設密碼正確
        when(passwordEncoder.matches("password123", "encodedPassword"))
                .thenReturn(true);
        // 假設 JWT 生成回傳固定字串
        when(jwtTokenService.generateAccessToken(any(Long.class), any(String.class), anyList()))
                .thenReturn("access-token");
        // any(Long.class) 解決 generateRefreshToken 有 Long/User 兩個 overload 的歧義問題
        when(jwtTokenService.generateRefreshToken(any(Long.class)))
                .thenReturn("refresh-token");
        // 假設 Refresh Token 過期時間為 7 天（寫入 Redis TTL 時需要）
        when(jwtConfig.getRefreshTokenExpiration())
                .thenReturn(Duration.ofDays(7));
        // opsForSet() 不能回傳 null，否則 .add() 呼叫會拋 NullPointerException
        when(redisTemplate.opsForSet()).thenReturn(setOps);

        LoginResponseDTO result = loginService.login(loginDto);

        assertThat(result.getAccessToken()).isEqualTo("access-token");
        assertThat(result.getRefreshToken()).isEqualTo("refresh-token");
        assertThat(result.getUser().getUsername()).isEqualTo("testuser");
        // 驗證登入成功後有重置失敗計數
        verify(loginAttemptService).resetAttempts(activeUser.getEmail());
    }

    // 情境 2：帳號不存在，應拋出 BadCredentialsException
    // 使用統一錯誤訊息，避免讓攻擊者區分「帳號不存在」和「密碼錯誤」
    @Test
    void login_userNotFound_throwsBadCredentials() {
        when(userRepository.findByUsernameOrEmail(any(), any()))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> loginService.login(loginDto))
                .isInstanceOf(BadCredentialsException.class);
    }

    // 情境 3：帳號已被鎖定，應直接拒絕並拋出 AccountLockedException
    // 這是鎖定機制的第一道防線：在驗證密碼之前就攔截
    @Test
    void login_accountLocked_throwsAccountLockedException() {
        when(userRepository.findByUsernameOrEmail(any(), any()))
                .thenReturn(Optional.of(activeUser));
        when(loginAttemptService.isAccountLocked(activeUser.getEmail()))
                .thenReturn(true);
        when(loginAttemptService.getRemainingLockTime(activeUser.getEmail()))
                .thenReturn(120L);

        assertThatThrownBy(() -> loginService.login(loginDto))
                .isInstanceOf(AccountLockedException.class);
    }

    // 情境 4：密碼錯誤但尚未達到鎖定門檻，應記錄失敗次數並拋出 BadCredentialsException
    @Test
    void login_wrongPassword_throwsBadCredentials() {
        when(userRepository.findByUsernameOrEmail(any(), any()))
                .thenReturn(Optional.of(activeUser));
        when(loginAttemptService.isAccountLocked(activeUser.getEmail()))
                .thenReturn(false);
        when(passwordEncoder.matches(any(), any())).thenReturn(false);
        // recordFailedAttempt 之後再次檢查，仍未達鎖定門檻
        when(loginAttemptService.isAccountLocked(activeUser.getEmail()))
                .thenReturn(false);

        assertThatThrownBy(() -> loginService.login(loginDto))
                .isInstanceOf(BadCredentialsException.class);

        // 驗證失敗次數有被記錄
        verify(loginAttemptService).recordFailedAttempt(activeUser.getEmail());
    }

    // 情境 5：密碼錯誤且這次失敗剛好觸發鎖定，應立即拋出 AccountLockedException
    // thenReturn(false).thenReturn(true) 模擬「第一次檢查未鎖定、recordFailedAttempt 後第二次檢查已鎖定」
    @Test
    void login_wrongPassword_reachesMaxAttempts_throwsAccountLockedException() {
        when(userRepository.findByUsernameOrEmail(any(), any()))
                .thenReturn(Optional.of(activeUser));
        when(loginAttemptService.isAccountLocked(activeUser.getEmail()))
                .thenReturn(false)  // 第一次：進入前未鎖定
                .thenReturn(true);  // 第二次：recordFailedAttempt 後剛好鎖定
        when(passwordEncoder.matches(any(), any())).thenReturn(false);
        when(loginAttemptService.getRemainingLockTime(activeUser.getEmail()))
                .thenReturn(300L);

        assertThatThrownBy(() -> loginService.login(loginDto))
                .isInstanceOf(AccountLockedException.class);
    }

    // 情境 6：帳號未啟用或信箱未驗證，應拋出 BadCredentialsException
    @Test
    void login_inactiveAccount_throwsBadCredentials() {
        User inactiveUser = User.builder()
                .id(2L)
                .username("inactive")
                .email("inactive@example.com")
                .passwordHash("encodedPassword")
                .status(INACTIVE)
                .emailVerified(false)
                .isAdmin(false)
                .build();

        when(userRepository.findByUsernameOrEmail(any(), any()))
                .thenReturn(Optional.of(inactiveUser));
        when(loginAttemptService.isAccountLocked(inactiveUser.getEmail()))
                .thenReturn(false);
        when(passwordEncoder.matches(any(), any())).thenReturn(true);

        assertThatThrownBy(() -> loginService.login(loginDto))
                .isInstanceOf(BadCredentialsException.class);
    }

    // =========================================================
    // refreshToken() 測試
    // =========================================================

    // 情境 1：Token 有效且不在黑名單，應成功回傳新的 Access Token
    // 注意：舊的 Refresh Token 繼續沿用，不重新簽發
    @Test
    void refreshToken_success() {
        String token = "valid-refresh-token";

        when(redisTemplate.hasKey("revoke:refresh:" + token)).thenReturn(false);
        when(jwtTokenService.validateRefreshToken(token)).thenReturn(claims);
        when(claims.getSubject()).thenReturn("1");
        when(userRepository.findById(1L)).thenReturn(Optional.of(activeUser));
        when(jwtTokenService.generateAccessToken(any(Long.class), any(String.class), anyList()))
                .thenReturn("new-access-token");

        LoginResponseDTO result = loginService.refreshToken(token);

        assertThat(result.getAccessToken()).isEqualTo("new-access-token");
        // 舊 Refresh Token 原封不動回傳
        assertThat(result.getRefreshToken()).isEqualTo(token);
    }

    // 情境 2：Token 已在黑名單（使用者已登出），應拒絕並拋出 BadCredentialsException
    // verifyNoInteractions 確認攔截發生在驗證 Token 之前，不會多做任何事
    @Test
    void refreshToken_blacklisted_throwsBadCredentials() {
        String token = "blacklisted-token";

        when(redisTemplate.hasKey("revoke:refresh:" + token)).thenReturn(true);

        assertThatThrownBy(() -> loginService.refreshToken(token))
                .isInstanceOf(BadCredentialsException.class);

        // 黑名單攔截後，後續的 JWT 驗證根本不應該被執行
        verifyNoInteractions(jwtTokenService);
    }

    // =========================================================
    // logout() 測試
    // =========================================================

    // 情境 1：Token 有效且尚未過期，應將其加入 Redis 黑名單並附上正確 TTL
    // TTL = Token 剩餘有效時間，確保黑名單不會永久佔用記憶體
    @Test
    void logout_validToken_addsToBlacklist() {
        String token = "valid-refresh-token";
        // 設定過期時間在 10 分鐘後，確保 TTL 計算有意義
        Date futureExpiry = new Date(System.currentTimeMillis() + 600_000);

        when(jwtTokenService.validateRefreshToken(token)).thenReturn(claims);
        when(claims.getExpiration()).thenReturn(futureExpiry);
        when(claims.getSubject()).thenReturn("1");
        // opsForValue() 不能回傳 null，否則 .set() 呼叫會拋 NullPointerException
        when(redisTemplate.opsForValue()).thenReturn(valueOps);

        loginService.logout(token);

        // 驗證黑名單寫入有發生，key 和 value 正確，TTL 有被帶入
        verify(valueOps).set(eq("revoke:refresh:" + token), eq("revoked"), any());
    }
}