// src/main/java/com/vocabmatrix/backend/auth/service/LoginAttemptService.java

package com.vocabmatrix.backend.auth.service;

import java.util.concurrent.TimeUnit;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoginAttemptService {

    // 注意：已在RedisConfig.java中正確設置了序列化器才能使用 RedisTemplate<String, Object>
    private final RedisTemplate<String, Object> redisTemplate;

    // 配置參數
    private static final int MAX_ATTEMPTS = 5;  // 最大嘗試次數
    private static final int LOCK_DURATION_MINUTES = 30;  // 鎖定時間（分鐘）
    private static final int ATTEMPT_EXPIRY_HOURS = 24;  // 嘗試記錄過期時間（小時）

    // Redis Key 前綴
    private static final String ATTEMPT_KEY_PREFIX = "login:attempt:";
    private static final String LOCK_KEY_PREFIX = "login:lock:";

    /**
     * 記錄登入失敗
     * @param email 使用者 email
     */
    public void recordFailedAttempt(String email) {
        String attemptKey = ATTEMPT_KEY_PREFIX + email;

        // 增加失敗次數
        Long attempts = redisTemplate.opsForValue().increment(attemptKey);

        if (attempts == null) {
            attempts = 1L; // 確保 attempts 不為 null
        }

        if (attempts == 1) {
            // 第一次失敗，設定過期時間
            redisTemplate.expire(attemptKey, ATTEMPT_EXPIRY_HOURS, TimeUnit.HOURS);
        }

        log.debug("用戶 {} 登入失敗次數: {}", email, attempts);

        // 如果達到最大嘗試次數，鎖定帳號
        if (attempts >= MAX_ATTEMPTS) {
            lockAccount(email);
        }
    }

    /**
     * 鎖定帳號
     * @param email 使用者 email
     */
    private void lockAccount(String email) {
        String lockKey = LOCK_KEY_PREFIX + email;
        // 使用 String "locked" 作為值，鎖定時間為 30 分鐘
        redisTemplate.opsForValue().set(lockKey, "locked", LOCK_DURATION_MINUTES, TimeUnit.MINUTES);
        log.warn("帳號已被鎖定: {}，鎖定時間: {} 分鐘", email, LOCK_DURATION_MINUTES);
    }

    /**
     * 檢查帳號是否被鎖定
     * @param email 使用者 email
     * @return true: 已鎖定, false: 未鎖定
     */
    public boolean isAccountLocked(String email) {
        String lockKey = LOCK_KEY_PREFIX + email;
        Boolean hasKey = redisTemplate.hasKey(lockKey);
        return Boolean.TRUE.equals(hasKey);
    }

    /**
     * 取得剩餘鎖定時間（秒）
     * @param email 使用者 email
     * @return 剩餘秒數，若未鎖定則返回 0
     */
    public long getRemainingLockTime(String email) {
        String lockKey = LOCK_KEY_PREFIX + email;
        // getExpire 返回 Long，表示剩餘過期時間
        Long ttl = redisTemplate.getExpire(lockKey, TimeUnit.SECONDS);
        return ttl != null && ttl > 0 ? ttl : 0;
    }

    /**
     * 取得當前失敗次數
     * @param email 使用者 email
     * @return 失敗次數
     */
    public int getFailedAttempts(String email) {
        String attemptKey = ATTEMPT_KEY_PREFIX + email;
        Object value = redisTemplate.opsForValue().get(attemptKey);
        // 嘗試將 Redis 中的值轉換為整數
        if (value instanceof String) {
            try {
                return Integer.parseInt((String) value);
            } catch (NumberFormatException e) {
                log.error("Redis 儲存的嘗試次數值不是有效的數字: {}", value);
                return 0;
            }
        }
        return value != null ? (int) (long) value : 0; // 假設 Redis 存的是 Long
    }

    /**
     * 重置登入失敗記錄（登入成功時調用）
     * @param email 使用者 email
     */
    public void resetAttempts(String email) {
        String attemptKey = ATTEMPT_KEY_PREFIX + email;
        String lockKey = LOCK_KEY_PREFIX + email;

        redisTemplate.delete(attemptKey);
        redisTemplate.delete(lockKey); // 確保鎖定記錄也被移除

        log.debug("已重置用戶 {} 的登入失敗記錄", email);
    }

    /**
     * 手動解鎖帳號（管理員功能）
     * @param email 使用者 email
     */
    public void unlockAccount(String email) {
        resetAttempts(email);
        log.info("管理員手動解鎖帳號: {}", email);
    }
}
