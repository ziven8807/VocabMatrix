// src/main/java/com/vocabmatrix/backend/user/exception/UserAlreadyExistsException.java

package com.vocabmatrix.backend.user.exception;

/**
 * 當使用者嘗試註冊，但用戶名或郵箱已存在時拋出的例外。
 * 繼承 RuntimeException，使其成為一個 Unchecked Exception。
 */
public class UserAlreadyExistsException extends RuntimeException {

    /**
     * 建構函數：接受一個詳細的錯誤訊息。
     * @param message 描述錯誤的原因 (e.g., "用戶名已被使用")
     */
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}