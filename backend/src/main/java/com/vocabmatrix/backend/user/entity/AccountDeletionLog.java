// src/main/java/com/vocabmatrix/backend/user/entity/AccountDeletionLog.java

package com.vocabmatrix.backend.user.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "account_deletion_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountDeletionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 當 users 表記錄被刪除時，這裡會變為 NULL
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, length = 30)
    private String username;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(name = "reason_category", length = 50)
    private String reasonCategory;

    @Column(columnDefinition = "TEXT")
    private String detail;

    // PostgreSQL 的 INET 類型
    @Column(name = "ip_address", columnDefinition = "inet")
    private String ipAddress;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }
    }
}