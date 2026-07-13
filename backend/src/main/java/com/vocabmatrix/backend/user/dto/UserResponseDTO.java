// src/main/java/com/vocabmatrix/backend/user/dto/UserResponseDTO.java

package com.vocabmatrix.backend.user.dto;

import java.time.OffsetDateTime;
import com.vocabmatrix.backend.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {

    private Long id;
    private String username;
    private String email;
    private String nickname;
    private String avatarUrl;
    private String countryCode;
    private String bio;
    private String linkedinUrl;

    // 帳號狀態：直接反映實體狀態
    private Boolean isAdmin;
    private String status;         // 回傳 "ACTIVE", "INACTIVE", "PENDING_DELETE"
    private Boolean emailVerified;

    // ★ 是否設有密碼（本地帳號 or 已設定密碼的第三方帳號為 true，純 OAuth2 帳號為 false）
    private Boolean hasPassword;

    // 時間審計
    private OffsetDateTime lastLoginAt;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private OffsetDateTime deletedAt;

    public static UserResponseDTO fromEntity(User user) {
        if (user == null) {
            return null;
        }

        return UserResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .avatarUrl(user.getAvatarUrl())
                .countryCode(user.getCountryCode())
                .bio(user.getBio())
                .linkedinUrl(user.getLinkedinUrl())
                .isAdmin(user.getIsAdmin())
                .status(user.getStatus().name())
                .emailVerified(user.getEmailVerified())
                .hasPassword(user.getPasswordHash() != null)
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .deletedAt(user.getDeletedAt())
                .build();
    }
}