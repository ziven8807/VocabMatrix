// src/main/java/com/vocabmatrix/backend/contest/leaderboard/service/LeaderboardService.java

package com.vocabmatrix.backend.contest.leaderboard.service;

import java.time.DayOfWeek;
import java.time.OffsetDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.vocabmatrix.backend.contest.leaderboard.dto.LeaderboardEntryDTO;
import com.vocabmatrix.backend.contest.quiz.repository.QuizResultRepository;
import com.vocabmatrix.backend.user.repository.UserRepository;
import com.vocabmatrix.backend.user.entity.User;

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

        List<LeaderboardEntryDTO> entries = new ArrayList<>();
        int rank = 1;

        for (Object[] row : rows) {
            Long userId = ((Number) row[0]).longValue();
            int correctCount = ((Number) row[1]).intValue();
            int durationSeconds = ((Number) row[2]).intValue();
            String completedAt = row[3].toString();

            // 查使用者資訊（名稱、頭像等），找不到就跳過
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) continue;
            User user = userOpt.get();

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