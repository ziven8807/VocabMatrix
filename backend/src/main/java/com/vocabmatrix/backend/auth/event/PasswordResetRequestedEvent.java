// src/main/java/com/vocabmatrix/backend/auth/event/PasswordResetRequestedEvent.java

package com.vocabmatrix.backend.auth.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import com.vocabmatrix.backend.user.entity.User;

/**
 * 使用者申請重置密碼完成事件
 */
@Getter
public class PasswordResetRequestedEvent extends ApplicationEvent {
    private final User user;

    public PasswordResetRequestedEvent(Object source, User user) {
        super(source);
        this.user = user;
    }
}