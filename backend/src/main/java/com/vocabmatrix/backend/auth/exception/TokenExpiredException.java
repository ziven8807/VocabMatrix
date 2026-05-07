// src/main/java/com/vocabmatrix/backend/auth/exception/TokenExpiredException.java

package com.vocabmatrix.backend.auth.exception;

/**
 * 當使用者嘗試使用已過期的 Token 時拋出的例外。
 * 常見於密碼重置或 Email 驗證流程中,Token 超過有效期限。
 * 繼承 RuntimeException,使其成為一個 Unchecked Exception。
 */
public class TokenExpiredException extends RuntimeException {

    /**
     * 建構函數：接受一個詳細的錯誤訊息。
     * @param message 描述錯誤的原因,例如 "Reset link has expired. Please request a new one."
     */
    public TokenExpiredException(String message) {
        super(message);
    }
}