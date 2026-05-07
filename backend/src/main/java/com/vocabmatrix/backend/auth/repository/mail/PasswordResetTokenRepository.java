// src/main/java/com/vocabmatrix/backend/auth/repository/mail/PasswordResetTokenRepository.java

package com.vocabmatrix.backend.auth.repository.mail;

import java.time.OffsetDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.vocabmatrix.backend.auth.entity.mail.PasswordResetToken;
import com.vocabmatrix.backend.user.entity.User;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    /**
     * 根據 Token Hash 查找令牌。
     * 這是驗證流程的關鍵步驟。
     * @param tokenHash 令牌的 SHA-256 哈希值
     * @return 匹配的令牌，如果不存在則為 Optional.empty()
     */
    Optional<PasswordResetToken> findByTokenHash(String tokenHash);

    /**
     * 刪除指定使用者關聯的所有重置密碼用Token令牌。
     * * 通常用於：
     * 1. 生成新 Token 前清理舊有數據（確保一對一邏輯）。
     * 2. 使用者帳號刪除時的連帶清理。
     * * 注意：此方法在執行時需要處於事務（Transaction）環境中。
     * @param user 要清理 Token 的使用者實體
     */
    void deleteAllByUser(User user);

}