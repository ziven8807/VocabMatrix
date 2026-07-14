// src/main/java/com/vocabmatrix/backend/user/controller/PasswordController.java

package com.vocabmatrix.backend.user.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vocabmatrix.backend.user.dto.passwordchange.PasswordChangeRequestDTO;
import com.vocabmatrix.backend.user.service.PasswordChangeService;

/**
 * 處理與密碼管理相關的流程。
 * 註：這個 Controller 中的所有方法都應該受到 Spring Security 的保護，
 * 確保只有持有有效 Access Token 的用戶才能訪問。
 */
@RestController
@RequestMapping("/api/user") // 放在 /api/user 下，區分於 /api/auth
@RequiredArgsConstructor
@Slf4j
public class PasswordController {

    private final PasswordChangeService passwordChangeService;

    // =========================================================================
    // I. 已登入用戶更改密碼
    // =========================================================================

    /**
     * 處理已登入使用者更改密碼請求。
     * POST /api/user/password/change
     *
     * @param dto 密碼更改 DTO (包含舊密碼、新密碼)
     * @return 204 No Content
     */
    @PostMapping("/password/change")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal(expression = "id") Long userId,
            @Valid @RequestBody PasswordChangeRequestDTO dto) {

        log.info("User ID {} is attempting to change password.", userId);

        passwordChangeService.changePassword(userId, dto);

        return ResponseEntity.noContent().build();
    }

}