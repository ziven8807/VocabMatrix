// src/main/java/com/vocabmatrix/backend/common/mail/MailService.java

package com.vocabmatrix.backend.common.mail;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * 通用郵件服務
 * 負責處理所有的郵件發送操作
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

    private final JavaMailSender mailSender;

    /**
     * 異步發送簡單郵件。
     * 這是底層的通用發送方法，所有需要發送郵件的業務邏輯都應呼叫此方法。
     *
     * @param to 收件人 email
     * @param subject 郵件主旨
     * @param content 郵件內容
     */
    @Async
    public void sendMail(String to, String subject, String content) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content);

            mailSender.send(message);
            log.info("Async email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            // 異步執行緒中的例外不應中斷主交易，僅記錄錯誤
        }
    }
}
