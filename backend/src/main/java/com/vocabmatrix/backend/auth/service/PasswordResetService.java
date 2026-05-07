// src/main/java/com/vocabmatrix/backend/auth/service/PasswordResetService.java

package com.vocabmatrix.backend.auth.service;

import java.util.Optional;

import com.vocabmatrix.backend.auth.service.mail.PasswordResetEmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vocabmatrix.backend.auth.dto.passwordreset.PasswordForgotRequestDTO;
import com.vocabmatrix.backend.auth.dto.passwordreset.PasswordResetRequestDTO;
import com.vocabmatrix.backend.auth.event.PasswordResetRequestedEvent;
import com.vocabmatrix.backend.user.entity.User;
import com.vocabmatrix.backend.user.repository.UserRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetService {

    // 依賴注入：使用UserRepository的Jpa提供的findByEmail()查找使用者email判斷使用者是否存在（未登入操作要查email而不是用id找）
    private final UserRepository userRepository;

    // 依賴注入：使用PasswordResetEmailService來進行重置密碼的完整操作
    private final PasswordResetEmailService passwordResetEmailService;

    // 依賴注入：使用ApplicationEventPublisher來進行事件驅動來派發重置密碼的工作任務
    private final ApplicationEventPublisher eventPublisher;

    /**
     * 處理「忘記密碼」請求流程
     *
     * 為了防止 Email 枚舉攻擊,無論 Email 是否存在都返回相同訊息
     *
     * 1. 查找使用者 (Optional)
     * 2. 如果使用者存在,發布 PasswordResetRequestedEvent (觸發重置郵件發送)
     * 3. 統一返回成功訊息
     *
     * @param dto 包含 email 的請求 DTO
     * @return 成功訊息
     */
    @Transactional
    public String requestPasswordReset(PasswordForgotRequestDTO dto) {

        log.info("Processing password reset request for email: {}", dto.getEmail());

        // 1. 查找使用者 (Optional)
        Optional<User> userOptional = userRepository.findByEmail(dto.getEmail());

        // 2. 只有當使用者存在時才發送郵件
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // 發布事件 (PasswordResetEmailListener 會監聽並發送郵件)
            eventPublisher.publishEvent(new PasswordResetRequestedEvent(this, user));

            log.info("Password reset email will be sent to: {}", user.getEmail());
        } else {
            // 使用者不存在,但不透露這個訊息
            log.info("Password reset requested for non-existent email: {}", dto.getEmail());
        }

        // 3. 統一返回相同訊息 (防止 Email 枚舉攻擊)
        return "You will receive a password reset email.";
    }

    /**
     * 處理「重置密碼」流程
     *
     * 1. 委派給 PasswordResetEmailService 驗證 token 並重置密碼
     *
     * @param dto 包含 token、新密碼和確認密碼的請求 DTO
     * @return 重置結果訊息
     * @throws IllegalArgumentException Token 無效、已過期或密碼不匹配
     */
    @Transactional
    public String resetPassword(PasswordResetRequestDTO dto) {
        log.info("Processing password reset with token");

        // 委派給 PasswordResetEmailService 處理核心邏輯
        String result = passwordResetEmailService.resetPassword(dto);

        log.info("Password reset completed successfully");

        return result;
    }
}