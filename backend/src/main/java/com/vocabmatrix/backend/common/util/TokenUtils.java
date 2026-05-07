// src/main/java/com/vocabmatrix/backend/common/util/TokenUtils.java

package com.vocabmatrix.backend.common.util;

import lombok.extern.slf4j.Slf4j;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

/**
 * 用於生成和驗證 Token 雜湊值的工具類別。
 * 採用 SHA-256 雜湊演算法。
 */
@Slf4j
public final class TokenUtils { // 加入final關鍵字：阻止class被繼承，確保雜湊邏輯不會被意外覆蓋或隱藏。

    private static final String HASH_ALGORITHM = "SHA-256";

    // 加入私有建構子
    private TokenUtils() {
        // 拋出例外是為了避免任何反射機制 (Reflection) 試圖呼叫建構子
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }

    /**
     * 將原始 Token 字串轉換為 SHA-256 雜湊值。
     * @param token 原始 Token 字串 (UUID)
     * @return 雜湊後的十六進制字串
     */
    public static String hashToken(String token) { // 加入static關鍵字：直接以 TokenUtils.hashToken(...) 呼叫，完全不需要注入或實例化。
        try {
            MessageDigest digest = MessageDigest.getInstance(HASH_ALGORITHM);
            byte[] encodedhash = digest.digest(token.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            log.error("Hashing algorithm {} not found.", HASH_ALGORITHM, e);
            // 這是嚴重錯誤，應該在啟動時就確保演算法存在
            throw new IllegalStateException("Required hashing algorithm not found.", e);
        }
    }
}