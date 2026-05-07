// src/main/java/com/vocabmatrix/backend/vocabulary/repository/WordDefinitionRepository.java

package com.vocabmatrix.backend.vocabulary.repository;

import com.vocabmatrix.backend.vocabulary.entity.WordDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WordDefinitionRepository extends JpaRepository<WordDefinition, Long> {

    // 1. 查某單字的所有釋義，按詞性排序（詳細頁用，不需要分頁）
    List<WordDefinition> findByWordIdOrderByPosAsc(Long wordId);

    // 2. 主題篩選（無限捲動，cursor-based 分頁）
    @Query(value = "SELECT * FROM word_definitions WHERE :category = ANY(categories) AND id > :cursor ORDER BY id ASC LIMIT :size",
            nativeQuery = true)
    List<WordDefinition> findByCategory(
            @Param("category") String category,
            @Param("cursor") Long cursor,
            @Param("size") int size
    );

    // 3. 考試標籤篩選（無限捲動，cursor-based 分頁）
    @Query(value = "SELECT * FROM word_definitions WHERE :examTag = ANY(exam_tags) AND id > :cursor ORDER BY id ASC LIMIT :size",
            nativeQuery = true)
    List<WordDefinition> findByExamTag(
            @Param("examTag") String examTag,
            @Param("cursor") Long cursor,
            @Param("size") int size
    );

    // 4. 難度篩選（無限捲動，cursor-based 分頁）
    @Query(value = "SELECT * FROM word_definitions WHERE difficulty_level = :difficultyLevel AND id > :cursor ORDER BY id ASC LIMIT :size",
            nativeQuery = true)
    List<WordDefinition> findByDifficultyLevel(
            @Param("difficultyLevel") String difficultyLevel,
            @Param("cursor") Long cursor,
            @Param("size") int size
    );

    // 5. 撈所有 id（給 QuizService 隨機抽題用）
    @Query("SELECT d.id FROM WordDefinition d")
    List<Long> findAllIds();

}