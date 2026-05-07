// src/main/java/com/vocabmatrix/backend/vocabulary/entity/WordDefinition.java

package com.vocabmatrix.backend.vocabulary.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;

@Entity
@Table(name = "word_definitions",
        uniqueConstraints = @UniqueConstraint(columnNames = {"word_id", "pos", "definition_en"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WordDefinition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @JsonIgnoreProperties 防止 Hibernate lazy loading proxy 序列化失敗：
    // 當 Jackson 遇到 ByteBuddyInterceptor (Hibernate proxy) 時會爆錯，
    // 忽略這兩個內部屬性就能正常序列化
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "word_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "definitions"})
    private Word word;  // 對應單字

    @Column(name = "definition_en", columnDefinition = "TEXT", nullable = false)
    private String definitionEn;  // 定義

    @Column(name = "definition_cn", columnDefinition = "TEXT")
    private String definitionCn;  // 定義的中文翻譯

    @Column(length = 50, nullable = false)
    private String pos;  // 詞性

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "example_sentences", columnDefinition = "jsonb")
    private String exampleSentences;  // 例句（JSON 字串）

    @Column(columnDefinition = "text[]")
    private String[] categories;  // 主題分類

    @Column(name = "exam_tags", columnDefinition = "text[]")
    private String[] examTags;  // 考試標籤

    @Column(name = "difficulty_level", length = 20)
    private String difficultyLevel;  // 難度

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}