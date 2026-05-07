// backend/src/main/java/com/vocabmatrix/backend/oauth/repository/OAuthAccountRepository.java

package com.vocabmatrix.backend.oauth.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vocabmatrix.backend.oauth.entity.OAuthAccount;
import com.vocabmatrix.backend.user.entity.User;
import com.vocabmatrix.backend.user.dto.oauth.LinkedProviderDTO;

@Repository
public interface OAuthAccountRepository extends JpaRepository<OAuthAccount, Long> {

    /**
     * 根據 provider 名稱和第三方使用者 ID 查找綁定記錄
     * 使用 JOIN FETCH 一次性查出 User 資訊，這在 SuccessHandler 檢查「誰佔用了帳號」時非常有用
     */
    @Query("SELECT oa FROM OAuthAccount oa " +
            "JOIN FETCH oa.user " +
            "JOIN FETCH oa.provider p " +
            "WHERE p.name = :providerName AND oa.providerUserId = :providerUserId")
    Optional<OAuthAccount> findByProviderNameAndProviderUserId(
            @Param("providerName") String providerName,
            @Param("providerUserId") String providerUserId
    );

    /**
     * 檢查使用者是否已經綁定過特定平台 (例如是否已綁定過 Google)
     */
    @Query("SELECT COUNT(oa) > 0 FROM OAuthAccount oa WHERE oa.user = :user AND oa.provider.name = :providerName")
    boolean existsByUserAndProviderName(
            @Param("user") User user,
            @Param("providerName") String providerName
    );

    /**
     * 取得使用者已綁定的第三方帳號列表
     */
    @Query("SELECT new com.vocabmatrix.backend.user.dto.oauth.LinkedProviderDTO(" +
            "p.name, oa.providerEmail, oa.user.id) " +
            "FROM OAuthAccount oa " +
            "JOIN oa.provider p " +
            "WHERE oa.user.id = :userId")
    List<LinkedProviderDTO> findLinkedProvidersByUserId(@Param("userId") Long userId);

    /**
     * 計算該使用者目前綁定了幾個 OAuth 帳號
     */
    long countByUser(User user);

    /**
     * 根據 User 和 Provider 名稱刪除綁定
     */
    @Modifying
    @Query("DELETE FROM OAuthAccount oa WHERE oa.user = :user AND oa.provider.name = :providerName")
    int deleteByUserAndProvider(
            @Param("user") User user,
            @Param("providerName") String providerName
    );
}