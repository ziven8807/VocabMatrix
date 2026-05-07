// src/main/java/com/vocabmatrix/backend/auth/dto/otp/OtpRequestDTO.java

package com.vocabmatrix.backend.auth.dto.otp;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Value;

/**
 * 請求發送 OTP 驗證碼的 DTO，包含目標 email
 */
@Value
public class OtpRequestDTO {
    @NotBlank(message = "電子郵件不能為空")
    @Email(message = "電子郵件格式不正確")
    String email;
}
