// src/main/java/com/vocabmatrix/backend/notebook/service/NotebookService.java

package com.vocabmatrix.backend.notebook.service;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vocabmatrix.backend.notebook.entity.Notebook;
import com.vocabmatrix.backend.notebook.entity.NotebookEntry;
import com.vocabmatrix.backend.notebook.exception.VocabularyAlreadyExistsException;
import com.vocabmatrix.backend.notebook.repository.NotebookEntryRepository;
import com.vocabmatrix.backend.notebook.repository.NotebookRepository;
import com.vocabmatrix.backend.vocabulary.entity.Word;
import com.vocabmatrix.backend.vocabulary.repository.WordRepository;

@Service
@RequiredArgsConstructor
public class NotebookService {

    private final NotebookRepository notebookRepository;
    private final NotebookEntryRepository entryRepository;
    private final WordRepository wordRepository;  // 改成 WordRepository

    // ========== 筆記本管理 ==========

    // 建立筆記本
    @Transactional
    public Notebook createNotebook(Long userId, String name, String description) {
        Notebook notebook = new Notebook();
        notebook.setUserId(userId);
        notebook.setName(name);
        notebook.setDescription(description);
        return notebookRepository.save(notebook);
    }

    // 查詢使用者的所有筆記本
    public List<Notebook> getUserNotebooks(Long userId) {
        return notebookRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // 查詢單一筆記本（含權限檢查）
    public Notebook getNotebook(Long notebookId, Long userId) {
        return notebookRepository.findByIdAndUserId(notebookId, userId)
                .orElseThrow(() -> new RuntimeException("Notebook not found or access denied"));
    }

    // 更新筆記本
    @Transactional
    public Notebook updateNotebook(Long notebookId, Long userId, String name, String description) {
        Notebook notebook = getNotebook(notebookId, userId);
        if (name != null) notebook.setName(name);
        if (description != null) notebook.setDescription(description);
        return notebookRepository.save(notebook);
    }

    // 刪除筆記本
    @Transactional
    public void deleteNotebook(Long notebookId, Long userId) {
        if (!notebookRepository.existsByIdAndUserId(notebookId, userId)) {
            throw new RuntimeException("Notebook not found or access denied");
        }
        notebookRepository.deleteById(notebookId);
    }

    // ========== 筆記項目管理 ==========

    // 加入單字到筆記本
    @Transactional
    public NotebookEntry addWordToNotebook(Long notebookId, Long userId, Long wordId) {
        // 權限檢查
        if (!notebookRepository.existsByIdAndUserId(notebookId, userId)) {
            throw new RuntimeException("Notebook not found or access denied");
        }

        // 檢查單字是否存在
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new RuntimeException("Word not found"));

        // 檢查是否已存在
        if (entryRepository.existsByNotebookIdAndWordId(notebookId, wordId)) {
            throw new VocabularyAlreadyExistsException("Word already exists in this notebook");
        }

        NotebookEntry entry = new NotebookEntry();
        entry.setNotebook(notebookRepository.getReferenceById(notebookId));
        entry.setWord(word);
        return entryRepository.save(entry);
    }

    // 從筆記本移除單字
    @Transactional
    public void removeWordFromNotebook(Long notebookId, Long userId, Long wordId) {
        // 權限檢查
        if (!notebookRepository.existsByIdAndUserId(notebookId, userId)) {
            throw new RuntimeException("Notebook not found or access denied");
        }

        NotebookEntry entry = entryRepository.findByNotebookIdAndWordId(notebookId, wordId)
                .orElseThrow(() -> new RuntimeException("Entry not found"));

        entryRepository.delete(entry);
    }

    // 更新筆記項目（個人筆記、熟悉度、重點標記）
    @Transactional
    public NotebookEntry updateEntry(Long notebookId, Long userId, Long wordId,
                                     String userNote, Integer masteryLevel, Boolean isFavorite) {
        // 權限檢查
        if (!notebookRepository.existsByIdAndUserId(notebookId, userId)) {
            throw new RuntimeException("Notebook not found or access denied");
        }

        NotebookEntry entry = entryRepository.findByNotebookIdAndWordId(notebookId, wordId)
                .orElseThrow(() -> new RuntimeException("Entry not found"));

        if (userNote != null) entry.setUserNote(userNote);
        if (masteryLevel != null) entry.setMasteryLevel(masteryLevel);
        if (isFavorite != null) entry.setIsFavorite(isFavorite);

        return entryRepository.save(entry);
    }

    // 查詢筆記本內的所有單字（無限捲動，cursor-based 分頁）
    public List<NotebookEntry> getNotebookEntries(Long notebookId, Long userId, Long cursor, int size) {
        if (!notebookRepository.existsByIdAndUserId(notebookId, userId)) {
            throw new RuntimeException("Notebook not found or access denied");
        }
        return entryRepository.findByNotebookId(notebookId, cursor, PageRequest.of(0, size));
    }

    // 查詢重點單字（無限捲動，cursor-based 分頁）
    public List<NotebookEntry> getFavoriteEntries(Long notebookId, Long userId, Long cursor, int size) {
        if (!notebookRepository.existsByIdAndUserId(notebookId, userId)) {
            throw new RuntimeException("Notebook not found or access denied");
        }
        return entryRepository.findFavoritesByNotebookId(notebookId, cursor, PageRequest.of(0, size));
    }

    // 按熟悉度篩選（無限捲動，cursor-based 分頁）
    public List<NotebookEntry> getEntriesByMastery(Long notebookId, Long userId, Integer level, Long cursor, int size) {
        if (!notebookRepository.existsByIdAndUserId(notebookId, userId)) {
            throw new RuntimeException("Notebook not found or access denied");
        }
        return entryRepository.findByNotebookIdAndMasteryLevel(notebookId, level, cursor, PageRequest.of(0, size));
    }

    // 統計筆記本單字數
    public long countEntries(Long notebookId, Long userId) {
        if (!notebookRepository.existsByIdAndUserId(notebookId, userId)) {
            throw new RuntimeException("Notebook not found or access denied");
        }
        return entryRepository.countByNotebookId(notebookId);
    }
}