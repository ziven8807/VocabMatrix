// src/main/java/com/vocabmatrix/backend/auth/entity/otp/OtpCode.java

package com.vocabmatrix.backend.auth.entity.otp;

import java.time.OffsetDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.vocabmatrix.backend.user.entity.User;

/**
 * 用於無密碼登入或密碼重設的 OTP (One-Time Password) 實體。
 * 存儲的是雜湊過的驗證碼 (Code Hash)。
 */
@Entity
@Table(name = "otp_codes")
@Getter
@Setter
@NoArgsConstructor
public class OtpCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 儲存 OTP 的雜湊值，而不是原始的 6 碼，確保資料庫安全。
    @Column(name = "code_hash", nullable = false, unique = true, length = 64)
    private String codeHash;

    // 關聯到哪個使用者
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "expiry_date", nullable = false)
    private OffsetDateTime expiryDate;

    @Column(name = "is_used", nullable = false)
    private Boolean isUsed = false;

    // 郵件發送時間 (可選，用於追蹤和發送速率限制)
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public OtpCode(String codeHash, User user, OffsetDateTime expiryDate) {
        this.codeHash = codeHash;
        this.user = user;
        this.expiryDate = expiryDate;
    }

    /**
     * 檢查 OTP 是否已過期
     * @return true 如果已過期
     */
    public boolean isExpired() {
        return this.expiryDate.isBefore(OffsetDateTime.now());
    }
}