// src/main/java/com/vocabmatrix/backend/auth/exception/InvalidTokenException.java

package com.vocabmatrix.backend.auth.exception;

/**
 * 當使用者提供的 Token 無效或不存在時拋出的例外。
 * 可能原因包括:Token 格式錯誤、Token 已被使用、Token 不存在於資料庫中。
 * 繼承 RuntimeException,使其成為一個 Unchecked Exception。
 */
public class InvalidTokenException extends RuntimeException {

    /**
     * 建構函數：接受一個詳細的錯誤訊息。
     * @param message 描述錯誤的原因,例如 "Invalid reset link"
     */
    public InvalidTokenException(String message) {
        super(message);
    }
}