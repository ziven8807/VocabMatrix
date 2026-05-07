// src/main/java/com/vocabmatrix/backend/oauth/service/OAuth2LoginService.java

package com.vocabmatrix.backend.oauth.service;

import java.util.Map;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.vocabmatrix.backend.oauth.handler.OAuthUserHandler;
import com.vocabmatrix.backend.oauth.model.AuthenticatedOAuthUser;
import com.vocabmatrix.backend.user.entity.User;

/**
 * OAuth2 登入服務 (Facebook 專屬)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OAuth2LoginService extends DefaultOAuth2UserService {

    private final OAuthUserHandler userHandler;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        // 1. 取得 Facebook 原始資料
        OAuth2User oauth2User = super.loadUser(userRequest);

        // 2. 確定提供商名稱 (facebook)
        String provider = userRequest.getClientRegistration().getRegistrationId();

        // 3. 把Facebook的原始資料填進資料庫的對應變數
        String providerUserId = oauth2User.getAttribute("id"); // FB 的唯一使用者 ID
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String avatarUrl = extractFacebookAvatarUrl(oauth2User);

        log.info("Facebook OAuth2 登入: provider={}, providerUserId={}, email={}", provider, providerUserId, email);

        // 4. 把上面填完來的使用者資料給 OAuthUserHandler.java 查資料庫。
        User user = userHandler.handleOAuthLogin(email, name, avatarUrl, provider, providerUserId);

        // 4-1: 情況A：user是null，處理綁定流程時 user 為 null 的情況
        if (user == null) {
            log.info("綁定流程：user 為 null,創建臨時 AuthenticatedOAuthUser");
            return new AuthenticatedOAuthUser(oauth2User, null, email, provider);
        }

        // 4-2: 情況B：user不是null，所以正常登入
        return new AuthenticatedOAuthUser(oauth2User, user.getId(), user.getEmail(), provider);
    }

    /**
     * 額外步驟：解析 Facebook 特有的 picture -> data -> url 結構
     */
    private String extractFacebookAvatarUrl(OAuth2User oauth2User) {
        Object picture = oauth2User.getAttribute("picture");
        if (picture instanceof Map<?, ?> pictureMap) {
            Object data = pictureMap.get("data");
            if (data instanceof Map<?, ?> dataMap) {
                return (String) dataMap.get("url");
            }
        }
        return null;
    }
}