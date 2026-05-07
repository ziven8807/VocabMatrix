// src/main/java/com/vocabmatrix/backend/user/exception/LastIdentityException.java

package com.vocabmatrix.backend.user.exception;

/**
 * 當使用者嘗試解除其最後一個登入手段（唯一的第三方登入或密碼）時拋出。
 * 目的在於防止帳號變成無法登入的孤兒帳號。
 */
public class LastIdentityException extends RuntimeException {

    /**
     * @param message 錯誤描述訊息 (e.g., "無法解除綁定：這是您唯一的登入方式。")
     */
    public LastIdentityException(String message) {
        super(message);
    }
}