// src/main/java/com/vocabmatrix/backend/common/service/RateLimitService.java

package com.vocabmatrix.backend.common.service;

import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations.TypedTuple;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.stereotype.Service;

import com.vocabmatrix.backend.common.exception.RateLimitExceededException;

@Service
@Slf4j
public class RateLimitService {

    // 注入專門為限流配置的 RedisTemplate (使用 String 序列化)
    private final RedisTemplate<String, Object> rateLimitRedisTemplate;

    // 注入滑動窗口 Lua 腳本
    private final RedisScript<Long> rateLimitSlidingWindowScript;

    // 使用手動構造函數，確保 @Qualifier 正確注入
    public RateLimitService(
            @Qualifier("rateLimitRedisTemplate") RedisTemplate<String, Object> rateLimitRedisTemplate,
            RedisScript<Long> rateLimitSlidingWindowScript) {

        this.rateLimitRedisTemplate = rateLimitRedisTemplate;
        this.rateLimitSlidingWindowScript = rateLimitSlidingWindowScript;
    }

    // 配置參數
    private static final int AUTH_LIMIT = 5;           // 登入/註冊相關
    private static final int DURATION_SECONDS = 60;    // 時間窗口長度 (秒)
    private static final String RATE_LIMIT_PREFIX = "rate:limit:";
    private static final int EXPIRE_BUFFER_SECONDS = 10; // 額外 Key 存活時間

    /**
     * 限流類型
     */
    public enum LimitType {
        AUTH(AUTH_LIMIT);

        private final int limit;

        LimitType(int limit) {
            this.limit = limit;
        }

        public int getLimit() {
            return limit;
        }
    }

    /**
     * 檢查速率限制 - 使用預設類型
     */
    public void checkRateLimit(String identifier) {
        checkRateLimit(identifier, LimitType.AUTH);
    }

    /**
     * 檢查速率限制 - 滑動窗口版本 (使用 Sorted Set 和 Lua 腳本)
     * @param identifier 用戶 IP 或用戶 ID
     * @param type 限流類型
     */
    public void checkRateLimit(String identifier, LimitType type) {
        String key = RATE_LIMIT_PREFIX + type.name().toLowerCase() + ":" + identifier;
        long now = System.currentTimeMillis();

        // 窗口起始時間：當前時間 - 窗口時長 (毫秒)
        long windowStart = now - (DURATION_SECONDS * 1000L);
        int maxRequests = type.getLimit();

        // 執行原子滑動窗口腳本
        Long result = rateLimitRedisTemplate.execute( // 確保使用正確的 rateLimitRedisTemplate
                rateLimitSlidingWindowScript,
                Collections.singletonList(key),
                String.valueOf(windowStart),
                String.valueOf(maxRequests),
                String.valueOf(now),
                UUID.randomUUID().toString(),
                String.valueOf(DURATION_SECONDS + EXPIRE_BUFFER_SECONDS)
        );

        // 處理超限邏輯
        if (result != null && result == -1) {

            // 獲取 Sorted Set 中最舊請求的分數 (即時間戳)，用於計算重試時間
            // 注意：由於 rateLimitRedisTemplate 使用 String 序列化，TypedTuple 的 value 應為 String
            Set<TypedTuple<Object>> tuples = rateLimitRedisTemplate.opsForZSet().rangeWithScores(key, 0, 0);

            long retryAfterSeconds = 1;

            if (!tuples.isEmpty()) {
                TypedTuple<Object> oldestTuple = tuples.iterator().next();
                if (oldestTuple.getScore() != null) {
                    long oldestRequestScore = oldestTuple.getScore().longValue();

                    // 計算距離窗口結束還需要多少時間 (毫秒)
                    long windowEndTime = oldestRequestScore + (DURATION_SECONDS * 1000L);
                    long retryAfterMs = windowEndTime - now;

                    retryAfterSeconds = Math.max(1, retryAfterMs / 1000);
                }
            }

            log.warn("速率限制觸發: {} (類型: {}) 在過去 {} 秒內已達 {} 次上限,建議 {} 秒後重試",
                    identifier, type, DURATION_SECONDS, maxRequests, retryAfterSeconds);

            throw new RateLimitExceededException(
                    "The API request frequency is too high. Please try again later.",
                    retryAfterSeconds
            );
        }

        // 處理通過邏輯
        log.debug("限流檢查通過: {} (類型: {}, 當前: {}/{} 次)",
                identifier, type, result, maxRequests);
    }

    // --- 輔助方法 (適應 ZSet) ---

    /**
     * 取得當前請求次數 (需先清理過期數據)
     */
    public int getCurrentRequests(String identifier, LimitType type) {
        String key = RATE_LIMIT_PREFIX + type.name().toLowerCase() + ":" + identifier;
        long now = System.currentTimeMillis();
        long windowStart = now - (DURATION_SECONDS * 1000L);

        // 清理過期數據確保準確
        rateLimitRedisTemplate.opsForZSet().removeRangeByScore(key, Double.NEGATIVE_INFINITY, (double) windowStart);

        Long count = rateLimitRedisTemplate.opsForZSet().zCard(key);
        return count != null ? count.intValue() : 0;
    }

    /**
     * 取得剩餘可用次數
     */
    public int getRemainingRequests(String identifier, LimitType type) {
        int current = getCurrentRequests(identifier, type);
        return Math.max(0, type.getLimit() - current);
    }

    /**
     * 手動重置速率限制
     */
    public void resetRateLimit(String identifier, LimitType type) {
        String key = RATE_LIMIT_PREFIX + type.name().toLowerCase() + ":" + identifier;
        rateLimitRedisTemplate.delete(key);
        log.info("已重置速率限制: {} (類型: {})", identifier, type);
    }
}