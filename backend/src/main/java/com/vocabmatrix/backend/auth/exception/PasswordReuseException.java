// src/main/java/com/vocabmatrix/backend/auth/exception/PasswordReuseException.java

package com.vocabmatrix.backend.auth.exception;

/**
 * 當使用者嘗試使用最近用過的密碼作為新密碼時拋出的例外。
 * 這是一個安全策略強制執行的業務錯誤。
 * 繼承 RuntimeException，使其成為一個 Unchecked Exception。
 */
public class PasswordReuseException extends RuntimeException {

    /**
     * 建構函數：接受一個詳細的錯誤訊息。
     * @param message 描述錯誤的原因，例如 "The new password cannot be the same as the current password."
     */
    public PasswordReuseException(String message) {
        super(message);
    }
}
