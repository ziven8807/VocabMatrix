// src/main/java/com/vocabmatrix/backend/user/repository/UserRepository.java

package com.vocabmatrix.backend.user.repository;

import java.time.OffsetDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vocabmatrix.backend.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    // 用於註冊時的業務檢查
    boolean existsByUsername(String username);

    // 用於註冊時的業務檢查
    boolean existsByEmail(String email);

    // 用於查找用戶的email  (要求重寄註冊信的方法要用)
    Optional<User> findByEmail(String email);

    // 用於查找用戶的username 或 email  (支援登入)
    Optional<User> findByUsernameOrEmail(String username, String email);

    // 用於定時任務 (Scheduler)：找出所有狀態為「待刪除」且「申請時間已超過 30 天」的用戶，以便執行物理刪除
    @Modifying
    @Query("DELETE FROM User u WHERE u.status = :status AND u.deletedAt < :threshold")
    int deleteUsersByStatusAndBefore(@Param("status") User.UserStatus status,
                                     @Param("threshold") OffsetDateTime threshold);

}