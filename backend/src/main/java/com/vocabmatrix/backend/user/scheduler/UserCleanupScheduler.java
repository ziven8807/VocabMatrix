// src/main/java/com/vocabmatrix/backend/user/scheduler/UserCleanupScheduler.java

package com.vocabmatrix.backend.user.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;

import com.vocabmatrix.backend.user.entity.User;
import com.vocabmatrix.backend.user.repository.UserRepository;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserCleanupScheduler {

    private final UserRepository userRepository;

    /**
     * 每天凌晨執行一次，物理刪除申請超過 30 天且狀態為「待刪除」的帳號。
     * 使用 @Modifying 高效刪除，避免大數據量導致的記憶體溢出 (OOM)。
     */
    @Scheduled(cron = "0 0 2 * * ?") // 每天凌晨 2:00 執行
    @Transactional
    public void performPhysicalDeletion() {
        // 1. 計算 30 天前的時間點
        OffsetDateTime threshold = OffsetDateTime.now().minusDays(30);

        log.info("Starting scheduled cleanup task for users pending deletion before: {}", threshold);

        try {
            // 2. 直接呼叫 Repository 的批量刪除方法，並獲取刪除筆數
            int deletedCount = userRepository.deleteUsersByStatusAndBefore(
                    User.UserStatus.PENDING_DELETE,
                    threshold
            );

            // 3. 根據結果記錄日誌
            if (deletedCount > 0) {
                log.info("Cleanup successful: {} users have been physically deleted from the database.", deletedCount);
            } else {
                log.info("Cleanup finished: No expired accounts found to delete.");
            }

        } catch (Exception e) {
            // 異常處理：確保 Scheduler 發生錯誤時能留下紀錄，且不會導致應用崩潰
            log.error("Error occurred during user cleanup scheduler: {}", e.getMessage(), e);
        }
    }
}