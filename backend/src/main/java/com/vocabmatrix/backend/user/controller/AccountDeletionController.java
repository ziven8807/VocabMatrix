// src/main/java/com/vocabmatrix/backend/user/controller/AccountDeletionController.java

package com.vocabmatrix.backend.user.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.vocabmatrix.backend.user.dto.deleteaccount.DeleteAccountRequestDTO;
import com.vocabmatrix.backend.user.service.AccountDeletionService;

@Slf4j
@RestController
@RequestMapping("/api/user/account")
@RequiredArgsConstructor
public class AccountDeletionController {

    private final AccountDeletionService accountDeletionService;

    /**
     * 申請刪除帳號 (進入 30 天冷卻期)
     * POST /api/user/account/delete-request
     * * @param userId 從 SecurityContext 獲取的目前登入用戶 ID
     * @param dto 包含密碼與刪除原因
     * @param request 用於獲取 IP 地址
     * @return 204 No Content
     */
    @PostMapping("/delete-request")
    public ResponseEntity<Void> requestDeletion(
            @AuthenticationPrincipal Long userId,
            @Valid @RequestBody DeleteAccountRequestDTO dto,
            HttpServletRequest request) {

        String ipAddress = request.getRemoteAddr();
        log.info("Received account deletion request for User ID: {}, IP: {}", userId, ipAddress);

        accountDeletionService.requestDeletion(userId, dto, ipAddress);

        return ResponseEntity.noContent().build();
    }

    /**
     * 撤銷刪除申請 (恢復帳號為 ACTIVE)
     * POST /api/user/account/cancel-deletion
     * * @param userId 從 SecurityContext 獲取的目前登入用戶 ID
     * @param request 用於獲取 IP 地址
     * @return 204 No Content
     */
    @PostMapping("/cancel-deletion")
    public ResponseEntity<Void> cancelDeletion(
            @AuthenticationPrincipal Long userId,
            HttpServletRequest request) {

        String ipAddress = request.getRemoteAddr();
        log.info("Received cancel deletion request for User ID: {}, IP: {}", userId, ipAddress);

        accountDeletionService.cancelDeletion(userId, ipAddress);

        return ResponseEntity.noContent().build();
    }

}