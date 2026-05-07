// src/main/java/com/vocabmatrix/backend/notebook/controller/NotebookController.java

package com.vocabmatrix.backend.notebook.controller;

import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.vocabmatrix.backend.notebook.entity.Notebook;
import com.vocabmatrix.backend.notebook.entity.NotebookEntry;
import com.vocabmatrix.backend.notebook.service.NotebookService;
import com.vocabmatrix.backend.security.AuthenticatedUser;

@RestController
@RequestMapping("/api/notebooks")
@RequiredArgsConstructor
public class NotebookController {

    private final NotebookService notebookService;

    // ========== 筆記本管理 ==========

    // 建立筆記本
    @PostMapping
    public ResponseEntity<Notebook> createNotebook(
            @AuthenticationPrincipal AuthenticatedUser user,
            @RequestBody Map<String, String> request
    ) {
        Notebook notebook = notebookService.createNotebook(
                user.getId(),
                request.get("name"),
                request.get("description")
        );
        return ResponseEntity.ok(notebook);
    }

    // 查詢使用者的所有筆記本
    @GetMapping
    public ResponseEntity<List<Notebook>> getUserNotebooks(
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        return ResponseEntity.ok(notebookService.getUserNotebooks(user.getId()));
    }

    // 查詢單一筆記本
    @GetMapping("/{notebookId}")
    public ResponseEntity<Notebook> getNotebook(
            @PathVariable Long notebookId,
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        return ResponseEntity.ok(notebookService.getNotebook(notebookId, user.getId()));
    }

    // 更新筆記本
    @PutMapping("/{notebookId}")
    public ResponseEntity<Notebook> updateNotebook(
            @PathVariable Long notebookId,
            @AuthenticationPrincipal AuthenticatedUser user,
            @RequestBody Map<String, String> request
    ) {
        return ResponseEntity.ok(notebookService.updateNotebook(
                notebookId,
                user.getId(),
                request.get("name"),
                request.get("description")
        ));
    }

    // 刪除筆記本
    @DeleteMapping("/{notebookId}")
    public ResponseEntity<Void> deleteNotebook(
            @PathVariable Long notebookId,
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        notebookService.deleteNotebook(notebookId, user.getId());
        return ResponseEntity.noContent().build();
    }

    // ========== 筆記項目管理 ==========

    // 加入單字到筆記本
    @PostMapping("/{notebookId}/entries")
    public ResponseEntity<NotebookEntry> addWord(
            @PathVariable Long notebookId,
            @AuthenticationPrincipal AuthenticatedUser user,
            @RequestBody Map<String, Long> request
    ) {
        return ResponseEntity.ok(notebookService.addWordToNotebook(
                notebookId,
                user.getId(),
                request.get("wordId")
        ));
    }

    // 從筆記本移除單字
    @DeleteMapping("/{notebookId}/entries/{wordId}")
    public ResponseEntity<Void> removeWord(
            @PathVariable Long notebookId,
            @PathVariable Long wordId,
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        notebookService.removeWordFromNotebook(notebookId, user.getId(), wordId);
        return ResponseEntity.noContent().build();
    }

    // 更新筆記項目（個人筆記、熟悉度、重點標記）
    @PatchMapping("/{notebookId}/entries/{wordId}")
    public ResponseEntity<NotebookEntry> updateEntry(
            @PathVariable Long notebookId,
            @PathVariable Long wordId,
            @AuthenticationPrincipal AuthenticatedUser user,
            @RequestBody Map<String, Object> request
    ) {
        return ResponseEntity.ok(notebookService.updateEntry(
                notebookId,
                user.getId(),
                wordId,
                (String) request.get("userNote"),
                (Integer) request.get("masteryLevel"),
                (Boolean) request.get("isFavorite")
        ));
    }

    // 查詢筆記本內的所有單字（無限捲動，cursor-based 分頁）
    @GetMapping("/{notebookId}/entries")
    public ResponseEntity<List<NotebookEntry>> getEntries(
            @PathVariable Long notebookId,
            @AuthenticationPrincipal AuthenticatedUser user,
            @RequestParam(defaultValue = "0") Long cursor,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(notebookService.getNotebookEntries(
                notebookId, user.getId(), cursor, size
        ));
    }

    // 查詢重點單字（無限捲動，cursor-based 分頁）
    @GetMapping("/{notebookId}/entries/favorites")
    public ResponseEntity<List<NotebookEntry>> getFavorites(
            @PathVariable Long notebookId,
            @AuthenticationPrincipal AuthenticatedUser user,
            @RequestParam(defaultValue = "0") Long cursor,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(notebookService.getFavoriteEntries(
                notebookId, user.getId(), cursor, size
        ));
    }

    // 按熟悉度篩選（無限捲動，cursor-based 分頁）
    @GetMapping("/{notebookId}/entries/mastery/{level}")
    public ResponseEntity<List<NotebookEntry>> getByMastery(
            @PathVariable Long notebookId,
            @PathVariable Integer level,
            @AuthenticationPrincipal AuthenticatedUser user,
            @RequestParam(defaultValue = "0") Long cursor,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(notebookService.getEntriesByMastery(
                notebookId, user.getId(), level, cursor, size
        ));
    }

    // 統計筆記本單字數
    @GetMapping("/{notebookId}/count")
    public ResponseEntity<Map<String, Long>> countEntries(
            @PathVariable Long notebookId,
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        return ResponseEntity.ok(Map.of("count",
                notebookService.countEntries(notebookId, user.getId())
        ));
    }
}