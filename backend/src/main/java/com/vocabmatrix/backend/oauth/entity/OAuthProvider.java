package com.vocabmatrix.backend.oauth.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "oauth_providers")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 保持 JPA 要求的無參數建構子，但設為 protected 增加安全性
@AllArgsConstructor
@Builder
public class OAuthProvider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * provider 名稱，例如：google / facebook
     */
    @Column(nullable = false, unique = true, length = 50)
    private String name;

    // 如果你只需要傳入 name 的簡單建構子
    public OAuthProvider(String name) {
        this.name = name;
    }
}