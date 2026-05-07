// src/main/java/com/vocabmatrix/backend/user/service/AccountDeletionService.java

package com.vocabmatrix.backend.user.service;

import java.time.OffsetDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vocabmatrix.backend.user.dto.deleteaccount.DeleteAccountRequestDTO;
import com.vocabmatrix.backend.user.entity.AccountDeletionLog;
import com.vocabmatrix.backend.user.entity.User;
import com.vocabmatrix.backend.user.event.AccountDeletionRequestedEvent;
import com.vocabmatrix.backend.user.exception.UserNotFoundException;
import com.vocabmatrix.backend.user.repository.AccountDeletionLogRepository;
import com.vocabmatrix.backend.user.repository.UserRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountDeletionService {

    // 依賴注入：使用UserRepository的Jpa提供的findById()查找申請刪除帳號的使用者是否存在、想撤銷申請的使用者是誰
    private final UserRepository userRepository;

    // 依賴注入：使用 AccountDeletionLogRepository的Jpa提供的save()方法儲存刪除申請的資訊
    private final AccountDeletionLogRepository deletionLogRepository;

    // 依賴注入：使用PasswordEncoder的matches()方法去比對申請者所輸入的密碼是否正確（用來確定真的是本人申請刪除帳號）
    private final PasswordEncoder passwordEncoder;

    // 依賴注入：使用ApplicationEventPublisher來進行事件驅動來派發刪除帳號提醒的工作任務
    private final ApplicationEventPublisher eventPublisher;

    /**
     * 處理「申請刪除」請求流程
     */
    @Transactional
    public void requestDeletion(Long userId, DeleteAccountRequestDTO dto, String ipAddress) {
        log.info("Processing account deletion request for User ID: {}", userId);

        // 1. 查找用戶
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User ID not found: " + userId));

        // 2. 安全驗證：比對密碼 (分成本地帳號跟 OAuth 的情況)
        if (user.hasPassword()) {
            // 1. 本地帳號：必須檢查密碼
            if (dto.getPassword() == null || !passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
                throw new BadCredentialsException("密碼錯誤，身分驗證失敗");
            }
        } else {
            // 2. OAuth 帳號：因為沒有密碼，只要有 JWT 就代表通過第三方驗證
            log.info("OAuth 使用者 {} 申請刪除，略過密碼驗證", userId);
        }

        // 3. 更新用戶狀態
        user.setStatus(User.UserStatus.PENDING_DELETE);
        user.setDeletedAt(OffsetDateTime.now());
        userRepository.save(user);

        // 4. 發布事件 (由 AccountDeletionEmailListener 監聽並寄信)
        eventPublisher.publishEvent(new AccountDeletionRequestedEvent(this, user));

        // 5. 寫入審計日誌
        saveAuditLog(user, "REQUEST_DELETE", dto.getReasonCategory(), dto.getDetail(), ipAddress);

        log.info("Account deletion request recorded and email event published for user: {}", user.getEmail());
    }

    /**
     * 處理「撤銷刪除」流程
     */
    @Transactional
    public void cancelDeletion(Long userId, String ipAddress) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User ID not found: " + userId));

        if (user.getStatus() != User.UserStatus.PENDING_DELETE) {
            log.warn("Cancel deletion skipped: User {} status is {}", userId, user.getStatus());
            return;
        }

        user.setStatus(User.UserStatus.ACTIVE);
        user.setDeletedAt(null);
        userRepository.save(user);

        saveAuditLog(user, "CANCEL_DELETE", null, "User manually cancelled deletion.", ipAddress);
        log.info("Account deletion cancelled for user: {}", user.getEmail());
    }

    private void saveAuditLog(User user, String action, String category, String detail, String ip) {
        AccountDeletionLog auditLog = AccountDeletionLog.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .action(action)
                .reasonCategory(category)
                .detail(detail)
                .ipAddress(ip)
                .build();
        deletionLogRepository.save(auditLog);
    }
}