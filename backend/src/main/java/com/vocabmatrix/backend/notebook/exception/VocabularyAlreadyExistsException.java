// src/main/java/com/vocabmatrix/backend/notebook/exception/VocabularyAlreadyExistsException.java

package com.vocabmatrix.backend.notebook.exception;

/**
 * 當使用者嘗試將單字加入筆記本，但該單字已存在於該筆記本時拋出的例外。
 * 繼承 RuntimeException，使其成為一個 Unchecked Exception。
 */
public class VocabularyAlreadyExistsException extends RuntimeException {

    /**
     * 建構函數：接受一個詳細的錯誤訊息。
     * @param message 描述錯誤的原因 (e.g., "Vocabulary already exists in this notebook")
     */
    public VocabularyAlreadyExistsException(String message) {
        super(message);
    }
}