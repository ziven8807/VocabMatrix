// src/main/java/com/vocabmatrix/backend/common/filter/RateLimitFilter.java

package com.vocabmatrix.backend.common.filter;

import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.vocabmatrix.backend.common.dto.ErrorResponseDTO;
import com.vocabmatrix.backend.common.service.RateLimitService;
import com.vocabmatrix.backend.common.service.RateLimitService.LimitType;
import com.vocabmatrix.backend.common.exception.RateLimitExceededException;
import com.vocabmatrix.backend.common.util.IpUtils;

/**
 * 速率限制過濾器：使用滑動窗口檢查指定路徑的 IP 請求頻率。
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter { // 繼承 OncePerRequestFilter

    private final RateLimitService rateLimitService;
    private final ObjectMapper objectMapper; // 注入 ObjectMapper 進行專業 JSON 輸出

    /**
     * 核心過濾邏輯
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. 執行限流邏輯
        try {
            String clientIp = IpUtils.getClientIp(request);

            // 由於 shouldNotFilter 已經排除非 /api/auth 的路徑，
            // 這裡可以假設需要限流
            rateLimitService.checkRateLimit(clientIp, LimitType.AUTH);

        } catch (RateLimitExceededException e) {

            // 2. 處理超限異常並回傳 JSON 響應
            handleRateLimitExceeded(response, e, request.getRequestURI());
            return; // 終止請求鏈

        } catch (Exception e) {
            // 捕獲其他異常，防止 filter 鏈中斷
            log.error("RateLimitFilter 發生未預期錯誤", e);
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return;
        }

        // 3. 通過檢查，繼續執行
        filterChain.doFilter(request, response);
    }

    /**
     * 決定哪些路徑需要應用此限流器
     * 注意：此邏輯執行在 doFilterInternal 之前
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();

        // 只過濾 /api/auth/ 相關的路徑 (登入/註冊)
        // 確保 /api/auth/refresh 也在其中，防止惡意獲取 Token
        return !path.startsWith("/api/auth/");
    }

    /**
     * 統一處理限流超額異常並輸出 JSON 響應
     */
    private void handleRateLimitExceeded(HttpServletResponse response,
                                         RateLimitExceededException e,
                                         String path) throws IOException {

        // 設置 HTTP 狀態碼為 429 TOO_MANY_REQUESTS
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setHeader("Retry-After", String.valueOf(e.getRetryAfterSeconds()));
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        // 建立標準錯誤回應 DTO
        ErrorResponseDTO errorResponse = ErrorResponseDTO.builder()
                .status(HttpStatus.TOO_MANY_REQUESTS.value())
                .error(HttpStatus.TOO_MANY_REQUESTS.getReasonPhrase())
                .message(e.getMessage())
                .path(path)
                .build();

        // 寫入 JSON 響應
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}