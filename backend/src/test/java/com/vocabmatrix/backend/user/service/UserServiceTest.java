// src/test/java/com/vocabmatrix/backend/user/service/UserServiceTest.java

package com.vocabmatrix.backend.user.service;

import com.vocabmatrix.backend.auth.dto.registration.RegistrationRequestDTO;
import com.vocabmatrix.backend.user.entity.User;
import com.vocabmatrix.backend.user.exception.UserAlreadyExistsException;
import com.vocabmatrix.backend.user.exception.UserNotFoundException;
import com.vocabmatrix.backend.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static com.vocabmatrix.backend.user.entity.User.UserStatus.ACTIVE;
import static com.vocabmatrix.backend.user.entity.User.UserStatus.INACTIVE;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

// 使用 Mockito 擴展，讓 @Mock 和 @InjectMocks 自動生效
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    // 模擬資料庫，不會真的連線
    @Mock
    private UserRepository userRepository;

    // 模擬密碼加密器
    @Mock
    private PasswordEncoder passwordEncoder;

    // 注入上面兩個 Mock，建立真正的 UserService 實例
    @InjectMocks
    private UserService userService;

    // 每個測試共用的假資料
    private RegistrationRequestDTO dto;

    // 每個測試執行前都會先跑這裡，準備假的 DTO 資料
    @BeforeEach
    void setUp() {
        dto = new RegistrationRequestDTO();
        dto.setUsername("testuser");
        dto.setEmail("test@example.com");
        dto.setPassword("password123");
    }

    // 測試情境 1：正常註冊流程
    @Test
    void createUser_success() {
        // 假設 username 和 email 都沒有重複
        when(userRepository.existsByUsername(dto.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(dto.getEmail())).thenReturn(false);
        // 假設密碼加密後回傳固定字串
        when(passwordEncoder.encode(dto.getPassword())).thenReturn("encodedPassword");
        // 假設 save 直接回傳傳入的 User 物件
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        User result = userService.createUser(dto);

        // 驗證回傳的 User 資料正確
        assertThat(result.getUsername()).isEqualTo("testuser");
        assertThat(result.getPasswordHash()).isEqualTo("encodedPassword");
        assertThat(result.getStatus()).isEqualTo(INACTIVE);
        assertThat(result.getEmailVerified()).isFalse();
    }

    // 測試情境 2：username 已被使用，應拋出例外
    @Test
    void createUser_duplicateUsername_throwsException() {
        // 假設 username 已存在
        when(userRepository.existsByUsername(dto.getUsername())).thenReturn(true);

        // 驗證呼叫 createUser 時會拋出 UserAlreadyExistsException
        assertThatThrownBy(() -> userService.createUser(dto))
                .isInstanceOf(UserAlreadyExistsException.class);
    }

    // 測試情境 3：email 已被使用，應拋出例外
    @Test
    void createUser_duplicateEmail_throwsException() {
        // username 沒重複，但 email 已存在
        when(userRepository.existsByUsername(dto.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(dto.getEmail())).thenReturn(true);

        // 驗證呼叫 createUser 時會拋出 UserAlreadyExistsException
        assertThatThrownBy(() -> userService.createUser(dto))
                .isInstanceOf(UserAlreadyExistsException.class);
    }

    // 測試情境 4：findById 正常找到使用者
    @Test
    void findById_success() {
        // 準備一個假的 User
        User mockUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .build();

        // 假設 repository 找得到這個 ID
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        User result = userService.findById(1L);

        // 驗證回傳的是正確的 User
        assertThat(result.getUsername()).isEqualTo("testuser");
    }

    // 測試情境 5：findById 找不到使用者，應拋出例外
    @Test
    void findById_notFound_throwsException() {
        // 假設 repository 找不到這個 ID
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // 驗證會拋出 UserNotFoundException
        assertThatThrownBy(() -> userService.findById(1L))
                .isInstanceOf(UserNotFoundException.class);
    }

    // 測試情境 6：activateUser 正常啟用帳號
    @Test
    void activateUser_success() {
        // 準備一個 INACTIVE 的假 User
        User mockUser = User.builder()
                .username("testuser")
                .status(INACTIVE)
                .emailVerified(false)
                .build();

        // 假設找得到這個 ID，save 直接回傳傳入的物件
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        User result = userService.activateUser(1L);

        // 驗證帳號已被啟用
        assertThat(result.getStatus()).isEqualTo(ACTIVE);
        assertThat(result.getEmailVerified()).isTrue();
        assertThat(result.getEmailVerifiedAt()).isNotNull();
    }

    // 測試情境 7：activateUser 使用者不存在，應拋出例外
    @Test
    void activateUser_userNotFound_throwsException() {
        // 假設找不到這個 ID
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // 驗證會拋出 UserNotFoundException
        assertThatThrownBy(() -> userService.activateUser(1L))
                .isInstanceOf(UserNotFoundException.class);
    }
}