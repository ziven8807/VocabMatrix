// src/main/java/com/vocabmatrix/backend/vocabulary/controller/VocabularyController.java

package com.vocabmatrix.backend.vocabulary.controller;

import com.vocabmatrix.backend.vocabulary.dto.WordDefinitionDTO;
import com.vocabmatrix.backend.vocabulary.entity.Word;
import com.vocabmatrix.backend.vocabulary.entity.WordDefinition;
import com.vocabmatrix.backend.vocabulary.service.VocabularyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vocabulary")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class VocabularyController {

    private final VocabularyService vocabularyService;

    // 查詢單字的所有釋義
    @GetMapping("/search/{word}")
    public ResponseEntity<List<WordDefinitionDTO>> searchWord(@PathVariable String word) {
        List<WordDefinitionDTO> meanings = vocabularyService.getWordMeanings(word);
        return meanings.isEmpty()
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(meanings);
    }

    // 按主題查詢（無限捲動，cursor-based 分頁）
    @GetMapping("/category/{category}")
    public ResponseEntity<List<WordDefinitionDTO>> getByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") Long cursor,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(vocabularyService.getVocabularyByCategory(category, cursor, size));
    }

    // 按考試標籤查詢（無限捲動，cursor-based 分頁）
    @GetMapping("/exam/{examTag}")
    public ResponseEntity<List<WordDefinitionDTO>> getByExam(
            @PathVariable String examTag,
            @RequestParam(defaultValue = "0") Long cursor,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(vocabularyService.getVocabularyByExam(examTag, cursor, size));
    }

    // 按難度查詢（無限捲動，cursor-based 分頁）
    @GetMapping("/difficulty/{difficultyLevel}")
    public ResponseEntity<List<WordDefinitionDTO>> getByDifficulty(
            @PathVariable String difficultyLevel,
            @RequestParam(defaultValue = "0") Long cursor,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(vocabularyService.getVocabularyByDifficulty(difficultyLevel, cursor, size));
    }

    // 自動完成（只回傳單字字串，不需要帶定義）
    @GetMapping("/autocomplete")
    public List<Word> autocomplete(@RequestParam String prefix) {
        return vocabularyService.searchWords(prefix);
    }

    // 新增定義（word 存在就直接加，不存在自動建）
    @PostMapping("/{word}/definitions")
    public ResponseEntity<WordDefinitionDTO> addDefinition(
            @PathVariable String word,
            @RequestBody WordDefinition definition
    ) {
        return ResponseEntity.ok(vocabularyService.addDefinition(word, definition));
    }

    // 更新單一定義
    @PutMapping("/definitions/{definitionId}")
    public ResponseEntity<WordDefinitionDTO> updateDefinition(
            @PathVariable Long definitionId,
            @RequestBody WordDefinition definition
    ) {
        return ResponseEntity.ok(vocabularyService.updateDefinition(definitionId, definition));
    }

    // 刪除單一定義
    @DeleteMapping("/definitions/{definitionId}")
    public ResponseEntity<Void> deleteDefinition(@PathVariable Long definitionId) {
        vocabularyService.deleteDefinition(definitionId);
        return ResponseEntity.noContent().build();
    }

    // 刪除整個單字（連同所有定義）
    @DeleteMapping("/{wordId}")
    public ResponseEntity<Void> deleteWord(@PathVariable Long wordId) {
        vocabularyService.deleteWord(wordId);
        return ResponseEntity.noContent().build();
    }
}