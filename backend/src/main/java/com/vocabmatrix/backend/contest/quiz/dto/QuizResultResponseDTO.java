// src/main/java/com/vocabmatrix/backend/contest/quiz/dto/QuizResultResponseDTO.java

package com.vocabmatrix.backend.contest.quiz.dto;

import com.vocabmatrix.backend.contest.quiz.entity.QuizResult;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizResultResponseDTO {

    private Long id;
    private String category;
    private int correctCount;
    private int wrongCount;
    private int totalQuestions;
    private int durationSeconds;
    private String wrongWords;
    private OffsetDateTime completedAt;
    private Integer rank;

    // 每題的詳細結果，結果畫面用來顯示正確答案
    private List<QuestionReviewDTO> review;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionReviewDTO {
        private Long definitionId;
        private String definitionEn;   // 英文定義（題目）
        private String correctAnswer;  // 正確答案
        private String firstAttempt;   // 第一次輸入
        private String secondAttempt;  // 第二次輸入（沒有則 null）
        private boolean correct;       // 最終是否答對
    }

    public static QuizResultResponseDTO from(QuizResult result) {
        return QuizResultResponseDTO.builder()
                .id(result.getId())
                .category(result.getCategory())
                .correctCount(result.getCorrectCount())
                .wrongCount(result.getWrongCount())
                .totalQuestions(result.getTotalQuestions())
                .durationSeconds(result.getDurationSeconds())
                .wrongWords(result.getWrongWords())
                .completedAt(result.getCompletedAt())
                .build();
    }
}