// src/main/java/com/vocabmatrix/backend/common/exception/RateLimitExceededException.java

package com.vocabmatrix.backend.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * 當請求速率超出限制時拋出的例外。
 * 返回 429 Too Many Requests 狀態碼，並攜帶 Retry-After 資訊。
 */
@ResponseStatus(HttpStatus.TOO_MANY_REQUESTS) // 返回 429 Too Many Requests 狀態碼
public class RateLimitExceededException extends RuntimeException {

    // 建議用戶在多少秒後重試 (用於 Retry-After Header)
    private final long retryAfterSeconds;

    /**
     * 建構函數：接受錯誤訊息和建議的重試等待時間。
     * @param message 描述錯誤的原因
     * @param retryAfterSeconds 用戶應該等待的秒數
     */
    public RateLimitExceededException(String message, long retryAfterSeconds) {
        super(message);
        this.retryAfterSeconds = retryAfterSeconds; // 儲存這個重要的資訊
    }

    /**
     * 取得建議的重試等待時間（秒）。
     * 這個方法被 RateLimitFilter 調用。
     * @return 剩餘秒數
     */
    public long getRetryAfterSeconds() {
        return retryAfterSeconds;
    }
}