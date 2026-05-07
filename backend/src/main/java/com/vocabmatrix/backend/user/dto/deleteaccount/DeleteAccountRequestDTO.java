// src/main/java/com/vocabmatrix/backend/user/dto/deleteaccount/DeleteAccountRequestDTO.java

package com.vocabmatrix.backend.user.dto.deleteaccount;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DeleteAccountRequestDTO {

    @NotBlank(message = "請輸入密碼以確認身份")
    private String password;

    // 對應資料庫的 reason_category
    // 建議加上驗證,確保前端傳入的分類是有效的
    @NotBlank(message = "請選擇刪除原因")
    private String reasonCategory;

    // 對應資料庫的 detail (選填)
    @Size(max = 1000, message = "補充說明不能超過 1000 字")
    private String detail;
}