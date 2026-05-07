// src/main/java/com/vocabmatrix/backend/user/service/profile/ProfileService.java

package com.vocabmatrix.backend.user.service.profile;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;

import com.vocabmatrix.backend.user.dto.profile.ProfileUpdateDTO;
import com.vocabmatrix.backend.user.dto.profile.UserProfileResponse;
import com.vocabmatrix.backend.user.entity.User;
import com.vocabmatrix.backend.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final ProfileFileUploadService fileUploadService;

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用戶不存在"));

        return UserProfileResponse.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .avatarUrl(user.getAvatarUrl())
                .countryCode(user.getCountryCode())
                .bio(user.getBio())
                .linkedinUrl(user.getLinkedinUrl())
                .hasPassword(user.getPasswordHash() != null)
                .status(user.getStatus().name()) // 加上 .name() 將 Enum 轉為 String "ACTIVE"
                .build();
    }

    @Transactional
    public UserProfileResponse updateProfile(Long userId, ProfileUpdateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用戶不存在"));

        // 頭像異動處理：若 URL 改變且是本系統上傳的檔案，刪除舊檔
        if (dto.getAvatarUrl() != null && !dto.getAvatarUrl().equals(user.getAvatarUrl())) {
            fileUploadService.deleteAvatarByUrl(user.getAvatarUrl(), userId);
            user.setAvatarUrl(dto.getAvatarUrl());
        }

        // 局部更新欄位 (根據你提供的 SQL 欄位)
        if (dto.getNickname() != null) user.setNickname(dto.getNickname());
        if (dto.getBio() != null) user.setBio(dto.getBio());
        if (dto.getCountryCode() != null) user.setCountryCode(dto.getCountryCode());
        if (dto.getLinkedinUrl() != null) user.setLinkedinUrl(dto.getLinkedinUrl());

        user.setUpdatedAt(OffsetDateTime.now());
        User savedUser = userRepository.save(user);

        return getProfile(savedUser.getId());
    }
}