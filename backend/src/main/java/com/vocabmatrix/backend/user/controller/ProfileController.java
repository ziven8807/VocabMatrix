// src/main/java/com/vocabmatrix/backend/user/controller/ProfileController.java

package com.vocabmatrix.backend.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

import com.vocabmatrix.backend.user.dto.profile.ProfileUpdateDTO;
import com.vocabmatrix.backend.user.dto.profile.UserProfileResponse;
import com.vocabmatrix.backend.user.service.profile.ProfileService;
import com.vocabmatrix.backend.user.service.profile.ProfileFileUploadService;
import com.vocabmatrix.backend.security.AuthenticatedUser;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final ProfileFileUploadService fileUploadService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal AuthenticatedUser authUser) {
        return ResponseEntity.ok(profileService.getProfile(authUser.getId()));
    }

    @PatchMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal AuthenticatedUser authUser,
            @RequestBody ProfileUpdateDTO dto) {
        return ResponseEntity.ok(profileService.updateProfile(authUser.getId(), dto));
    }

    @PostMapping("/upload-avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal AuthenticatedUser authUser) throws IOException {

        String url = fileUploadService.uploadAvatar(file, authUser.getId());
        return ResponseEntity.ok(Map.of("url", url));
    }
}