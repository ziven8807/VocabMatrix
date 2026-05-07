// src/main/java/com/vocabmatrix/backend/auth/listener/RegistrationEmailListener.java

package com.vocabmatrix.backend.auth.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

import com.vocabmatrix.backend.auth.entity.mail.RegistrationEmailToken;
import com.vocabmatrix.backend.auth.event.UserRegisteredEvent;
import com.vocabmatrix.backend.auth.service.mail.RegistrationEmailService;
import com.vocabmatrix.backend.user.entity.User;

/**
 * 註冊郵件監聽器
 * 監聽使用者註冊事件,並自動發送驗證郵件
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RegistrationEmailListener {

    private final RegistrationEmailService registrationEmailService;

    /**
     * 當使用者註冊完成時,自動發送驗證郵件
     * 使用 @Async 非同步處理,不阻塞註冊流程
     */
    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleUserRegistered(UserRegisteredEvent event) {
        User user = event.getUser();

        try {
            // 1. 生成 Token
            RegistrationEmailToken token = registrationEmailService.generateVerificationToken(user);

            // 2. 發送郵件
            registrationEmailService.sendRegistrationEmail(user, token);

            log.info("Verification email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send verification email to {}: {}", user.getEmail(), e.getMessage());
        }
    }
}