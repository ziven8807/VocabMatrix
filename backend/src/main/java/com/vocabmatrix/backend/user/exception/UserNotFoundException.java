// src/main/java/com/vocabmatrix/backend/user/exception/UserNotFoundException.java

package com.vocabmatrix.backend.user.exception;

/**
 * 當依據 ID 或其他識別資訊查詢使用者時，找不到對應的 User 實體時拋出的例外。
 * 繼承 RuntimeException，使其成為一個 Unchecked Exception。
 */
public class UserNotFoundException extends RuntimeException {

    /**
     * 建構函數：接受一個詳細的錯誤訊息。
     * 建議訊息中包含查詢的依據 (e.g., "找不到 ID 為 123 的使用者")。
     * @param message 描述錯誤的原因。
     */
    public UserNotFoundException(String message) {
        super(message);
    }
}