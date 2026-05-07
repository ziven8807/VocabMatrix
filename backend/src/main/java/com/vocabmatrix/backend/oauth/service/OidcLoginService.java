// src/main/java/com/vocabmatrix/backend/oauth/service/OidcLoginService.java

package com.vocabmatrix.backend.oauth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import com.vocabmatrix.backend.oauth.handler.OAuthUserHandler;
import com.vocabmatrix.backend.oauth.model.AuthenticatedOAuthUser;
import com.vocabmatrix.backend.user.entity.User;

/**
 * OIDC 登入服務
 * 處理所有使用 OIDC 協定的提供商（Google, Apple, Microsoft 等）
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OidcLoginService extends OidcUserService {

    private final OAuthUserHandler userHandler;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {

        // 1. 取得 Google 原始資料
        OidcUser oidcUser = super.loadUser(userRequest);

        // 2. 確定提供商名稱 (google)
        String provider = userRequest.getClientRegistration().getRegistrationId();

        // 3. 把Google的原始資料填進資料庫的對應變數
        String providerId = oidcUser.getSubject(); // OIDC 標準的 "sub" 欄位
        String email = oidcUser.getEmail();
        String name = oidcUser.getFullName();
        String avatarUrl = oidcUser.getAttribute("picture");

        log.info("OIDC 登入: provider={}, providerId={}, email={}", provider, providerId, email);

        // 4. 把上面填完來的使用者資料給 OAuthUserHandler.java 查資料庫。
        User user = userHandler.handleOAuthLogin(email, name, avatarUrl, provider, providerId);

        // 4-1: 情況A：user是null，處理綁定流程時 user 為 null 的情況
        if (user == null) {
            log.info("綁定流程：user 為 null,創建臨時 AuthenticatedOAuthUser");
            return new AuthenticatedOAuthUser(oidcUser, null, email, provider);
        }

        // 4-2: 情況B：user不是null，所以正常登入
        return new AuthenticatedOAuthUser(oidcUser, user.getId(), user.getEmail(), provider);
    }
}