// src/main/java/com/vocabmatrix/backend/common/dto/ErrorResponseDTO.java

package com.vocabmatrix.backend.common.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

/**
 * 統一錯誤響應 DTO (Error Response Data Transfer Object)
 * 用於在 API 異常時，向客戶端返回標準化、結構化的錯誤資訊。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponseDTO {

    /**
     * HTTP 狀態碼 (例如 401, 400, 500)
     */
    private int status;

    /**
     * HTTP 狀態碼的字串描述 (例如 "Unauthorized", "Bad Request", "Internal Server Error")
     */
    private String error;

    /**
     * 對使用者友好的錯誤訊息，描述發生了什麼問題。
     */
    private String message;

    /**
     * 錯誤發生的時間戳記，使用 ISO 8601 格式。
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    /**
     * 錯誤發生時的請求 URI 路徑。
     */
    private String path;

    /**
     * 靜態工廠方法：根據 HttpStatus 創建基本的 ErrorResponseDTO 實例。
     * @param status HTTP 狀態
     * @param message 錯誤訊息
     * @param path 請求路徑
     * @return ErrorResponseDTO 實例
     */
    public static ErrorResponseDTO create(HttpStatus status, String message, String path) {
        return ErrorResponseDTO.builder()
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .timestamp(LocalDateTime.now())
                .path(path)
                .build();
    }
}