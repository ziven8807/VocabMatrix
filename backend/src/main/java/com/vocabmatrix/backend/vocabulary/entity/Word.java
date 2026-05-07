// src/main/java/com/vocabmatrix/backend/vocabulary/entity/Word.java

package com.vocabmatrix.backend.vocabulary.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "words")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100, unique = true)
    private String word;  // 單字

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    // 存入前自動轉小寫、去空白，避免 "Run" 和 "run" 變成兩筆
    @PrePersist
    @PreUpdate
    protected void normalizeWord() {
        if (word != null) {
            word = word.toLowerCase().trim();
        }
    }
}