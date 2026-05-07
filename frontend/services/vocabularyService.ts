// frontend/services/vocabularyService.ts

import api from "@/lib/axios";

// 定義單字的資料結構
export interface Vocabulary {
  id: number;       
  wordId: number;   
  word: string;
  definitionEn: string;
  definitionCn?: string;
  pos?: string;
  exampleSentences?: string;
  categories?: string[];
  examTags?: string[];
  difficultyLevel?: string;
}

export const vocabularyService = {
  // 搜尋單字（精確匹配）
  // 對應後端：GET /api/vocabulary/search/{word}
  searchWord: async (word: string) => {
    return api.get<Vocabulary[]>(`/api/vocabulary/search/${word}`);
  },

  // 自動完成（模糊搜尋）
  // 對應後端：GET /api/vocabulary/autocomplete?prefix={prefix}
  autocomplete: async (prefix: string) => {
    return api.get<Vocabulary[]>(`/api/vocabulary/autocomplete`, {
      params: { prefix },
    });
  },

  // 按主題查詢
  // 對應後端：GET /api/vocabulary/category/{category}
  getByCategory: async (category: string, page = 0, size = 20) => {
    return api.get(`/api/vocabulary/category/${category}`, {
      params: { page, size },
    });
  },
};
