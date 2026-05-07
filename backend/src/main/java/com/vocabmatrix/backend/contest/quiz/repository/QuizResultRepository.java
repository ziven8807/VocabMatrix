// src/main/java/com/vocabmatrix/backend/contest/quiz/repository/QuizResultRepository.java

package com.vocabmatrix.backend.contest.quiz.repository;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vocabmatrix.backend.contest.quiz.entity.QuizResult;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {

    // 查詢某使用者的歷史紀錄（無限捲動，cursor-based 分頁）
    // cursor 是上一批最後一筆的 completedAt，往前撈更早的紀錄
    @Query("SELECT r FROM QuizResult r WHERE r.userId = :userId AND r.completedAt < :cursor ORDER BY r.completedAt DESC")
    List<QuizResult> findByUserIdOrderByCompletedAtDesc(
            @Param("userId") Long userId,
            @Param("cursor") OffsetDateTime cursor,
            org.springframework.data.domain.Pageable pageable
    );

    // 查本週所有分類每人最高分（同分取時間最短）
    @Query("""
        SELECT r.userId, r.correctCount, MIN(r.durationSeconds), MAX(r.completedAt)
        FROM QuizResult r
        WHERE r.completedAt >= :weekStart
        GROUP BY r.userId, r.correctCount
        HAVING r.correctCount = (
            SELECT MAX(r2.correctCount)
            FROM QuizResult r2
            WHERE r2.userId = r.userId
              AND r2.completedAt >= :weekStart
        )
        ORDER BY r.correctCount DESC, MIN(r.durationSeconds) ASC
    """)
    List<Object[]> findWeeklyTop(@Param("weekStart") OffsetDateTime weekStart);
}