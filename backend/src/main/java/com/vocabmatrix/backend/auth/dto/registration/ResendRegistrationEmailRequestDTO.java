// src/main/java/com/vocabmatrix/backend/auth/dto/registration/ResendRegistrationEmailRequestDTO.java

package com.vocabmatrix.backend.auth.dto.registration;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Value;

/**
 * 重新發送 Email 驗證連結的請求 DTO
 */
@Value
public class ResendRegistrationEmailRequestDTO {
    @NotBlank(message = "電子郵件不能為空")
    @Email(message = "電子郵件格式不正確")
    String email;
}