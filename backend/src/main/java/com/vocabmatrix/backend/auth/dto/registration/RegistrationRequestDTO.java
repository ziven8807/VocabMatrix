// src/main/java/com/vocabmatrix/backend/auth/dto/registration/RegistrationRequestDTO.java

package com.vocabmatrix.backend.auth.dto.registration;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegistrationRequestDTO {

    @NotBlank(message = "用戶名不能為空")
    @Size(min = 3, max = 20, message = "用戶名長度必須在3-20個字符之間")
    private String username;

    @NotBlank(message = "郵箱不能為空")
    @Email(message = "郵箱格式不正確")
    private String email;

    @NotBlank(message = "密碼不能為空")
    @Size(min = 6, max = 50, message = "密碼長度必須在6-50個字符之間")
    private String password;

    @NotBlank(message = "請確認密碼")
    @Size(min = 6, max = 50, message = "密碼長度必須在6-50個字符之間")
    private String confirmPassword;

}