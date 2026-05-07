// src/main/java/com/vocabmatrix/backend/security/AuthenticatedUser.java

package com.vocabmatrix.backend.security;

import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@Getter
@Builder
public class AuthenticatedUser implements UserDetails {

    private final Long id;        // 資料庫的 User ID (這是最重要的，ProfileService 需要它)
    private final String username; // 使用者帳號
    private final String password; // 密碼 (通常 JWT 驗證後這裡會是 null)
    private final Collection<? extends GrantedAuthority> authorities; // 權限 (ROLE_USER, ROLE_ADMIN)

    // 實作 UserDetails 必備的方法
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}