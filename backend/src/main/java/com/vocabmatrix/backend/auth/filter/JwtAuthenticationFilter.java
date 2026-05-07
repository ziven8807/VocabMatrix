// src/main/java/com/vocabmatrix/backend/auth/filter/JwtAuthenticationFilter.java

package com.vocabmatrix.backend.auth.filter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.vocabmatrix.backend.auth.service.jwt.JwtTokenService;
import com.vocabmatrix.backend.common.dto.ErrorResponseDTO;
import com.vocabmatrix.backend.security.AuthenticatedUser;

/**
 * JWT 認證過濾器
 * 負責攔截每個請求，檢查並驗證 Access Token。
 * 成功驗證後設置 Spring Security 上下文；失敗時返回 HTTP 401 JSON 錯誤。
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenService jwtTokenService;
    // 注入 ObjectMapper，用於將錯誤回應轉換為 JSON
    private final ObjectMapper objectMapper;

    private static final String ACCESS_TOKEN_COOKIE_NAME = "access_token";

    // =========================================================
    // 核心過濾邏輯
    // =========================================================
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 1. 嘗試從 Header 或 Cookie 獲取 Token
        String token = getToken(request);

        if (StringUtils.hasText(token)) {
            try {
                // 2. 呼叫 Service 驗證 Token (會拋出例外)
                Claims claims = jwtTokenService.validateAccessToken(token);

                // 3. 驗證 Token 類型 (確保不是 Refresh Token)
                if (!"access".equals(claims.get("type"))) {
                    throw new JwtException("Token type is not 'access'.");
                }

                // 4. 建立並設置 Spring Security 認證上下文
                setAuthenticationContext(claims);

            } catch (ExpiredJwtException e) {
                log.info("Access Token Expired: {}", e.getMessage());
                // 處理 Token 過期錯誤
                handleAuthenticationFailure(response, "Access Token Expired", request.getRequestURI());
                return; // 終止過濾器鏈

            } catch (JwtException e) {
                log.warn("Invalid JWT: {}", e.getMessage());
                // 處理簽名無效或格式錯誤
                handleAuthenticationFailure(response, "Invalid or Malformed Access Token", request.getRequestURI());
                return; // 終止過濾器鏈
            } catch (Exception e) {
                // 捕獲其他解析錯誤 (如 claims 中字段轉換錯誤)
                log.error("Error setting security context: {}", e.getMessage());
                handleAuthenticationFailure(response, "Internal Token Processing Error", request.getRequestURI());
                return;
            }
        }

        // 5. 繼續過濾器鏈
        filterChain.doFilter(request, response);
    }

    // =========================================================
    // 輔助方法
    // =========================================================

    /**
     * 從 Claims 中提取用戶信息並設置到 SecurityContextHolder。
     */
    private void setAuthenticationContext(Claims claims) {
        Long userId = Long.parseLong(claims.getSubject());
        // 假設在 JWT 裡也有存 username，如果沒有，就先放個空字串或 ID
        String username = claims.get("username", String.class);

        @SuppressWarnings("unchecked")
        List<String> roles = claims.get("roles", List.class);
        List<SimpleGrantedAuthority> authorities = roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        // --- 封裝成 AuthenticatedUser 物件 ---
        AuthenticatedUser principal = AuthenticatedUser.builder()
                .id(userId)
                .username(username != null ? username : userId.toString())
                .authorities(authorities)
                .build();

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(principal, null, authorities);

        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    /**
     * 從 Header 或 Cookie 獲取 Token
     */
    private String getToken(HttpServletRequest request) {
        String token = getTokenFromHeader(request);
        if (!StringUtils.hasText(token)) {
            token = getTokenFromCookie(request);
        }
        return token;
    }

    /**
     * 從 Authorization Header 取得 Bearer Token。
     */
    private String getTokenFromHeader(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    /**
     * 從 Cookie 取得 access_token。
     */
    private String getTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        for (Cookie cookie : request.getCookies()) {
            if (ACCESS_TOKEN_COOKIE_NAME.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    /**
     * 處理認證失敗回應，將錯誤轉換為 JSON 格式。
     */
    private void handleAuthenticationFailure(HttpServletResponse response,
                                             String message, String path) throws IOException {

        // 設置 HTTP 狀態碼為 401 UNAUTHORIZED
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        // 建立標準的錯誤回應 DTO
        ErrorResponseDTO errorResponse = ErrorResponseDTO.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .error(HttpStatus.UNAUTHORIZED.getReasonPhrase()) // "Unauthorized"
                .message(message)
                .path(path)
                .build();

        // 寫入 JSON 響應
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }

    /**
     * 排除不需要過濾的路徑 (如 /auth/** 和 /favicon.ico)
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath(); // 建議用 getServletPath() 比較精準

        // 路徑: 包含 /api 字樣，或者用更寬鬆的匹配
        return path.startsWith("/api/auth/") ||
                path.startsWith("/auth/") ||
                path.equals("/favicon.ico");
    }
}