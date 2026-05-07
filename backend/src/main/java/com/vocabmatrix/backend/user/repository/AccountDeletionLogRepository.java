// src/main/java/com/vocabmatrix/backend/user/repository/AccountDeletionLogRepository.java

package com.vocabmatrix.backend.user.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.vocabmatrix.backend.user.entity.AccountDeletionLog;


@Repository
public interface AccountDeletionLogRepository extends JpaRepository<AccountDeletionLog, Long> {

    // 查找特定用戶的歷史操作
    List<AccountDeletionLog> findByUserIdOrderByCreatedAtDesc(Long userId);

    // 統計流失原因分類（用於營運報表）
    @Query("SELECT a.reasonCategory as category, COUNT(a) as count " +
            "FROM AccountDeletionLog a " +
            "WHERE a.action = 'REQUEST_DELETE' " +
            "GROUP BY a.reasonCategory " +
            "ORDER BY count DESC")
    List<Map<String, Object>> countDeletionReasons();
}
