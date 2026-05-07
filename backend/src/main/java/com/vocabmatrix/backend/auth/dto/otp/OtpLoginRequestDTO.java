// src/main/java/com/vocabmatrix/backend/auth/dto/otp/OtpLoginRequestDTO.java

package com.vocabmatrix.backend.auth.dto.otp;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Value;

/**
 * 使用 OTP 驗證碼登入的請求 DTO
 */
@Value
public class OtpLoginRequestDTO {
    @NotBlank(message = "電子郵件不能為空")
    @Email(message = "電子郵件格式不正確")
    String email;

    @NotBlank(message = "OTP 驗證碼不能為空")
    @Size(min = 6, max = 6, message = "OTP 驗證碼必須為 6 碼") // 假設 OTP 為 6 碼
    String code;
}