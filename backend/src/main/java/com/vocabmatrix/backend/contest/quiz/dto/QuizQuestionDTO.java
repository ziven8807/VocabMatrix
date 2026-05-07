// src/main/java/com/vocabmatrix/backend/contest/quiz/dto/QuizQuestionDTO.java

package com.vocabmatrix.backend.contest.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizQuestionDTO {

    // 題目 ID（對應 word_definitions.id）
    private Long definitionId;

    // 題目：英文定義
    private String definitionEn;

    // 中文定義（輔助提示）
    private String definitionCn;

    // 詞性提示
    private String pos;

    // 所屬分類（答錯時記錄用）
    private String category;

    // answer 存在 Redis，前端拿不到正確答案(防止作弊)
}