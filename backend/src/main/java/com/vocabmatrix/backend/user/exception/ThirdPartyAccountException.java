// src/main/java/com/vocabmatrix/backend/user/exception/ThirdPartyAccountException.java

package com.vocabmatrix.backend.user.exception;

/**
 * 當純第三方登入的使用者嘗試執行需要密碼的操作時拋出的例外。
 * 純第三方帳號是指僅透過 OAuth (如 Google、Facebook) 登入，未設定本地密碼的使用者。
 * 常見觸發場景：修改密碼、刪除帳號等需要密碼驗證的操作。
 * 繼承 RuntimeException，使其成為一個 Unchecked Exception。
 */
public class ThirdPartyAccountException extends RuntimeException {

    /**
     * 建構函數：接受一個詳細的錯誤訊息。
     * 建議訊息中說明該帳號為純第三方登入，並提示使用者如何設定密碼。
     * @param message 描述錯誤的原因 (e.g., "This account uses third-party login only. Please set a password first.")。
     */
    public ThirdPartyAccountException(String message) {
        super(message);
    }
}
