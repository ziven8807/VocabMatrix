// src/main/java/com/vocabmatrix/backend/config/OtpConfig.java

package com.vocabmatrix.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import java.time.Duration;

/**
 * OTP (One-Time Password) 服務的組態屬性。
 * 使用 'app.otp' 前綴來讀取設定。
 */
@Configuration
@ConfigurationProperties(prefix = "app.otp")
public class OtpConfig {

    /**
     * OTP 驗證碼的位數長度 (例如: 6 碼)。
     */
    private int codeLength = 6;

    /**
     * OTP 驗證碼的有效期限。
     * 建議使用 ISO-8601 格式，例如: P15M (15 分鐘) 或 PT1H (1 小時)。
     */
    private Duration expirationDuration = Duration.ofMinutes(15);

    // Getters and Setters (Lombok 通常會自動產生，這裡手動列出以示完整性)

    public int getCodeLength() {
        return codeLength;
    }

    public void setCodeLength(int codeLength) {
        this.codeLength = codeLength;
    }

    public Duration getExpirationDuration() {
        return expirationDuration;
    }

    public void setExpirationDuration(Duration expirationDuration) {
        this.expirationDuration = expirationDuration;
    }
}