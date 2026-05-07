// src/main/java/com/vocabmatrix/backend/oauth/handler/OAuthUserHandler.java

package com.vocabmatrix.backend.oauth.handler;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.Set;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.vocabmatrix.backend.oauth.entity.OAuthAccount;
import com.vocabmatrix.backend.oauth.entity.OAuthProvider;
import com.vocabmatrix.backend.oauth.exception.OAuthAuthenticationException;
import com.vocabmatrix.backend.oauth.exception.UnsupportedOAuthProviderException;
import com.vocabmatrix.backend.oauth.repository.OAuthAccountRepository;
import com.vocabmatrix.backend.oauth.repository.OAuthProviderRepository;
import com.vocabmatrix.backend.user.entity.User;
import com.vocabmatrix.backend.user.repository.UserRepository;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuthUserHandler {

    private final UserRepository userRepository;
    private final OAuthProviderRepository oauthProviderRepository;
    private final OAuthAccountRepository oauthAccountRepository;

    private static final Set<String> SUPPORTED_PROVIDERS = Set.of("google", "facebook");

    /**
     * 處理 OAuth 登入核心邏輯
     */
    @Transactional
    public User handleOAuthLogin(String email, String name, String avatarUrl, String provider, String providerId) {

        // 1. 校驗 Provider 是否支援
        String providerKey = provider.toLowerCase();
        if (!SUPPORTED_PROVIDERS.contains(providerKey)) {
            log.error("Intercepted unsupported OAuth provider request: {}", provider);
            throw new UnsupportedOAuthProviderException(
                    String.format("OAuth provider '%s' is not supported. Supported providers: %s",
                            provider, SUPPORTED_PROVIDERS));
        }

        // 2. 校驗 Email 必填項
        if (email == null || email.isBlank()) {
            log.warn("OAuth authorization successful but email is missing: provider={}, providerId={}",
                    provider, providerId);
            throw new OAuthAuthenticationException(
                    "Could not retrieve email from " + provider + ". Please check your third-party account settings.");
        }

        // 3. 查找是否已有 OAuth 綁定記錄
        Optional<OAuthAccount> existingAccount = oauthAccountRepository
                .findByProviderNameAndProviderUserId(providerKey, providerId);

        if (existingAccount.isPresent()) {
            // 情況 A:已有 OAuth 記錄 -> 直接登錄並更新資訊
            return updateExistingOAuthUser(existingAccount.get(), avatarUrl);
        } else {
            // 情況 B:全新的使用者 -> 直接建立帳號與連動 (不考慮 Email 衝突判斷)
            return createNewOAuthUser(email, name, avatarUrl, providerKey, providerId);
        }
    }

    /**
     * 更新現有使用者的登入資訊與頭像
     */
    private User updateExistingOAuthUser(OAuthAccount oauthAccount, String avatarUrl) {
        User user = oauthAccount.getUser();
        user.setLastLoginAt(OffsetDateTime.now());

        if (avatarUrl != null && !avatarUrl.isEmpty()) {
            if (user.getAvatarUrl() == null || user.getAvatarUrl().contains("ui-avatars.com")) {
                user.setAvatarUrl(avatarUrl);
            }
        }

        return userRepository.save(user);
    }

    /**
     * 建立全新的 OAuth 使用者 (自動註冊)
     */
    private User createNewOAuthUser(String email, String name, String avatarUrl,
                                    String provider, String providerId) {
        String username = generateUniqueUsername(email);
        String finalAvatarUrl = generateAvatarUrl(avatarUrl, name != null ? name : username);

        User newUser = User.builder()
                .email(email)
                .username(username)
                .nickname(name != null ? name : username)
                .avatarUrl(finalAvatarUrl)
                .passwordHash(null)
                .emailVerified(true)
                .isAdmin(false)
                .status(User.UserStatus.ACTIVE)
                .lastLoginAt(OffsetDateTime.now())
                .build();

        User savedUser = userRepository.save(newUser);
        log.info("Registered new OAuth user: userId={}, email={}, provider={}",
                savedUser.getId(), email, provider);

        createOAuthAccount(savedUser, provider, providerId, email);
        return savedUser;
    }

    /**
     * 輔助方法:儲存 OAuth 帳號關聯資訊
     */
    private void createOAuthAccount(User user, String providerName, String providerId, String email) {
        OAuthProvider provider = oauthProviderRepository.findByName(providerName)
                .orElseGet(() -> {
                    OAuthProvider newProvider = new OAuthProvider(providerName);
                    return oauthProviderRepository.save(newProvider);
                });

        OAuthAccount oauthAccount = OAuthAccount.builder()
                .user(user)
                .provider(provider)
                .providerUserId(providerId)
                .providerEmail(email)
                .build();

        oauthAccountRepository.save(oauthAccount);
    }

    /**
     * 生成唯一的使用者名稱
     */
    private String generateUniqueUsername(String email) {
        String baseUsername = email.split("@")[0];
        baseUsername = baseUsername.replaceAll("[^a-zA-Z0-9._]", "");

        String username = baseUsername;
        int attempt = 1;

        while (userRepository.existsByUsername(username)) {
            username = baseUsername + attempt++;
        }

        return username;
    }

    /**
     * 處理頭像 URL,若無則生成預設圖示
     */
    private String generateAvatarUrl(String avatarUrl, String fallbackName) {
        if (avatarUrl != null && !avatarUrl.isEmpty()) {
            return avatarUrl;
        }
        return "https://ui-avatars.com/api/?name=" +
                URLEncoder.encode(fallbackName, StandardCharsets.UTF_8) +
                "&background=random";
    }
}