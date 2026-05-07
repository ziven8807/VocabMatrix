// src/main/java/com/vocabmatrix/backend/contest/quiz/dto/QuizCheckRequestDTO.java

package com.vocabmatrix.backend.contest.quiz.dto;

import lombok.Data;

@Data
public class QuizCheckRequestDTO {
    private Long definitionId;
    private String answer;
}