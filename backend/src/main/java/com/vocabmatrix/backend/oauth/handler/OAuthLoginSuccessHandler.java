// src/main/java/com/vocabmatrix/backend/oauth/handler/OAuthLoginSuccessHandler.java

package com.vocabmatrix.backend.oauth.handler;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.vocabmatrix.backend.auth.service.jwt.JwtTokenService;
import com.vocabmatrix.backend.oauth.model.AuthenticatedOAuthUser;
import com.vocabmatrix.backend.user.entity.User;
import com.vocabmatrix.backend.user.repository.UserRepository;
import com.vocabmatrix.backend.user.service.AccountLinkingService;

@Component
@RequiredArgsConstructor
@Slf4j
// Spring 規定的 OAuth 登入成功後的處理器，繼承後覆寫 onAuthenticationSuccess
public class OAuthLoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenService jwtTokenService;         // 負責產生 JWT token
    private final AccountLinkingService accountLinkingService; // 負責帳號綁定邏輯
    private final UserRepository userRepository;           // 負責查詢資料庫的使用者

    // 從設定檔讀取前端網址（例如 http://localhost:3000）
    @Value("${app.frontend-url}")
    private String frontendUrl;

    /**
     * Spring 規定的固定寫法，OAuth 登入成功後自動被呼叫
     */
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        // 從 Spring Security 拿到登入的使用者資料
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        // 確認格式是我們自己包裝的 AuthenticatedOAuthUser，不是就報錯
        if (!(oauth2User instanceof AuthenticatedOAuthUser authenticatedUser)) {
            throw new IllegalStateException("Unexpected user type");
        }

        // 綁定成功/失敗後要導向的設定頁網址
        String targetSettingsUrl = frontendUrl + "/settings/components/account-links";

        // 判斷這次是「綁定流程」還是「一般登入」
        // 綁定流程會在 Session 裡放一個 oauth_linking 標記
        boolean isLinkingFlow = Boolean.TRUE.equals(request.getSession().getAttribute("oauth_linking"));

        if (isLinkingFlow) {
            handleLinkingFlow(request, response, authenticatedUser, targetSettingsUrl);
            return;
        }

        handleNormalLogin(request, response, authenticatedUser);
    }

    /**
     * 綁定流程：把 Google/FB 帳號連結到現有的本地帳號
     */
    private void handleLinkingFlow(HttpServletRequest request,
                                   HttpServletResponse response,
                                   AuthenticatedOAuthUser authenticatedUser,
                                   String targetSettingsUrl) throws IOException {
        try {
            // 從 Session 取得當前登入的使用者 ID
            Long currentUserId = getCurrentUserIdFromSession(request);
            if (currentUserId == null) {
                throw new IllegalStateException("無法取得當前使用者 ID");
            }

            // 從網址判斷是哪個第三方（google 或 facebook）
            String providerName = extractProviderFromRequest(request);
            String providerUserId = authenticatedUser.getName(); // 第三方平台的唯一 ID
            String email = authenticatedUser.getEmail();

            log.info("開始綁定流程: userId={}, provider={}, providerUserId={}",
                    currentUserId, providerName, providerUserId);

            // 執行綁定，把第三方帳號寫入 oauth_accounts 表
            accountLinkingService.linkProvider(currentUserId, providerName, providerUserId, email);

            log.info("綁定成功：User {} 連結了 {}", currentUserId, providerName);

            // 清除 Session 裡的綁定標記
            clearLinkingSession(request);

            // 綁定成功，導回設定頁並帶上成功訊息
            String successUrl = targetSettingsUrl + "?status=success&message=" +
                    URLEncoder.encode("綁定成功", StandardCharsets.UTF_8);
            getRedirectStrategy().sendRedirect(request, response, successUrl);

        } catch (Exception e) {
            log.error("綁定過程中出錯: {}", e.getMessage(), e);
            clearLinkingSession(request);

            // 綁定失敗，導回設定頁並帶上錯誤訊息
            String errorMsg = URLEncoder.encode(e.getMessage(), StandardCharsets.UTF_8);
            String errorUrl = targetSettingsUrl + "?status=error&message=" + errorMsg;
            getRedirectStrategy().sendRedirect(request, response, errorUrl);
        }
    }

    /**
     * 一般登入流程：發 JWT，導回前端
     */
    private void handleNormalLogin(HttpServletRequest request,
                                   HttpServletResponse response,
                                   AuthenticatedOAuthUser authenticatedUser) throws IOException {

        // 防呆：正常登入不應該出現 userId 是 null 的情況
        if (authenticatedUser.getUserId() == null) {
            log.error("一般登入流程但 userId 為 null，這不應該發生");
            String errorMsg = URLEncoder.encode("系統錯誤：無法處理此 OAuth 登入", StandardCharsets.UTF_8);
            clearLinkingSession(request);
            getRedirectStrategy().sendRedirect(request, response,
                    frontendUrl + "/auth/login?error=" + errorMsg);
            return;
        }

        // 用 userId 去資料庫查完整的使用者資料
        User user = userRepository.findById(authenticatedUser.getUserId())
                .orElse(null);

        // 防呆：找不到使用者
        if (user == null) {
            log.error("找不到 userId={} 的使用者", authenticatedUser.getUserId());
            String errorMsg = URLEncoder.encode("使用者不存在", StandardCharsets.UTF_8);
            clearLinkingSession(request);
            getRedirectStrategy().sendRedirect(request, response,
                    frontendUrl + "/auth/login?error=" + errorMsg);
            return;
        }

        clearLinkingSession(request);

        // 產生 accessToken（短效，放網址給前端）
        String accessToken = jwtTokenService.generateAccessToken(user);
        // 產生 refreshToken（長效，放 cookie，前端 JS 看不到）
        String refreshToken = jwtTokenService.generateRefreshToken(user);

        // 把 refreshToken 寫進 httpOnly cookie（有效期 7 天）
        ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)  // 前端 JS 無法讀取，防止 XSS 攻擊
                .secure(false)   // 本地開發用 false，正式環境要改成 true
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 天
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

        // 把 accessToken 帶在網址，導回前端的 /oauth2/redirect 頁面處理
        String targetUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/oauth2/redirect")
                .queryParam("accessToken", accessToken)
                .build()
                .toUriString();

        log.info("OAuth 登入成功，導向: {}", targetUrl);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    /**
     * 從 Session 取得當前使用者的 ID（綁定流程用）
     */
    private Long getCurrentUserIdFromSession(HttpServletRequest request) {
        Object userId = request.getSession().getAttribute("oauth_linking_user_id");
        if (userId instanceof Long) {
            return (Long) userId;
        }
        // 有時候 Session 存的是字串格式，需要轉換
        if (userId instanceof String) {
            try {
                return Long.parseLong((String) userId);
            } catch (NumberFormatException e) {
                log.warn("無法解析使用者 ID: {}", userId);
            }
        }
        return null;
    }

    /**
     * 從請求網址判斷是哪個第三方登入（google 或 facebook）
     */
    private String extractProviderFromRequest(HttpServletRequest request) {
        String uri = request.getRequestURI();
        if (uri.contains("google")) return "google";
        if (uri.contains("facebook")) return "facebook";

        log.warn("無法從 URI 判斷 provider: {}", uri);
        return "unknown";
    }

    /**
     * 清除 Session 裡的綁定標記，避免影響後續請求
     */
    private void clearLinkingSession(HttpServletRequest request) {
        try {
            request.getSession().removeAttribute("oauth_linking");
            request.getSession().removeAttribute("oauth_linking_user_id");
        } catch (Exception e) {
            log.warn("清除 Session 綁定標記時發生錯誤", e);
        }
    }
}
