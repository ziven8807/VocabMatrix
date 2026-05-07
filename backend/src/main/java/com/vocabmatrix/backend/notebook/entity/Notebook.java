// src/main/java/com/vocabmatrix/backend/notebook/entity/Notebook.java

package com.vocabmatrix.backend.notebook.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "notebooks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notebook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 所屬使用者，刪除使用者時連帶刪除筆記本
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // 筆記本名稱，例如：托福單字、商業英文
    @Column(nullable = false, length = 100)
    private String name;

    // 筆記本描述（選填）
    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}