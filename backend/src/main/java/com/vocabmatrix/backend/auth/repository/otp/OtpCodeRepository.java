// src/main/java/com/vocabmatrix/backend/auth/repository/otp/OtpCodeRepository.java

package com.vocabmatrix.backend.auth.repository.otp;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vocabmatrix.backend.auth.entity.otp.OtpCode;
import com.vocabmatrix.backend.user.entity.User;

/**
 * OtpCode 資料庫操作介面
 */
@Repository
public interface OtpCodeRepository extends JpaRepository<OtpCode, Long> {

    /**
     * 查找某個使用者所有未使用的 OTP 碼
     * @param user 使用者實體
     * @param isUsed 是否已使用 (應為 false)
     * @return 未使用的 OtpCode 列表
     */
    List<OtpCode> findByUserAndIsUsed(User user, boolean isUsed);

    /**
     * 根據雜湊值查找單個未使用的 OTP 碼
     * @param codeHash OTP 雜湊值
     * @param isUsed 是否已使用 (應為 false)
     * @return OtpCode 實體
     */
    Optional<OtpCode> findByCodeHashAndIsUsed(String codeHash, boolean isUsed);

    /**
     * 刪除特定使用者所有未過期的 OTP 碼 (在生成新碼時調用)
     * @param user 使用者實體
     */
    void deleteByUserAndExpiryDateAfter(User user, java.time.OffsetDateTime after);
}