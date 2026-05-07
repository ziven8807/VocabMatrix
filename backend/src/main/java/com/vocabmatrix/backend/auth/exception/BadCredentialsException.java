// src/main/java/com/vocabmatrix/backend/auth/exception/BadCredentialsException.java

package com.vocabmatrix.backend.auth.exception;

/**
 * 當使用者提供的登入憑證無效時拋出的例外。
 * 包含但不限於：帳號不存在、密碼錯誤等情況。
 * 為了安全考量，通常不會明確告知是帳號還是密碼錯誤。
 * 繼承 RuntimeException，使其成為一個 Unchecked Exception。
 */
public class BadCredentialsException extends RuntimeException {

    /**
     * 建構函數：接受一個詳細的錯誤訊息。
     * 建議使用統一的錯誤訊息以避免時序攻擊 (Timing Attack)。
     * @param message 描述錯誤的原因，例如 "Invalid username/email or password."
     */
    public BadCredentialsException(String message) {
        super(message);
    }
}