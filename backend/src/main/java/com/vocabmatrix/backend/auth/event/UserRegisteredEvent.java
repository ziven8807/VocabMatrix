// src/main/java/com/vocabmatrix/backend/auth/event/UserRegisteredEvent.java

package com.vocabmatrix.backend.auth.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import com.vocabmatrix.backend.user.entity.User;

/**
 * 使用者註冊完成事件
 */
@Getter
public class UserRegisteredEvent extends ApplicationEvent {
    private final User user;

    public UserRegisteredEvent(Object source, User user) {
        super(source);
        this.user = user;
    }
}