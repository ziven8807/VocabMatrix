// src/main/java/com/vocabmatrix/backend/user/dto/profile/ProfileUpdateDTO.java

package com.vocabmatrix.backend.user.dto.profile;

import lombok.Data;

@Data
public class ProfileUpdateDTO {
    private String nickname;
    private String bio;
    private String countryCode;
    private String linkedinUrl;
    private String avatarUrl;
}
