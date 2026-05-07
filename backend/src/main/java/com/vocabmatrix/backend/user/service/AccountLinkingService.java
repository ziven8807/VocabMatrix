// src/main/java/com/vocabmatrix/backend/user/service/AccountLinkingService.java

package com.vocabmatrix.backend.user.service;

import java.util.List;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vocabmatrix.backend.oauth.entity.OAuthAccount;
import com.vocabmatrix.backend.oauth.entity.OAuthProvider;
import com.vocabmatrix.backend.oauth.repository.OAuthAccountRepository;
import com.vocabmatrix.backend.oauth.repository.OAuthProviderRepository;
import com.vocabmatrix.backend.user.dto.oauth.LinkedProviderDTO;
import com.vocabmatrix.backend.user.entity.User;
import com.vocabmatrix.backend.user.exception.LastIdentityException;
import com.vocabmatrix.backend.user.repository.UserRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountLinkingService {

    private final UserRepository userRepository;
    private final OAuthAccountRepository oauthAccountRepository;
    private final OAuthProviderRepository oauthProviderRepository;

    /**
     * 取得使用者已綁定的第三方帳號列表
     */
    @Transactional(readOnly = true)
    public List<LinkedProviderDTO> getLinkedProviders(Long userId) {
        return oauthAccountRepository.findLinkedProvidersByUserId(userId);
    }

    /**
     * 執行帳號綁定 (遵循「先搶先贏」原則)
     */
    @Transactional
    public void linkProvider(Long userId, String providerName, String providerUserId, String email) {

        // 1. 檢查此第三方帳號是否已被「任何人」綁定過
        Optional<OAuthAccount> existingOauth = oauthAccountRepository.findByProviderNameAndProviderUserId(providerName, providerUserId);

        if (existingOauth.isPresent()) {
            User owner = existingOauth.get().getUser();

            // 如果綁定者不是當前用戶，則拋出異常（防止合併帳號衝突）
            if (!owner.getId().equals(userId)) {
                log.warn("Security Alert: User {} tried to link a {} account already owned by user {}", userId, providerName, owner.getId());
                throw new IllegalStateException("此 " + providerName + " 帳號已與其他 VocabMatrix 帳號綁定。請先登入該帳號並解除綁定。");
            }

            // 如果已經是自己綁定的，直接返回即可
            log.info("User {} already linked to this {} account.", userId, providerName);
            return;
        }

        // 2. 獲取當前用戶實體
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. 檢查當前用戶是否已經綁定過「同類型」的平台
        if (oauthAccountRepository.existsByUserAndProviderName(user, providerName)) {
            throw new IllegalStateException("您已經綁定過一個 " + providerName + " 帳號了。");
        }

        // 4. 取得或建立 OAuthProvider 實體（關鍵修正）
        OAuthProvider provider = oauthProviderRepository.findByName(providerName)
                .orElseGet(() -> {
                    log.info("Provider {} 不存在，建立新的 Provider", providerName);
                    OAuthProvider newProvider = new OAuthProvider(providerName);
                    return oauthProviderRepository.save(newProvider);
                });

        // 5. 執行綁定（加上 provider 欄位）
        OAuthAccount newOauth = OAuthAccount.builder()
                .user(user)
                .provider(provider)  // 這是關鍵！
                .providerUserId(providerUserId)
                .providerEmail(email)
                .build();

        oauthAccountRepository.save(newOauth);
        log.info("User {} successfully linked a new {} account: {}", userId, providerName, email);
    }

    /**
     * 解除 OAuth 綁定
     */
    @Transactional
    public void unlinkProvider(Long userId, String provider) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean canBeUnlinked = checkUnlinkSafety(user);

        if (!canBeUnlinked) {
            log.warn("Security Block: User {} attempted to unlink their only login method ({})", userId, provider);
            throw new LastIdentityException("無法解除綁定：這是您唯一的登入方式。請先設定密碼或綁定其他平台。");
        }

        int result = oauthAccountRepository.deleteByUserAndProvider(user, provider);

        if (result == 0) {
            throw new IllegalArgumentException("帳號尚未綁定此平台: " + provider);
        }

        log.info("User {} successfully unlinked {} account.", userId, provider);
    }

    private boolean checkUnlinkSafety(User user) {
        if (user.hasPassword()) {
            return true;
        }
        long oauthCount = oauthAccountRepository.countByUser(user);
        return oauthCount > 1;
    }
}