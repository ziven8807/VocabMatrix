// src/main/java/com/vocabmatrix/backend/vocabulary/service/VocabularyService.java

package com.vocabmatrix.backend.vocabulary.service;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vocabmatrix.backend.vocabulary.dto.WordDefinitionDTO;
import com.vocabmatrix.backend.vocabulary.entity.Word;
import com.vocabmatrix.backend.vocabulary.entity.WordDefinition;
import com.vocabmatrix.backend.vocabulary.repository.WordRepository;
import com.vocabmatrix.backend.vocabulary.repository.WordDefinitionRepository;

@Service
@RequiredArgsConstructor
public class VocabularyService {

    private final WordRepository wordRepository;
    private final WordDefinitionRepository wordDefinitionRepository;

    // 查詢單字的所有釋義，回傳 DTO 避免循環引用
    public List<WordDefinitionDTO> getWordMeanings(String word) {
        Word found = wordRepository.findByWord(word.toLowerCase())
                .orElseThrow(() -> new RuntimeException("Word not found: " + word));
        return wordDefinitionRepository.findByWordIdOrderByPosAsc(found.getId())
                .stream().map(WordDefinitionDTO::from).toList();
    }

    // 按主題查詢（無限捲動，cursor-based 分頁），回傳 DTO
    public List<WordDefinitionDTO> getVocabularyByCategory(String category, Long cursor, int size) {
        return wordDefinitionRepository.findByCategory(category, cursor, size)
                .stream().map(WordDefinitionDTO::from).toList();
    }

    // 按考試標籤查詢（無限捲動，cursor-based 分頁），回傳 DTO
    public List<WordDefinitionDTO> getVocabularyByExam(String examTag, Long cursor, int size) {
        return wordDefinitionRepository.findByExamTag(examTag, cursor, size)
                .stream().map(WordDefinitionDTO::from).toList();
    }

    // 按難度查詢（無限捲動，cursor-based 分頁），回傳 DTO
    public List<WordDefinitionDTO> getVocabularyByDifficulty(String difficultyLevel, Long cursor, int size) {
        return wordDefinitionRepository.findByDifficultyLevel(difficultyLevel, cursor, size)
                .stream().map(WordDefinitionDTO::from).toList();
    }

    // 模糊搜尋（自動完成）— 回傳 Word 就夠，不需要帶出所有定義
    public List<Word> searchWords(String prefix) {
        return wordRepository.searchByWordPrefix(prefix.toLowerCase());
    }

    // 新增單字（word 不存在才建，存在則直接在下面加定義）
    @Transactional
    public WordDefinitionDTO addDefinition(String wordText, WordDefinition definition) {
        Word word = wordRepository.findByWord(wordText.toLowerCase())
                .orElseGet(() -> wordRepository.save(
                        new Word(null, wordText.toLowerCase(), null, null)));
        definition.setWord(word);
        return WordDefinitionDTO.from(wordDefinitionRepository.save(definition));
    }

    // 更新定義
    @Transactional
    public WordDefinitionDTO updateDefinition(Long definitionId, WordDefinition updated) {
        return wordDefinitionRepository.findById(definitionId)
                .map(existing -> {
                    existing.setDefinitionEn(updated.getDefinitionEn());
                    existing.setDefinitionCn(updated.getDefinitionCn());
                    existing.setPos(updated.getPos());
                    existing.setExampleSentences(updated.getExampleSentences());
                    existing.setCategories(updated.getCategories());
                    existing.setExamTags(updated.getExamTags());
                    existing.setDifficultyLevel(updated.getDifficultyLevel());
                    return WordDefinitionDTO.from(wordDefinitionRepository.save(existing));
                })
                .orElseThrow(() -> new RuntimeException("Definition not found: " + definitionId));
    }

    // 刪除單一定義
    @Transactional
    public void deleteDefinition(Long definitionId) {
        wordDefinitionRepository.deleteById(definitionId);
    }

    // 刪除整個單字（連同所有定義，CASCADE 會處理）
    @Transactional
    public void deleteWord(Long wordId) {
        wordRepository.deleteById(wordId);
    }
}