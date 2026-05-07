// src/main/java/com/vocabmatrix/backend/user/service/UserService.java

package com.vocabmatrix.backend.user.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vocabmatrix.backend.auth.dto.registration.RegistrationRequestDTO;
import com.vocabmatrix.backend.user.entity.User;
import com.vocabmatrix.backend.user.exception.UserAlreadyExistsException;
import com.vocabmatrix.backend.user.exception.UserNotFoundException;
import com.vocabmatrix.backend.user.repository.UserRepository;
import static com.vocabmatrix.backend.user.entity.User.UserStatus.INACTIVE;
import static com.vocabmatrix.backend.user.entity.User.UserStatus.ACTIVE;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 建立新使用者（供 AuthService 呼叫）
     *
     * @param dto 註冊資料 DTO
     * @return User 實體
     * @throws UserAlreadyExistsException 帳號或信箱已存在
     */
    @Transactional
    public User createUser(RegistrationRequestDTO dto) {

        // 1. 檢查使用者名稱和信箱是否已被使用
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new UserAlreadyExistsException("Username has been used: " + dto.getUsername());
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new UserAlreadyExistsException("Email has been registered: " + dto.getEmail());
        }

        // 2. 建立使用者 (User 實體)
        User user = User.builder()
                // 設定使用者名稱
                .username(dto.getUsername())
                // 設定電子郵件
                .email(dto.getEmail())
                // 密碼加密後存入資料庫
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                // 預設暱稱 = 使用者名稱
                .nickname(dto.getUsername())
                // 使用 UI Avatars 服務生成頭像 URL
                .avatarUrl("https://ui-avatars.com/api/?name=" +
                        URLEncoder.encode(dto.getUsername(), StandardCharsets.UTF_8) +
                        "&background=random")
                // 預設國家為null
                .countryCode(null)
                // 預設自我介紹為空字串
                .bio("")
                // 預設linkedinUrl網址為空字串
                .linkedinUrl("")
                // 正常註冊方式的帳號不會是管理員
                .isAdmin(false)
                // 新辦帳號狀態為未啟用（等待驗證）
                .status(INACTIVE)
                // 新辦帳號要通過信箱驗證（等待驗證）
                .emailVerified(false)
                .build();

        // 3. 儲存並回傳
        return userRepository.save(user);
    }

    /**
     * 輔助方法：用 ID 查找使用者。
     * 給輔助方法 activateUser()使用。
     * 封裝 Repository 的 findById，並將 Optional 失敗轉換為業務級的 UserNotFoundException。
     * * @param userId 欲查找的使用者 ID
     * @return 查找到的使用者 Entity
     * @throws UserNotFoundException 找不到用戶時拋出
     */
    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User ID not found: " + userId));
    }

    /**
     * 輔助方法：啟用使用者帳號。
     * 用途：當使用者點擊驗證信中的連結後，呼叫此方法來正式啟用帳號。
     *
     * @param userId 欲啟用的使用者 ID
     * @return 更新後的 User Entity
     */
    @Transactional
    public User activateUser(Long userId) {

        // 呼叫內部 findById() 處理查找和例外，確保用戶存在
        User user = this.findById(userId);

        // 1. 將 emailVerified 設為 true 並記錄驗證時間 (建議加上時間戳記)
        user.setEmailVerified(true);
        user.setEmailVerifiedAt(java.time.OffsetDateTime.now());

        // 2. 將帳號狀態從 INACTIVE 改為 ACTIVE
        user.setStatus(ACTIVE);

        // 儲存到資料庫並回傳更新後的使用者
        return userRepository.save(user);
    }

}