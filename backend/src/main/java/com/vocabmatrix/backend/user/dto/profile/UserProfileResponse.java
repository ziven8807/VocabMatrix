// src/main/java/com/vocabmatrix/backend/user/dto/profile/UserProfileResponse.java

package com.vocabmatrix.backend.user.dto.profile;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileResponse {
    private String username;
    private String email;
    private String nickname;
    private String avatarUrl;
    private String countryCode;
    private String bio;
    private String linkedinUrl;
    private boolean hasPassword; // 用來判斷是否為純 OAuth2 用戶
    private String status;
}