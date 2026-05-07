// src/main/java/com/vocabmatrix/backend/notebook/repository/NotebookEntryRepository.java

package com.vocabmatrix.backend.notebook.repository;

import com.vocabmatrix.backend.notebook.entity.NotebookEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotebookEntryRepository extends JpaRepository<NotebookEntry, Long> {

    // 查詢筆記本內的所有單字（無限捲動，cursor-based 分頁）
    @Query("SELECT e FROM NotebookEntry e JOIN FETCH e.word WHERE e.notebook.id = :notebookId AND e.id > :cursor ORDER BY e.id ASC")
    List<NotebookEntry> findByNotebookId(
            @Param("notebookId") Long notebookId,
            @Param("cursor") Long cursor,
            org.springframework.data.domain.Pageable pageable
    );

    // 查詢筆記本內的重點單字（無限捲動，cursor-based 分頁）
    @Query("SELECT e FROM NotebookEntry e JOIN FETCH e.word WHERE e.notebook.id = :notebookId AND e.isFavorite = true AND e.id > :cursor ORDER BY e.id ASC")
    List<NotebookEntry> findFavoritesByNotebookId(
            @Param("notebookId") Long notebookId,
            @Param("cursor") Long cursor,
            org.springframework.data.domain.Pageable pageable
    );

    // 按熟悉度篩選（無限捲動，cursor-based 分頁）
    @Query("SELECT e FROM NotebookEntry e JOIN FETCH e.word WHERE e.notebook.id = :notebookId AND e.masteryLevel = :level AND e.id > :cursor ORDER BY e.id ASC")
    List<NotebookEntry> findByNotebookIdAndMasteryLevel(
            @Param("notebookId") Long notebookId,
            @Param("level") Integer level,
            @Param("cursor") Long cursor,
            org.springframework.data.domain.Pageable pageable
    );

    // 檢查單字是否已在筆記本中
    boolean existsByNotebookIdAndWordId(Long notebookId, Long wordId);

    // 查詢特定筆記項目
    Optional<NotebookEntry> findByNotebookIdAndWordId(Long notebookId, Long wordId);

    // 統計筆記本內的單字數量
    long countByNotebookId(Long notebookId);
}