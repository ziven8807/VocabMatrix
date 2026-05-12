// src/main/java/com/vocabmatrix/backend/common/mail/MailService.java

package com.vocabmatrix.backend.common.mail;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

/**
 * 通用郵件服務
 * 原本使用 Spring Mail + SMTP，但 Railway 封鎖所有對外 SMTP port（465、587）
 * 改用 Resend HTTP API 發信，走 HTTPS，Railway 不會封鎖
 */
@Service
@Slf4j
public class MailService {

    // 從環境變數讀取 Resend API Key（格式：re_xxxxxxxx）
    @Value("${spring.mail.password}")
    private String resendApiKey;

    // Resend HTTP API 端點，固定不變
    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    // 使用 Spring 6 內建的 RestClient 打 HTTP 請求，不需要額外依賴
    private final RestClient restClient = RestClient.create();

    /**
     * 異步發送郵件，透過 Resend HTTP API。
     *
     * @param to      收件人 email
     * @param subject 郵件主旨
     * @param content 郵件內容
     */
    @Async
    public void sendMail(String to, String subject, String content) {
        try {
            // 組裝 Resend API 需要的請求體
            ResendEmailRequest requestBody = new ResendEmailRequest(
                    "onboarding@resend.dev", // 寄件人：Resend 提供的預設 domain，不需要驗證
                    List.of(to),             // 收件人：包成 List，Resend API 格式要求
                    subject,
                    content
            );

            // 打 Resend HTTP API
            restClient.post()
                    .uri(RESEND_API_URL)
                    .header("Authorization", "Bearer " + resendApiKey) // API Key 認證
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .toBodilessEntity(); // 不需要解析 response body，只要確認成功就好

            log.info("Async email sent successfully to: {}", to);

        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            // 異步執行緒中的例外不應中斷主交易，僅記錄錯誤
        }
    }

    /**
     * Resend API 請求體格式
     * 對應 Resend 文件：https://resend.com/docs/api-reference/emails/send-email
     */
    private record ResendEmailRequest(
            String from,
            List<String> to,
            String subject,
            String text  // 純文字內容，如需 HTML 改用 html 欄位
    ) {}
}