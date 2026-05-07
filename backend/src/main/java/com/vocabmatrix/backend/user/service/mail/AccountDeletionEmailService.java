// src/main/java/com/vocabmatrix/backend/user/service/mail/AccountDeletionEmailService.java

package com.vocabmatrix.backend.user.service.mail;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.vocabmatrix.backend.common.mail.MailService;
import com.vocabmatrix.backend.user.entity.User;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountDeletionEmailService {

    private final MailService mailService;

    /**
     * 寄送帳號刪除確認郵件
     */
    public void sendDeletionConfirmationEmail(User user) {
        String subject = "【VocabMatrix】Account Deletion Request Confirmation";
        String content = buildDeletionEmailContent(user);

        mailService.sendMail(user.getEmail(), subject, content);
    }

    private String buildDeletionEmailContent(User user) {
        return String.format(
                """
                Hello, %s:
                
                We have received your request to delete your VocabMatrix account.
                
                Your account has entered a 30-day cooling-off period and is scheduled to be permanently deleted.
                During this period, you can still log in and cancel this request at any time.
                
                If you did not initiate this request, please log in immediately and cancel the deletion to secure your account.
                
                Best regards,
                The VocabMatrix Team""",
                user.getUsername()
        );
    }
}