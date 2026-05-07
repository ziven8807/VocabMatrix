// src/main/java/com/vocabmatrix/backend/contest/quiz/controller/QuizController.java

package com.vocabmatrix.backend.contest.quiz.controller;

import java.time.OffsetDateTime;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.vocabmatrix.backend.contest.quiz.dto.*;
import com.vocabmatrix.backend.contest.quiz.entity.QuizResult;
import com.vocabmatrix.backend.contest.quiz.service.QuizService;
import com.vocabmatrix.backend.security.AuthenticatedUser;

@RestController
@RequestMapping("/api/contest/quiz")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    // 取得隨機題目，不分 category，從所有單字中混抽
    // GET /api/contest/quiz/questions?size=10
    @GetMapping("/questions")
    public ResponseEntity<List<QuizQuestionDTO>> getQuestions(
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal AuthenticatedUser user
    ) throws JsonProcessingException {
        return ResponseEntity.ok(quizService.getQuestions(size, user.getId()));
    }

    // 即時驗證單題答案，不透露正確答案
    // POST /api/contest/quiz/check
    @PostMapping("/check")
    public ResponseEntity<QuizCheckResponseDTO> checkAnswer(
            @RequestBody QuizCheckRequestDTO request,
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        return ResponseEntity.ok(quizService.checkAnswer(
                user.getId(),
                request.getDefinitionId(),
                request.getAnswer()
        ));
    }

    // 送出完整答題結果，後端驗證並儲存，category 固定為 Mixed
    // POST /api/contest/quiz/submit
    @PostMapping("/submit")
    public ResponseEntity<QuizResultResponseDTO> submitResult(
            @RequestBody QuizResultRequestDTO request,
            @AuthenticationPrincipal AuthenticatedUser user
    ) throws JsonProcessingException {
        return ResponseEntity.ok(quizService.saveResult(user.getId(), request));
    }

    // 查詢歷史紀錄（無限捲動，cursor-based 分頁）
    // 第一次不傳 cursor，預設為現在時間
    // GET /api/contest/quiz/history?size=10
    // GET /api/contest/quiz/history?cursor=2026-04-01T12:00:00Z&size=10
    @GetMapping("/history")
    public ResponseEntity<List<QuizResult>> getHistory(
            @RequestParam(required = false) OffsetDateTime cursor,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        // cursor 沒傳的話預設現在時間，撈最新的紀錄
        OffsetDateTime effectiveCursor = cursor != null ? cursor : OffsetDateTime.now();
        return ResponseEntity.ok(quizService.getUserHistory(user.getId(), effectiveCursor, size));
    }
}