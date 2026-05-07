// src/main/java/com/vocabmatrix/backend/contest/leaderboard/controller/LeaderboardController.java

package com.vocabmatrix.backend.contest.leaderboard.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.vocabmatrix.backend.contest.leaderboard.dto.LeaderboardEntryDTO;
import com.vocabmatrix.backend.contest.leaderboard.service.LeaderboardService;

@RestController
@RequestMapping("/api/contest/leaderboard")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    // 取得本週排行榜
    // 公開端點，不需要登入（SecurityConfig 已設定 permitAll）
    // GET /api/contest/leaderboard/weekly
    @GetMapping("/weekly")
    public ResponseEntity<List<LeaderboardEntryDTO>> getWeeklyLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getWeeklyLeaderboard());
    }
}