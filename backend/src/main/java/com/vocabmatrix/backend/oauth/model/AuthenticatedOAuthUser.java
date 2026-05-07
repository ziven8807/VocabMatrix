// src/main/java/com/vocabmatrix/backend/oauth/model/AuthenticatedOAuthUser.java

package com.vocabmatrix.backend.oauth.model;

import java.io.Serializable;
import java.util.Collection;
import java.util.Map;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;

/**
 * 同時實作 OidcUser 和 OAuth2User,
 * 這樣它就能在 OidcLoginService (Google) 和 OAuth2LoginService (FB) 中通用。
 *
 * 實作 Serializable 以支援 Redis Session 序列化
 *
 * ⚠️ 重要: 只存 userId,不存整個 User 實體,避免序列化問題
 */
@Getter
public class AuthenticatedOAuthUser implements OidcUser, OAuth2User, Serializable {

    private static final long serialVersionUID = 1L;

    private final OAuth2User delegate;

    // 只存必要的資訊,不存整個 JPA 實體
    private final Long userId;
    private final String email;
    private final String provider;

    public AuthenticatedOAuthUser(OAuth2User delegate, Long userId, String email, String provider) {
        this.delegate = delegate;
        this.userId = userId;
        this.email = email;
        this.provider = provider;
    }

    // --- OAuth2User 基礎方法 (FB/Google 通用) ---
    @Override
    public Map<String, Object> getAttributes() {
        return delegate.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return delegate.getAuthorities();
    }

    @Override
    public String getName() {
        return delegate.getName();
    }

    // --- OIDC 專用方法 (當 delegate 是 OidcUser 時才有值,否則回傳 null) ---
    @Override
    public Map<String, Object> getClaims() {
        return (delegate instanceof OidcUser oidc) ? oidc.getClaims() : null;
    }

    @Override
    public OidcUserInfo getUserInfo() {
        return (delegate instanceof OidcUser oidc) ? oidc.getUserInfo() : null;
    }

    @Override
    public OidcIdToken getIdToken() {
        return (delegate instanceof OidcUser oidc) ? oidc.getIdToken() : null;
    }
}