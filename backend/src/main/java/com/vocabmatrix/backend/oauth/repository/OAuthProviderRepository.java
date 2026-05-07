// backend/src/main/java/com/vocabmatrix/oauth/repository/OAuthProviderRepository.java

package com.vocabmatrix.backend.oauth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vocabmatrix.backend.oauth.entity.OAuthProvider;

import java.util.Optional;

@Repository
public interface OAuthProviderRepository extends JpaRepository<OAuthProvider, Long> {

    // 用於查找用戶的綁定的第三方登入商
    Optional<OAuthProvider> findByName(String providerName);

}