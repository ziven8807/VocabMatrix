// src/main/java/com/vocabmatrix/backend/contest/quiz/entity/QuizResult.java

package com.vocabmatrix.backend.contest.quiz.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;

@Entity
@Table(name = "quiz_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 答題的使用者
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // 答題的分類（例如 General、Education）
    @Column(nullable = false, length = 100)
    private String category;

    // 答對題數
    @Column(name = "correct_count", nullable = false)
    private int correctCount;

    // 答錯題數（兩次都答錯才算錯）
    @Column(name = "wrong_count", nullable = false)
    private int wrongCount;

    // 總題數，預設 10
    @Column(name = "total_questions", nullable = false)
    private int totalQuestions;

    // 完成時間（秒），同分時用來排名
    @Column(name = "duration_seconds", nullable = false)
    private int durationSeconds;

    // 答錯的單字列表
    // 格式：[{"wordId": 42, "word": "curriculum"}]
    // wordId 方便之後做錯題複習，word 方便直接顯示不用再查一次
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "wrong_words", columnDefinition = "jsonb")
    private String wrongWords;

    // 完成時間戳
    @CreationTimestamp
    @Column(name = "completed_at", updatable = false)
    private OffsetDateTime completedAt;
}