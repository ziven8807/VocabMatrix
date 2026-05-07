// src/main/java/com/vocabmatrix/backend/user/service/PasswordChangeService.java

package com.vocabmatrix.backend.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vocabmatrix.backend.auth.exception.BadCredentialsException;
import com.vocabmatrix.backend.auth.exception.PasswordMismatchException;
import com.vocabmatrix.backend.auth.exception.PasswordReuseException;
import com.vocabmatrix.backend.auth.service.LoginService;
import com.vocabmatrix.backend.user.dto.passwordchange.PasswordChangeRequestDTO;
import com.vocabmatrix.backend.user.entity.User;
import com.vocabmatrix.backend.user.exception.UserNotFoundException;
import com.vocabmatrix.backend.user.repository.UserRepository;

/**
 * 專門負責處理使用者密碼變更的服務。
 * 屬於認證 (Authentication) 範疇，遵循單一職責原則 (SRP)。
 */
@Service
@RequiredArgsConstructor
public class PasswordChangeService {

    // 依賴注入：使用UserRepository用Jap造的findById()判斷更改密碼的使用者是否存在
    private final UserRepository userRepository;

    // 依賴注入：處理密碼的雜湊與比對
    private final PasswordEncoder passwordEncoder;

    // 依賴注入：用於密碼變更後的安全性操作 (Token 失效)
    private final LoginService loginService;

    // =========================================================================
    // 密碼變更核心邏輯
    // =========================================================================

    /**
     * 變更使用者密碼 (需驗證舊密碼)。
     * * @param userId 欲變更密碼的使用者 ID (通常從 Token 中取得)
     * @param dto 包含當前密碼、新密碼和確認密碼的 DTO
     * @throws UserNotFoundException 找不到用戶
     * @throws BadCredentialsException 舊密碼不正確
     * @throws PasswordReuseException 新密碼與舊密碼相同
     * @throws PasswordMismatchException 新密碼與確認密碼不一致
     */
    @Transactional
    public void changePassword(Long userId, PasswordChangeRequestDTO dto) {

        // 1. 查找用戶 (直接使用 Repository 確保解耦)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User ID not found: " + userId));

        // 2. 驗證新密碼和確認密碼是否一致
        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new PasswordMismatchException("New password and confirmation password do not match.");
        }

        // 3. 驗證舊密碼是否正確
        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("The current password entered is incorrect.");
        }

        // 4. 驗證新密碼是否與舊密碼相同 (密碼重複使用檢查)
        if (passwordEncoder.matches(dto.getNewPassword(), user.getPasswordHash())) {
            throw new PasswordReuseException("The new password cannot be the same as the current password.");
        }

        // 5. 加密新密碼並儲存
        String newPasswordHash = passwordEncoder.encode(dto.getNewPassword());
        user.setPasswordHash(newPasswordHash);

        // 使用 userRepository的Jpa提供的save()方法儲存密碼變更的結果
        userRepository.save(user);

        // 6. [安全增強] 密碼變更成功後，讓所有現存的 Refresh Token 失效 (強迫重新登入)
        loginService.revokeAllTokensForUser(userId);
    }
}