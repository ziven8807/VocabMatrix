// src/main/java/com/vocabmatrix/backend/oauth/controller/OAuthController.java

package com.vocabmatrix.backend.oauth.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.vocabmatrix.backend.oauth.model.AuthenticatedOAuthUser;
import com.vocabmatrix.backend.user.dto.UserResponseDTO;
import com.vocabmatrix.backend.user.entity.User;
import com.vocabmatrix.backend.user.repository.UserRepository;

@Slf4j
@RequiredArgsConstructor
public class OAuthController {

    private final UserRepository userRepository;

    /**
     * 獲取目前登入的使用者資料。
     * 支援一般的 JWT 登入使用者與 OAuth2 登入使用者。
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(@AuthenticationPrincipal Object principal) {
        log.info("Fetching current user info. Principal type: {}", principal.getClass().getName());

        User user;

        // 1. 如果是 OAuth2 登入 (你自定義的 AuthenticatedOAuthUser)
        if (principal instanceof AuthenticatedOAuthUser oauthUser) {
            // 用 userId 從資料庫查詢
            user = userRepository.findById(oauthUser.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        // 2. 如果是一般 JWT 登入 (假設你在 JwtAuthenticationFilter 存入的是 User 實體)
        // 註：這取決於你的 JwtAuthenticationFilter 裡面 SecurityContextHolder 存的是什麼
        else if (principal instanceof User localUser) {
            user = localUser;
        }
        else {
            log.error("Unknown principal type: {}", principal.getClass().getName());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 回傳前端需要的欄位
        return ResponseEntity.ok(UserResponseDTO.builder()
                .username(user.getUsername())
                .nickname(user.getNickname())
                .avatarUrl(user.getAvatarUrl())
                .email(user.getEmail())
                .build());
    }
}