// src/main/java/com/vocabmatrix/backend/auth/dto/login/LoginResponseDTO.java

package com.vocabmatrix.backend.auth.dto.login;

import com.vocabmatrix.backend.user.dto.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 登入響應 DTO (Login Response Data Transfer Object)
 * 登入成功後返回給客戶端的資料，包含 Access Token 、 Refresh Token和沒有敏感資訊的使用者基本資料。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {

    /**
     * JWT Access Token (用於之後的請求授權，具有較短的生命週期)
     * 客戶端需要在所有受保護的 API 請求中攜帶此 Token。
     */
    private String accessToken;

    /**
     * JWT Refresh Token (用於續期 Access Token，具有較長的生命週期)
     * 當 Access Token 過期時，客戶端使用此 Token 換取新的 Access Token，避免重新輸入帳號密碼。
     */
    private String refreshToken;

    /**
     * 登入後的使用者基本資訊
     * 這裡包含了我們定義的 UserResponseDTO，只暴露非敏感的公開用戶資料。
     */
    private UserResponseDTO user;
}