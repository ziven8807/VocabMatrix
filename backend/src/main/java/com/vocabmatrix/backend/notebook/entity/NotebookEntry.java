// src/main/java/com/vocabmatrix/backend/notebook/entity/NotebookEntry.java

package com.vocabmatrix.backend.notebook.entity;

import java.time.OffsetDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.vocabmatrix.backend.vocabulary.entity.Word;

@Entity
@Table(name = "notebook_entries",
        uniqueConstraints = @UniqueConstraint(columnNames = {"notebook_id", "word_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotebookEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 所屬筆記本，刪除筆記本時連帶刪除所有 entry
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notebook_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Notebook notebook;

    // 收藏的單字，指向整個字（不是某個義項）
    // 前端點進去再用 word_id 查 word_definitions 撈所有義項
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "word_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Word word;

    // 使用者自己寫的備註（選填）
    @Column(name = "user_note", columnDefinition = "TEXT")
    private String userNote;

    // 間隔重複學習熟練度（0-5）
    // 0 = 完全不認識 / 1 = 有印象但不確定 / 2 = 想得起來但要思考
    // 3 = 能正確回憶 / 4 = 熟練 / 5 = 精通／自動化反應
    @Column(name = "mastery_level")
    private Integer masteryLevel = 0;

    // 是否標記為最愛
    @Column(name = "is_favorite")
    private Boolean isFavorite = false;

    @CreationTimestamp
    @Column(name = "added_at", updatable = false)
    private OffsetDateTime addedAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}