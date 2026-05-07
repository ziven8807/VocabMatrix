// src/main/java/com/vocabmatrix/backend/auth/listener/PasswordResetEmailListener.java

package com.vocabmatrix.backend.auth.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

import com.vocabmatrix.backend.auth.entity.mail.PasswordResetToken;
import com.vocabmatrix.backend.auth.event.PasswordResetRequestedEvent;
import com.vocabmatrix.backend.auth.service.mail.PasswordResetEmailService;
import com.vocabmatrix.backend.user.entity.User;

/**
 * 密碼重置郵件監聽器
 * 監聽密碼重置請求事件,並自動發送重置郵件
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PasswordResetEmailListener {

    private final PasswordResetEmailService passwordResetEmailService;

    /**
     * 當使用者請求密碼重置時,自動發送重置郵件
     * 使用 @Async 非同步處理,不阻塞請求流程
     */
    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePasswordResetRequested(PasswordResetRequestedEvent event) {
        User user = event.getUser();

        try {
            // 1. 生成 Token
            PasswordResetToken token = passwordResetEmailService.generateResetToken(user);

            // 2. 發送郵件
            passwordResetEmailService.sendResetPasswordEmail(user, token);

            log.info("Password reset email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", user.getEmail(), e.getMessage());
        }
    }
}