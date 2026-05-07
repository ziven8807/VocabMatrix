// src/main/java/com/vocabmatrix/backend/vocabulary/repository/WordRepository.java

package com.vocabmatrix.backend.vocabulary.repository;

import com.vocabmatrix.backend.vocabulary.entity.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WordRepository extends JpaRepository<Word, Long> {

    // 1. 查單字（精確）
    Optional<Word> findByWord(String word);

    // 2. 模糊搜尋（用於自動完成）
    @Query("SELECT w FROM Word w WHERE LOWER(w.word) LIKE LOWER(CONCAT(:prefix, '%'))")
    List<Word> searchByWordPrefix(@Param("prefix") String prefix);
}