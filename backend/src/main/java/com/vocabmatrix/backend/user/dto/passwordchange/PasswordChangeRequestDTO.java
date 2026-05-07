// src/main/java/com/vocabmatrix/backend/user/dto/passwordchange/PasswordChangeRequestDTO.java

package com.vocabmatrix.backend.user.dto.passwordchange;

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
public class PasswordChangeRequestDTO {

    @NotBlank(message = "當前密碼不能為空")
    private String currentPassword;

    @NotBlank(message = "新密碼不能為空")
    @Size(min = 6, max = 50, message = "新密碼長度必須在6-50個字符之間")
    private String newPassword;

    @NotBlank(message = "確認密碼不能為空")
    private String confirmPassword;
}