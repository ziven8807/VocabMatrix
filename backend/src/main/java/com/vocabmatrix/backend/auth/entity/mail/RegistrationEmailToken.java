// src/main/java/com/vocabmatrix/backend/auth/entity/mail/RegistrationEmailToken.java

package com.vocabmatrix.backend.auth.entity.mail;

import java.time.OffsetDateTime;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import com.vocabmatrix.backend.user.entity.User;

@Entity
@Table(name = "registration_email_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationEmailToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 非持久化欄位，用於暫存原始 Token，以便生成郵件連結 (安全考量：不存入 DB)
    @Transient
    private String token;

    // 令牌的哈希值，用於查找和驗證
    @Column(name = "token_hash", nullable = false, unique = true, length = 64)
    private String tokenHash;

    // 與 User 實體的關聯關係：多個 Token 對應一個 User
    // user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // User 實體名為 User

    // 令牌的過期時間
    @Column(name = "expiry_date", nullable = false)
    private OffsetDateTime expiryDate;

    // 創建時間
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private OffsetDateTime createdAt;

}