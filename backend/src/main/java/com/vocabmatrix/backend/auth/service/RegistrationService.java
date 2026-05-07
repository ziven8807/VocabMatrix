// src/main/java/com/vocabmatrix/backend/auth/service/RegistrationService.java

package com.vocabmatrix.backend.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vocabmatrix.backend.auth.dto.registration.RegistrationRequestDTO;
import com.vocabmatrix.backend.user.dto.UserResponseDTO;
import com.vocabmatrix.backend.user.entity.User;
import com.vocabmatrix.backend.user.service.UserService;
import com.vocabmatrix.backend.auth.event.UserRegisteredEvent;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegistrationService {

    // 依賴注入：使用UserService的createUser()方法建立註冊的使用者到資料庫裡（還沒註冊完）
    private final UserService userService;

    // 依賴注入：使用ApplicationEventPublisher提供的publishEvent()派發寄送註冊信的任務
    private final ApplicationEventPublisher eventPublisher;

    /**
     * 處理使用者註冊流程
     *
     * 1. 呼叫 UserService 建立使用者
     * 2. 發布 UserRegisteredEvent (觸發驗證郵件發送)
     * 3. 轉換為 DTO 回傳
     *
     * @param dto 註冊資料 DTO
     * @return UserResponseDTO
     */
    @Transactional
    public UserResponseDTO registerUser(RegistrationRequestDTO dto) {
        log.info("Processing registration for user: {}", dto.getUsername());

        // 1. 建立使用者
        User user = userService.createUser(dto);

        // 2. 發布事件 (RegistrationEmailListener 會監聽並發送郵件)
        eventPublisher.publishEvent(new UserRegisteredEvent(this, user));

        log.info("User registered successfully: {}", user.getUsername());

        // 3. 轉換為安全的 DTO 回傳
        return UserResponseDTO.fromEntity(user);
    }

}