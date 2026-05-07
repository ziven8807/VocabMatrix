// src/main/java/com/vocabmatrix/backend/user/event/AccountDeletionRequestedEvent.java
package com.vocabmatrix.backend.user.event;

import com.vocabmatrix.backend.user.entity.User;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

/**
 * 使用者申請刪除帳號事件
 */
@Getter
public class AccountDeletionRequestedEvent extends ApplicationEvent {
    private final User user;

    public AccountDeletionRequestedEvent(Object source, User user) {
        super(source);
        this.user = user;
    }
}