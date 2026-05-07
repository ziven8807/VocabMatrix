// src/main/java/com/vocabmatrix/backend/contest/quiz/dto/QuizCheckResponseDTO.java

package com.vocabmatrix.backend.contest.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QuizCheckResponseDTO {
    private boolean correct;
}