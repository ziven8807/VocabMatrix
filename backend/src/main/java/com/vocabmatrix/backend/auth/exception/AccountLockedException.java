// src/main/java/com/vocabmatrix/backend/auth/exception/AccountLockedException.java

package com.vocabmatrix.backend.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * 當使用者帳號因多次登入失敗而被鎖定時拋出的例外。
 * 返回 403 Forbidden 狀態碼。
 */
@ResponseStatus(HttpStatus.FORBIDDEN) // 使用 403 Forbidden 狀態碼
public class AccountLockedException extends RuntimeException {

    private final long lockDurationSeconds; // 鎖定剩餘時間（秒）

    /**
     * 建構函數。
     * @param message 錯誤訊息
     * @param lockDurationSeconds 帳號被鎖定的持續時間（秒）
     */
    public AccountLockedException(String message, long lockDurationSeconds) {
        super(message);
        this.lockDurationSeconds = lockDurationSeconds;
    }

    /**
     * 取得帳號鎖定持續時間（秒）。
     * 這個方法通常會被 ControllerAdvice 用於將鎖定時間包含在 API 錯誤響應中。
     */
    public long getLockDurationSeconds() {
        return lockDurationSeconds;
    }
}