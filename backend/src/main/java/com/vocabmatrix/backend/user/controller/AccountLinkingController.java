// src/main/java/com/vocabmatrix/backend/user/controller/AccountLinkingController.java

package com.vocabmatrix.backend.user.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.vocabmatrix.backend.user.service.AccountLinkingService;
import com.vocabmatrix.backend.user.dto.oauth.LinkedProviderDTO;
import com.vocabmatrix.backend.security.AuthenticatedUser;
import com.vocabmatrix.backend.oauth.model.AuthenticatedOAuthUser;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/user/account/links")
@RequiredArgsConstructor
public class AccountLinkingController {

    private final AccountLinkingService linkingService;

    /**
     * 取得當前使用者已綁定的第三方帳號列表
     * 支援 JWT 和 OAuth 兩種認證方式
     */
    @GetMapping
    public ResponseEntity<List<LinkedProviderDTO>> getLinkedProviders(Authentication authentication) {
        Long userId = extractUserId(authentication);

        if (userId == null) {
            log.error("無法從 Authentication 中提取使用者 ID");
            return ResponseEntity.status(401).build();
        }

        log.info("Fetching linked providers for user: {}", userId);
        List<LinkedProviderDTO> links = linkingService.getLinkedProviders(userId);
        return ResponseEntity.ok(links);
    }

    /**
     * 解除第三方帳號綁定 (google, facebook 等)
     */
    @DeleteMapping("/{provider}")
    public ResponseEntity<String> unlinkProvider(
            Authentication authentication,
            @PathVariable String provider) {

        Long userId = extractUserId(authentication);

        if (userId == null) {
            log.error("無法從 Authentication 中提取使用者 ID");
            return ResponseEntity.status(401).build();
        }

        log.info("User {} attempting to unlink provider: {}", userId, provider);
        linkingService.unlinkProvider(userId, provider);
        return ResponseEntity.ok("Successfully unlinked " + provider + " account.");
    }

    /**
     * 從 Authentication 中提取使用者 ID
     * 支援 JWT (AuthenticatedUser) 和 OAuth (AuthenticatedOAuthUser) 兩種類型
     */
    private Long extractUserId(Authentication authentication) {
        if (authentication == null) {
            log.warn("Authentication is null");
            return null;
        }

        Object principal = authentication.getPrincipal();

        // 情況 1: JWT 認證 (一般登入)
        if (principal instanceof AuthenticatedUser authenticatedUser) {
            log.debug("Extracted userId from JWT: {}", authenticatedUser.getId());
            return authenticatedUser.getId();
        }

        // 情況 2: OAuth 認證 (綁定流程完成後)
        if (principal instanceof AuthenticatedOAuthUser oauthUser) {
            Long userId = oauthUser.getUserId();
            log.debug("Extracted userId from OAuth: {}", userId);
            return userId;
        }

        log.warn("Unknown principal type: {}", principal.getClass().getName());
        return null;
    }
}