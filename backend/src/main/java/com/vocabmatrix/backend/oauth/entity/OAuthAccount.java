// src/main/java/com/vocabmatrix/backend/oauth/entity/OAuthAccount.java

package com.vocabmatrix.backend.oauth.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

import com.vocabmatrix.backend.user.entity.User;

@Entity
@Table(
        name = "oauth_accounts",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"provider_id", "provider_user_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA 必需
@AllArgsConstructor
@Builder // 方便後續在 Service 中進行流暢的建立
public class OAuthAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 對應本地 User
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * 第三方 provider（google / facebook）
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "provider_id", nullable = false)
    private OAuthProvider provider;

    /**
     * 第三方平台的使用者 ID (Google: sub, Facebook: id)
     */
    @Column(name = "provider_user_id", nullable = false, length = 255)
    private String providerUserId;

    /**
     * 第三方回傳的 email
     */
    @Column(name = "provider_email", length = 255)
    private String providerEmail;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    // 在存入資料庫前自動填入時間
    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }

}