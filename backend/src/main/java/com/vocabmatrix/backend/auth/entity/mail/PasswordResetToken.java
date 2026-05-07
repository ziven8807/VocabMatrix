// src/main/java/com/vocabmatrix/backend/auth/entity/mail/PasswordResetToken.java

package com.vocabmatrix.backend.auth.entity.mail;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

import com.vocabmatrix.backend.user.entity.User;

@Entity
@Table(name = "password_reset_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 非持久化欄位，用於暫存原始 Token，以便生成郵件連結 (安全考量：不存入 DB)
    @Transient
    private String token;

    // 令牌的哈希值，用於查找和驗證
    @Column(name = "token_hash", nullable = false, unique = true, length = 64)
    private String tokenHash;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "expiry_date", nullable = false)
    private OffsetDateTime expiryDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    /**
     * 判斷 token 是否過期
     */
    public boolean isExpired() {
        return OffsetDateTime.now().isAfter(expiryDate);
    }

    /**
     * 設定 token 過期時間（例如 1 小時內有效）
     */
    public void setExpiryFromNowHours(int hours) {
        this.expiryDate = OffsetDateTime.now().plusHours(hours);
    }
}
