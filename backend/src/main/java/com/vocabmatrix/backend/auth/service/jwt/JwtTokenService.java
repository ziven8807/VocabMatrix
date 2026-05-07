// src/main/java/com/vocabmatrix/backend/auth/service/jwt/JwtTokenService.java

package com.vocabmatrix.backend.auth.service.jwt;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.vocabmatrix.backend.config.JwtConfig;
import com.vocabmatrix.backend.user.entity.User;

@Service
@Slf4j
public class JwtTokenService {

    private final JwtConfig jwtConfig;

    // 將 JwtParser 定義為 final，並在建構子中初始化
    private final JwtParser accessJwtParser;
    private final JwtParser refreshJwtParser;

    // --- 密鑰獲取 ---

    private SecretKey getAccessSecretKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtConfig.getAccessSecret()));
    }

    private SecretKey getRefreshSecretKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtConfig.getRefreshSecret()));
    }

    // --- 服務初始化 (建構子) ---

    // 將 JwtConfig 注入並初始化 final 的 JwtParser
    public JwtTokenService(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;

        // 專門初始化驗證器，在 Bean 實例化時執行
        this.accessJwtParser = Jwts.parser()
                .verifyWith(getAccessSecretKey())
                .build();

        this.refreshJwtParser = Jwts.parser()
                .verifyWith(getRefreshSecretKey())
                .build();
    }


    // =========================================================
    // 1. Token 生成
    // =========================================================

    /**
     * 生成 Access Token (短效)。
     * * @param userId 用戶 ID
     * @param email 用戶 Email
     * @param roles 用戶角色列表
     * @return Access Token 字串
     */
    public String generateAccessToken(Long userId, String email, List<String> roles) {
        long expirationMs = jwtConfig.getAccessTokenExpiration().toMillis();

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .issuer(jwtConfig.getIssuer())
                .audience().add(jwtConfig.getAccessAudience()).and()
                .claim("email", email)
                .claim("roles", roles)
                .claim("type", "access")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getAccessSecretKey())
                .compact();
    }

    /**
     * 生成 Refresh Token (長效)。
     * * @param userId 用戶 ID
     * @return Refresh Token 字串
     */
    public String generateRefreshToken(Long userId) {
        long expirationMs = jwtConfig.getRefreshTokenExpiration().toMillis();

        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(String.valueOf(userId))
                .issuer(jwtConfig.getIssuer())
                .audience().add(jwtConfig.getRefreshAudience()).and()
                .claim("type", "refresh")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getRefreshSecretKey())
                .compact();
    }

    /**
     * 重載方法：直接從 User 實體生成 Access Token (OAuth第三方登入要使用的)
     * 根據 User 的 isAdmin 狀態自動分配 ROLE_ADMIN 或 ROLE_USER
     */
    public String generateAccessToken(User user) {
        // 根據 isAdmin 判斷角色
        List<String> roles = user.getIsAdmin()
                ? List.of("ROLE_ADMIN", "ROLE_USER")
                : List.of("ROLE_USER");

        return generateAccessToken(user.getId(), user.getEmail(), roles);
    }

    /**
     * 重載方法：直接從 User 實體生成 Refresh Token (OAuth第三方登入要使用的)
     */
    public String generateRefreshToken(User user) {
        return generateRefreshToken(user.getId());
    }

    // =========================================================
    // 2. Token 驗證與解析
    // =========================================================

    /**
     * 驗證 Access Token 並返回 Claims。
     * @param token 待驗證的 Access Token
     * @return Claims 物件 (Token 內容)
     */
    public Claims validateAccessToken(String token) {
        return accessJwtParser
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * 驗證 Refresh Token 並返回 Claims。
     * @param token 待驗證的 Refresh Token
     * @return Claims 物件 (Token 內容)
     */
    public Claims validateRefreshToken(String token) {
        return refreshJwtParser
                .parseSignedClaims(token)
                .getPayload();
    }

}
