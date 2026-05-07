// src/main/java/com/vocabmatrix/backend/oauth/exception/OAuthAuthenticationException.java

package com.vocabmatrix.backend.oauth.exception;

/**
 * 當 OAuth 認證過程中發生錯誤時拋出的例外。
 * 常見觸發場景：無法從 OAuth Provider 獲取使用者資訊、Token 交換失敗、網路錯誤等。
 * 繼承 RuntimeException，使其成為一個 Unchecked Exception。
 */
public class OAuthAuthenticationException extends RuntimeException {

    /**
     * 建構函數：接受一個詳細的錯誤訊息。
     * @param message 描述錯誤的原因 (e.g., "Failed to authenticate with Google OAuth")。
     */
    public OAuthAuthenticationException(String message) {
        super(message);
    }

    /**
     * 建構函數：接受錯誤訊息和根本原因。
     * @param message 描述錯誤的原因
     * @param cause 導致此例外的底層異常
     */
    public OAuthAuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}