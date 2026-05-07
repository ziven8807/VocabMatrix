// src/main/java/com/vocabmatrix/backend/config/JwtConfig.java

package com.vocabmatrix.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@ConfigurationProperties(prefix = "security.jwt") // YAML的前綴security.jwt
@Data
public class JwtConfig {

    // --- Token Secrets ---
    private String accessSecret;
    private String refreshSecret;

    // --- Token 有效時間 (Duration 類型) ---
    // 映射 YAML 中的 access-token-expiration: 30m
    private Duration accessTokenExpiration;
    // 映射 YAML 中的 refresh-token-expiration: 30d
    private Duration refreshTokenExpiration;

    // --- JWT 標準 Claims ---
    // 映射 YAML 中的 security.jwt.issuer
    private String issuer;
    // 映射 YAML 中的 security.jwt.access-audience（audience）
    private String accessAudience;
    // 映射 YAML 中的 security.jwt.refresh-audience（audience）
    private String refreshAudience;

    // --- Cookie 設置 ---
    // 映射 YAML 中的 refresh-token-cookie-name: "refresh_token"
    private String refreshTokenCookieName;
    // 映射 YAML 中的 refresh-token-cookie-path: "/api/auth/refresh"
    private String refreshTokenCookiePath;
    // 映射 YAML 中的 cookie-secure: false
    private boolean cookieSecure;
    // 映射 YAML 中的 cookie-same-site: "Lax"
    private String cookieSameSite;

}