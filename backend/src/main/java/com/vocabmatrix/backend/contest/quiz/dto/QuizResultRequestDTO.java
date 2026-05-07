// src/main/java/com/vocabmatrix/backend/contest/quiz/dto/QuizResultRequestDTO.java

package com.vocabmatrix.backend.contest.quiz.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuizResultRequestDTO {

    // 答題分類
    private String category;

    // 完成時間（秒）— 分數後端自己算，時間前端送來
    private int durationSeconds;

    // 每題的使用者答案，後端拿去跟 Redis 的答案對照
    private List<UserAnswerDTO> answers;

    @Data
    public static class UserAnswerDTO {

        // 對應 word_definitions.id，後端用來從 Redis 找正確答案
        private Long definitionId;

        // 使用者第一次輸入的答案
        private String firstAttempt;

        // 使用者重試的答案（沒有重試就是 null）
        private String secondAttempt;
    }
}