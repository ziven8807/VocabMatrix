// src/main/java/com/vocabmatrix/backend/oauth/exception/UnsupportedOAuthProviderException.java

package com.vocabmatrix.backend.oauth.exception;

/**
 * 當使用者嘗試使用不支援的 OAuth Provider 進行登入或綁定時拋出的例外。
 * 常見觸發場景：前端傳入錯誤的 provider 名稱、URL 被手動修改、或存取已停用的 OAuth Provider。
 * 繼承 RuntimeException，使其成為一個 Unchecked Exception。
 */
public class UnsupportedOAuthProviderException extends RuntimeException {

    /**
     * 建構函數：接受一個詳細的錯誤訊息。
     * 建議訊息中包含嘗試使用的 provider 名稱和支援的 provider 列表。
     * @param message 描述錯誤的原因 (e.g., "OAuth provider 'tiktok' is not supported. Supported providers: google, facebook")。
     */
    public UnsupportedOAuthProviderException(String message) {
        super(message);
    }
}