// src/main/java/com/vocabmatrix/backend/contest/leaderboard/service/LeaderboardService.java

package com.vocabmatrix.backend.contest.leaderboard.service;

import com.vocabmatrix.backend.contest.leaderboard.dto.LeaderboardEntryDTO;
import com.vocabmatrix.backend.contest.quiz.repository.QuizResultRepository;
import com.vocabmatrix.backend.user.repository.UserRepository;
import com.vocabmatrix.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.OffsetDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final QuizResultRepository quizResultRepository;
    private final UserRepository userRepository;

    // 取得本週排行榜（前 20 名），不區分 category，所有分類混排
    // 每人只取本週最高分的那筆（同分取完成時間最短的）
    public List<LeaderboardEntryDTO> getWeeklyLeaderboard() {

        // 計算本週一 00:00 的時間點，作為查詢起始時間
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime weekStart = now
                .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .withHour(0).withMinute(0).withSecond(0).withNano(0);

        // 從 DB 撈本週所有使用者的最佳成績
        // 回傳格式：[userId, correctCount, minDurationSeconds, completedAt]
        List<Object[]> rows = quizResultRepository.findWeeklyTop(weekStart);

        // Step 1: 先把所有 userId 收集起來
        // 避免在迴圈裡逐一查詢，防止 N+1 問題
        List<Long> userIds = rows.stream()
                .map(row -> ((Number) row[0]).longValue())
                .collect(Collectors.toList());

        // Step 2: 一次查所有使用者，只打一次 DB
        // 用 Map 儲存結果，之後用 userId 取值時是 O(1)
        Map<Long, User> userMap = userRepository.findAllById(userIds)
                .stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        List<LeaderboardEntryDTO> entries = new ArrayList<>();
        int rank = 1;

        // Step 3: 迴圈裡從 Map 取使用者資料，不再打 DB
        // 原本每筆 row 都查一次 DB（N 次），現在改為從 Map 取（0 次）
        for (Object[] row : rows) {
            Long userId = ((Number) row[0]).longValue();
            int correctCount = ((Number) row[1]).intValue();
            int durationSeconds = ((Number) row[2]).intValue();
            String completedAt = row[3].toString();

            // 從 Map 取使用者資訊，找不到就跳過
            User user = userMap.get(userId);
            if (user == null) continue;

            entries.add(LeaderboardEntryDTO.builder()
                    .rank(rank++)
                    .userId(userId)
                    .username(user.getUsername())
                    .nickname(user.getNickname())
                    .avatarUrl(user.getAvatarUrl())
                    .correctCount(correctCount)
                    .durationSeconds(durationSeconds)
                    .completedAt(completedAt)
                    .build());

            // 只顯示前 20 名
            if (entries.size() >= 20) break;
        }

        return entries;
    }
}