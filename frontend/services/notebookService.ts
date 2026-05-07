// frontend/src/services/notebookService.ts

import api from "@/lib/axios";

// 筆記本基本資料
export interface Notebook {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

// 筆記本 entry 裡的單字物件（來自 words 表）
export interface WordInEntry {
  id: number; // word_id，移除單字或更新熟悉度時用這個
  word: string; // 單字字串，直接顯示用
  createdAt: string;
  updatedAt: string;
}

// 筆記本收藏的單字條目
// 後端改成以整個單字（word）為收藏單位，不再是某個義項（definition）
export interface NotebookEntry {
  id: number;
  notebook: { id: number };
  word: WordInEntry; // 收藏的單字
  userNote: string | null; // 使用者自己寫的備註
  masteryLevel: number; // 熟悉度 0-5（間隔重複學習）
  isFavorite: boolean; // 是否標記為最愛
  addedAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const notebookService = {
  // ========== 筆記本管理 ==========

  // 建立筆記本
  createNotebook(name: string, description?: string) {
    return api.post<Notebook>("/notebooks", { name, description });
  },

  // 查詢使用者的所有筆記本
  getMyNotebooks() {
    return api.get<Notebook[]>("/notebooks");
  },

  // 查詢單一筆記本
  getNotebook(notebookId: number) {
    return api.get<Notebook>(`/notebooks/${notebookId}`);
  },

  // 更新筆記本名稱或描述
  updateNotebook(notebookId: number, name: string, description?: string) {
    return api.put<Notebook>(`/notebooks/${notebookId}`, { name, description });
  },

  // 刪除筆記本（底下所有 entry 也會一起刪除）
  deleteNotebook(notebookId: number) {
    return api.delete<void>(`/notebooks/${notebookId}`);
  },

  // ========== 筆記項目管理 ==========

  // 加入單字到筆記本（傳 wordId，後端以整個字為單位收藏）
  addVocabulary(notebookId: number, wordId: number) {
    return api.post<NotebookEntry>(`/notebooks/${notebookId}/entries`, {
      wordId,
    });
  },

  // 從筆記本移除單字
  removeVocabulary(notebookId: number, wordId: number) {
    return api.delete<void>(`/notebooks/${notebookId}/entries/${wordId}`);
  },

  // 更新筆記項目（備註、熟悉度、最愛標記）
  updateEntry(
    notebookId: number,
    wordId: number,
    data: {
      userNote?: string;
      masteryLevel?: number;
      isFavorite?: boolean;
    },
  ) {
    return api.patch<NotebookEntry>(
      `/notebooks/${notebookId}/entries/${wordId}`,
      data,
    );
  },

  // 查詢筆記本內的所有單字（cursor-based 無限捲動）
  // cursor 是上一批最後一筆的 id，第一次傳 0
  getEntries(notebookId: number, cursor = 0, size = 20) {
    return api.get<NotebookEntry[]>(`/notebooks/${notebookId}/entries`, {
      params: { cursor, size },
    });
  },

  // 查詢筆記本內的重點單字（isFavorite = true）
  getFavoriteEntries(notebookId: number, cursor = 0, size = 20) {
    return api.get<NotebookEntry[]>(
      `/notebooks/${notebookId}/entries/favorites`,
      { params: { cursor, size } },
    );
  },

  // 按熟悉度篩選單字
  getEntriesByMastery(
    notebookId: number,
    level: number,
    cursor = 0,
    size = 20,
  ) {
    return api.get<NotebookEntry[]>(
      `/notebooks/${notebookId}/entries/mastery/${level}`,
      { params: { cursor, size } },
    );
  },

  // 統計筆記本內的單字數量
  countEntries(notebookId: number) {
    return api.get<{ count: number }>(`/notebooks/${notebookId}/count`);
  },
};
