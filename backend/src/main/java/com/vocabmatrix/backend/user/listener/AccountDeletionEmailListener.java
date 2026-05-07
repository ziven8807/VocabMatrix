// src/main/java/com/vocabmatrix/backend/user/listener/AccountDeletionEmailListener.java

package com.vocabmatrix.backend.user.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.vocabmatrix.backend.user.event.AccountDeletionRequestedEvent;
import com.vocabmatrix.backend.user.service.mail.AccountDeletionEmailService;
import com.vocabmatrix.backend.user.entity.User;

@Slf4j
@Component
@RequiredArgsConstructor
public class AccountDeletionEmailListener {

    private final AccountDeletionEmailService deletionEmailService;

    /**
     * 使用 @Async 非同步處理，不阻塞帳號刪除的請求流程
     */
    @Async
    @EventListener
    public void handleAccountDeletionRequested(AccountDeletionRequestedEvent event) {
        User user = event.getUser();
        try {

            // 發送刪除帳號申請的提醒給使用者
            deletionEmailService.sendDeletionConfirmationEmail(user);

            log.info("Account deletion confirmation email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send account deletion email to {}: {}", user.getEmail(), e.getMessage());
        }
    }
}