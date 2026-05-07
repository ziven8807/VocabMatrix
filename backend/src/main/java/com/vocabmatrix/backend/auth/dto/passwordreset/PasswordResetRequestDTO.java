// src/main/java/com/vocabmatrix/backend/auth/dto/passwordreset/PasswordResetRequestDTO.java

package com.vocabmatrix.backend.auth.dto.passwordreset;

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
public class PasswordResetRequestDTO {

    @NotBlank(message = "Token 不能為空")
    private String token;

    @NotBlank(message = "新密碼不能為空")
    @Size(min = 6, max = 50, message = "新密碼長度必須在6-50個字符之間")
    private String newPassword;

    @NotBlank(message = "確認密碼不能為空")
    private String confirmPassword;
}
