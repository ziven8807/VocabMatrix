// src/main/java/com/vocabmatrix/backend/config/RedisConfig.java

package com.vocabmatrix.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    /**
     * 1. 預設的 RedisTemplate (用於業務數據，使用 JSON 序列化)
     */
    @Bean
    @Primary
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        StringRedisSerializer stringSerializer = new StringRedisSerializer();
        template.setKeySerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);

        GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer();
        template.setValueSerializer(jsonSerializer);
        template.setHashValueSerializer(jsonSerializer);

        template.afterPropertiesSet();
        return template;
    }

    /**
     * 2. 專門給限流用的 RedisTemplate (使用 String 序列化，適用於 Lua/ZSet Score 操作)
     */
    @Bean(name = "rateLimitRedisTemplate")
    public RedisTemplate<String, Object> rateLimitRedisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        StringRedisSerializer stringSerializer = new StringRedisSerializer();
        template.setKeySerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);

        // 關鍵：必須使用 String 序列化器，確保 Lua 腳本能正確處理 Sorted Set Score (時間戳)
        template.setValueSerializer(stringSerializer);
        template.setHashValueSerializer(stringSerializer);

        template.afterPropertiesSet();
        return template;
    }

    // --- Lua 腳本 Bean ---

    /**
     * 3. 滑動窗口限流 Lua 腳本 (核心)
     * 返回值: Long (-1 表示超限，>0 表示當前請求數)
     */
    @Bean
    public RedisScript<Long> rateLimitSlidingWindowScript() {
        String luaScript =
                // KEYS[1]: key, ARGV[1]: 窗口起始時間, ARGV[2]: 最大請求數,
                // ARGV[3]: 當前時間, ARGV[4]: 請求唯一ID, ARGV[5]: key 過期時間 (秒)

                // 1. 清除窗口外的過期數據 (Score < ARGV[1])
                "redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', ARGV[1]) " +

                        // 2. 獲取當前窗口內的數量
                        "local count = redis.call('ZCARD', KEYS[1]) " +

                        // 3. 判斷是否超限
                        "if count < tonumber(ARGV[2]) then " +
                        // 4. 未超限: 添加當前請求 (Score=當前時間, Member=UUID)
                        "    redis.call('ZADD', KEYS[1], ARGV[3], ARGV[4]) " +
                        // 5. 設定 Key 過期時間，防止 ZSet 永不過期
                        "    redis.call('EXPIRE', KEYS[1], ARGV[5]) " +
                        // 6. 返回新的計數
                        "    return count + 1 " +
                        "else " +
                        // 7. 超限: 返回 -1
                        "    return -1 " +
                        "end";

        return RedisScript.of(luaScript, Long.class);
    }
}