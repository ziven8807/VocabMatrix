// src/main/java/com/vocabmatrix/backend/common/exception/GlobalExceptionHandler.java

package com.vocabmatrix.backend.common.exception;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.vocabmatrix.backend.common.dto.ErrorResponseDTO;
import com.vocabmatrix.backend.auth.exception.*;
import com.vocabmatrix.backend.notebook.exception.*;
import com.vocabmatrix.backend.user.exception.*;
import com.vocabmatrix.backend.oauth.exception.*;

/**
 * 全域例外處理器
 * 統一處理應用程式中拋出的各種例外,並返回標準化的錯誤回應
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // =========================================================================
    //   使用者相關例外
    // =========================================================================

    /**
     * 處理 UserAlreadyExistsException,返回 409 Conflict
     * 當嘗試註冊已存在的使用者名稱或電子郵件時觸發
     */
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDTO> handleUserAlreadyExists(
            UserAlreadyExistsException ex,
            HttpServletRequest request) {
        ErrorResponseDTO error = ErrorResponseDTO.create(
                HttpStatus.CONFLICT,
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    /**
     * 處理 UserNotFoundException,返回 404 Not Found
     * 當查詢的使用者不存在時觸發
     */
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleUserNotFound(
            UserNotFoundException ex,
            HttpServletRequest request) {
        ErrorResponseDTO error = ErrorResponseDTO.create(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * 處理 ThirdPartyAccountException,返回 400 Bad Request
     * 當純第三方登入使用者嘗試執行需要密碼的操作時觸發
     */
    @ExceptionHandler(ThirdPartyAccountException.class)
    public ResponseEntity<ErrorResponseDTO> handleThirdPartyAccount(
            ThirdPartyAccountException ex,
            HttpServletRequest request) {
        ErrorResponseDTO error = ErrorResponseDTO.create(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * 處理 LastIdentityException, 返回 400 Bad Request
     * 當使用者嘗試解除唯一的登入方式時觸發 (防止孤兒帳號)
     */
    @ExceptionHandler(LastIdentityException.class)
    public ResponseEntity<ErrorResponseDTO> handleLastIdentity(
            LastIdentityException ex,
            HttpServletRequest request) {
        ErrorResponseDTO error = ErrorResponseDTO.create(
                HttpStatus.BAD_REQUEST, // 使用 400 或 403 均可，建議 400 代表請求不合法
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    // =========================================================================
    //   OAuth 相關例外
    // =========================================================================

    /**
     * 處理 UnsupportedOAuthProviderException,返回 400 Bad Request
     * 當前端請求不支援的 OAuth 服務商時觸發
     */
    @ExceptionHandler(UnsupportedOAuthProviderException.class)
    public ResponseEntity<ErrorResponseDTO> handleUnsupportedOAuthProvider(
            UnsupportedOAuthProviderException ex,
            HttpServletRequest request) {
        ErrorResponseDTO error = ErrorResponseDTO.create(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * 處理 OAuthAuthenticationException,返回 401 Unauthorized
     * 當與第三方服務商進行認證失敗時觸發
     */
    @ExceptionHandler(OAuthAuthenticationException.class)
    public ResponseEntity<ErrorResponseDTO> handleOAuthAuthentication(
            OAuthAuthenticationException ex,
            HttpServletRequest request) {
        ErrorResponseDTO error = ErrorResponseDTO.create(
                HttpStatus.UNAUTHORIZED,
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    // =========================================================================
    //   認證相關例外 (本地)
    // =========================================================================

    /**
     * 處理 BadCredentialsException,返回 401 Unauthorized
     * 當使用者提供的帳號或密碼錯誤時觸發
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponseDTO> handleBadCredentials(
            BadCredentialsException ex,
            HttpServletRequest request) {
        ErrorResponseDTO error = ErrorResponseDTO.create(
                HttpStatus.UNAUTHORIZED,
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    /**
     * 處理 AccountLockedException,返回 403 Forbidden
     * 當帳號因多次登入失敗而被鎖定時觸發
     */
    @ExceptionHandler(AccountLockedException.class)
    public ResponseEntity<ErrorResponseDTO> handleAccountLocked(
            AccountLockedException ex,
            HttpServletRequest request) {

        long remainingSeconds = ex.getLockDurationSeconds();

        ErrorResponseDTO error = ErrorResponseDTO.create(
                HttpStatus.FORBIDDEN,
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .header("Retry-After", String.valueOf(remainingSeconds))
                .body(error);
    }

    /**
     * 處理 RateLimitExceededException,返回 429 Too Many Requests
     */
    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<ErrorResponseDTO> handleRateLimitExceeded(
            RateLimitExceededException ex,
            HttpServletRequest request) {
        ErrorResponseDTO error = ErrorResponseDTO.create(
                HttpStatus.TOO_MANY_REQUESTS,
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity
                .status(HttpStatus.TOO_MANY_REQUESTS)
                .header("Retry-After", "60")
                .body(error);
    }

    // =========================================================================
    //   Token 相關例外
    // =========================================================================

    /**
     * 處理 TokenExpiredException,返回 410 Gone
     */
    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ErrorResponseDTO> handleTokenExpired(
            TokenExpiredException ex,
            HttpServletRequest request) {
        ErrorResponseDTO error = ErrorResponseDTO.create(
                HttpStatus.GONE,
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.GONE).body(error);
    }

    /**
     * 處理 InvalidTokenException,返回 400 Bad Request
     */
    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ErrorResponseDTO> handleInvalidToken(
            InvalidTokenException ex,
            HttpServletRequest request) {
        ErrorResponseDTO error = ErrorResponseDTO.create(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    // =========================================================================
    //   密碼相關例外
    // =========================================================================

    /**
     * 處理 PasswordMismatchException,返回 400 Bad Request
     */
    @ExceptionHandler(PasswordMismatchException.class)
    public ResponseEntity<ErrorResponseDTO> handlePasswordMismatch(
            PasswordMismatchException ex,
            HttpServletRequest request) {
        ErrorResponseDTO error = ErrorResponseDTO.create(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * 處理 PasswordReuseException,返回 400 Bad Request
     */
    @ExceptionHandler(PasswordReuseException.class)
    public ResponseEntity<ErrorResponseDTO> handlePasswordReuse(
            PasswordReuseException ex,
            HttpServletRequest request) {
        ErrorResponseDTO error = ErrorResponseDTO.create(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    // =========================================================================
    //   筆記本相關例外
    // =========================================================================

    /**
     * 處理 VocabularyAlreadyExistsException,返回 409 Conflict
     * 當嘗試將已存在於筆記本中的單字再次加入時觸發
     */
    @ExceptionHandler(VocabularyAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDTO> handleVocabularyAlreadyExists(
            VocabularyAlreadyExistsException ex,
            HttpServletRequest request) {
        ErrorResponseDTO error = ErrorResponseDTO.create(
                HttpStatus.CONFLICT,
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    // =========================================================================
    //   通用例外處理
    // =========================================================================

    /**
     * 處理所有未被特定處理器捕獲的例外,返回 500 Internal Server Error
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGeneralException(
            Exception ex,
            HttpServletRequest request) {
        // TODO: 記錄完整錯誤到日誌系統 (log.error("Unhandled exception", ex))
        ErrorResponseDTO error = ErrorResponseDTO.create(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An internal error occurred.",
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}