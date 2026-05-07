// src/main/java/com/vocabmatrix/backend/auth/dto/passwordreset/PasswordForgotRequestDTO.java

package com.vocabmatrix.backend.auth.dto.passwordreset;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PasswordForgotRequestDTO {

    @NotBlank(message = "郵箱不能為空")
    @Email(message = "郵箱格式不正確")
    private String email;
}
