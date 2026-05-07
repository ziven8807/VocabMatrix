// src/main/java/com/vocabmatrix/backend/notebook/repository/NotebookRepository.java

package com.vocabmatrix.backend.notebook.repository;

import com.vocabmatrix.backend.notebook.entity.Notebook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotebookRepository extends JpaRepository<Notebook, Long> {

    // 查詢某使用者的所有筆記本
    List<Notebook> findByUserIdOrderByCreatedAtDesc(Long userId);

    // 查詢某使用者的特定筆記本
    Optional<Notebook> findByIdAndUserId(Long id, Long userId);

    // 檢查筆記本是否屬於某使用者
    boolean existsByIdAndUserId(Long id, Long userId);
}