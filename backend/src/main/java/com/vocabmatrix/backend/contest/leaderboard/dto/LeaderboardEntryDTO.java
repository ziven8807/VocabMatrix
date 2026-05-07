// src/main/java/com/vocabmatrix/backend/contest/leaderboard/dto/LeaderboardEntryDTO.java

package com.vocabmatrix.backend.contest.leaderboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDTO {
    private int rank;               // 名次
    private Long userId;            // 使用者 ID
    private String username;        // 使用者名稱
    private String nickname;        // 暱稱
    private String avatarUrl;       // 頭像
    private int correctCount;       // 答對題數
    private int durationSeconds;    // 完成時間（秒），同分時排序用
    private String completedAt;     // 完成時間
}