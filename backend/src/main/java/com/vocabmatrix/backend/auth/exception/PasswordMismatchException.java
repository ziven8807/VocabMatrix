// src/main/java/com/vocabmatrix/backend/auth/exception/PasswordMismatchException.java

package com.vocabmatrix.backend.auth.exception;

/**
 * 當使用者輸入的新密碼與確認密碼不一致時拋出的例外。
 * 這是一個常見的使用者輸入驗證錯誤。
 * 繼承 RuntimeException,使其成為一個 Unchecked Exception。
 */
public class PasswordMismatchException extends RuntimeException {

    /**
     * 建構函數：接受一個詳細的錯誤訊息。
     * @param message 描述錯誤的原因,例如 "New password and confirm password do not match"
     */
    public PasswordMismatchException(String message) {
        super(message);
    }
}