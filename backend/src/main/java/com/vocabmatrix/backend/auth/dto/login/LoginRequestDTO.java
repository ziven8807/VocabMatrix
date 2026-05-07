// src/main/java/com/vocabmatrix/backend/auth/dto/login/LoginRequestDTO.java

package com.vocabmatrix.backend.auth.dto.login;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDTO {

    /**
     * identifier登入識別符：可以是 username 或 email
     */
    @NotBlank(message = "帳號或信箱不能為空")
    private String identifier;

    @NotBlank(message = "密碼不能為空")
    private String password;
}