// src/test/java/com/vocabmatrix/backend/auth/mail/service/RegistrationEmailServiceTest.java

package com.vocabmatrix.backend.auth.mail.service;

import com.vocabmatrix.backend.auth.entity.mail.RegistrationEmailToken;
import com.vocabmatrix.backend.auth.repository.mail.RegistrationEmailTokenRepository;
import com.vocabmatrix.backend.auth.service.mail.RegistrationEmailService;
import com.vocabmatrix.backend.common.mail.MailService;
import com.vocabmatrix.backend.user.entity.User;
import com.vocabmatrix.backend.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.Optional;

import static com.vocabmatrix.backend.user.entity.User.UserStatus.ACTIVE;
import static com.vocabmatrix.backend.user.entity.User.UserStatus.INACTIVE;
import static com.vocabmatrix.backend.common.util.TokenUtils.hashToken;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistrationEmailServiceTest {

    @Mock
    private RegistrationEmailTokenRepository tokenRepository;

    @Mock
    private MailService mailService;

    @Mock
    private UserService userService;

    @InjectMocks
    private RegistrationEmailService registrationEmailService;

    private static final String RAW_TOKEN = "test-raw-token";

    private User mockUser;
    private RegistrationEmailToken mockToken;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .status(INACTIVE)
                .build();

        mockToken = RegistrationEmailToken.builder()
                .user(mockUser)
                .token(RAW_TOKEN)
                .tokenHash(hashToken(RAW_TOKEN))
                .expiryDate(OffsetDateTime.now().plusHours(1))
                .build();  // ← 拿掉 .isUsed(false)
    }

    // 測試情境 1：正常驗證流程，帳號成功啟用
    @Test
    void verifyAccount_success() {
        when(tokenRepository.findByTokenHash(hashToken(RAW_TOKEN))).thenReturn(Optional.of(mockToken));

        String result = registrationEmailService.verifyAccount(RAW_TOKEN);

        assertThat(result).contains("successfully activated");
        verify(userService).activateUser(any());
        verify(tokenRepository).delete(mockToken);
    }

    // 測試情境 2：Token 不存在，應拋出例外
    @Test
    void verifyAccount_tokenNotFound_throwsException() {
        when(tokenRepository.findByTokenHash(hashToken(RAW_TOKEN))).thenReturn(Optional.empty());

        assertThatThrownBy(() -> registrationEmailService.verifyAccount(RAW_TOKEN))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid verification link");
    }

    // 測試情境 3：Token 已過期，應拋出例外
    @Test
    void verifyAccount_tokenExpired_throwsException() {
        mockToken.setExpiryDate(OffsetDateTime.now().minusHours(1));
        when(tokenRepository.findByTokenHash(hashToken(RAW_TOKEN))).thenReturn(Optional.of(mockToken));

        assertThatThrownBy(() -> registrationEmailService.verifyAccount(RAW_TOKEN))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("expired");

        verify(tokenRepository).delete(mockToken);
    }

    // 測試情境 4：帳號已啟用，應回傳已啟用訊息
    @Test
    void verifyAccount_alreadyActivated_returnsMessage() {
        mockUser.setStatus(ACTIVE);
        when(tokenRepository.findByTokenHash(hashToken(RAW_TOKEN))).thenReturn(Optional.of(mockToken));

        String result = registrationEmailService.verifyAccount(RAW_TOKEN);

        assertThat(result).contains("already activated");
        verify(userService, never()).activateUser(any());
        verify(tokenRepository).delete(mockToken);
    }

}