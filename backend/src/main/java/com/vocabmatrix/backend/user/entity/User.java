// src/main/java/com/vocabmatrix/backend/user/entity/User.java

package com.vocabmatrix.backend.user.entity;

import jakarta.persistence.*;
import java.net.InetAddress;
import java.time.OffsetDateTime;
import lombok.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 核心資訊
    @Column(nullable = false, unique = true, length = 30)
    private String username;

    @Column(unique = true, length = 320)
    private String email;

    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    // 個人檔案
    @Column(length = 100)
    private String nickname;

    @Column(name = "avatar_url", length = 2048)
    private String avatarUrl;

    @Column(name = "country_code", length = 2)
    private String countryCode;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "linkedin_url", length = 500)
    private String linkedinUrl;

    // 帳號狀態
    @Column(name = "is_admin", nullable = false)
    @Builder.Default
    private Boolean isAdmin = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private UserStatus status = UserStatus.INACTIVE;

    @Column(name = "email_verified")
    @Builder.Default
    private Boolean emailVerified = false;

    @Column(name = "email_verified_at")
    private OffsetDateTime emailVerifiedAt;

    // 安全審計
    @Column(name = "last_login_at")
    private OffsetDateTime lastLoginAt;

    @Column(name = "last_login_ip", columnDefinition = "INET")
    private InetAddress lastLoginIp;

    @Column(name = "registration_ip", columnDefinition = "INET")
    private InetAddress registrationIp;

    // 時間與刪除審計
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private OffsetDateTime updatedAt;

    @Column(name = "deleted_at")
    private OffsetDateTime deletedAt;

    // 狀態枚舉
    public enum UserStatus {
        ACTIVE,          // 正常使用中
        INACTIVE,        // 已停用/封鎖
        PENDING_DELETE   // 申請刪除中 (進入 30 天緩衝期)
    }

    /**
     * 輔助方法：檢查使用者目前是否處於「活躍」狀態，用來判斷帳號是否啟用
     * @return 如果狀態為 ACTIVE 則回傳 true，否則回傳 false
     */
    public boolean isActiveStatus() {
        return UserStatus.ACTIVE.equals(this.status);
    }

    /**
     * 輔助方法：檢查使用者是否設定了本地密碼。
     * 如果 passwordHash 為空，通常代表該使用者是純第三方登入 (OAuth) 帳號。
     * @return true 如果有密碼；false 如果沒有密碼
     */
    public boolean hasPassword() {
        return this.passwordHash != null && !this.passwordHash.trim().isEmpty();
    }

}