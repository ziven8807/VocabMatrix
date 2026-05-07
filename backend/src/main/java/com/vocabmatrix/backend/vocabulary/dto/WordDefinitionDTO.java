// src/main/java/com/vocabmatrix/backend/vocabulary/dto/WordDefinitionDTO.java

package com.vocabmatrix.backend.vocabulary.dto;

import com.vocabmatrix.backend.vocabulary.entity.WordDefinition;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class WordDefinitionDTO {

    private Long id;
    private Long wordId;          // 新增：對應 words 表的 id，供前端收藏單字用
    private String word;          // 直接攤平單字字串，不是 Word 物件
    private String definitionEn;
    private String definitionCn;
    private String pos;
    private String exampleSentences;
    private String[] categories;
    private String[] examTags;
    private String difficultyLevel;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    // 從 WordDefinition entity 轉換成 DTO
    public static WordDefinitionDTO from(WordDefinition def) {
        WordDefinitionDTO dto = new WordDefinitionDTO();
        dto.setId(def.getId());
        dto.setWordId(def.getWord().getId());  // 新增
        dto.setWord(def.getWord().getWord());  // 只取字串
        dto.setDefinitionEn(def.getDefinitionEn());
        dto.setDefinitionCn(def.getDefinitionCn());
        dto.setPos(def.getPos());
        dto.setExampleSentences(def.getExampleSentences());
        dto.setCategories(def.getCategories());
        dto.setExamTags(def.getExamTags());
        dto.setDifficultyLevel(def.getDifficultyLevel());
        dto.setCreatedAt(def.getCreatedAt());
        dto.setUpdatedAt(def.getUpdatedAt());
        return dto;
    }
}