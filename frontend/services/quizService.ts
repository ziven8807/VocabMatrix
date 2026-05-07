// frontend/src/services/quizService.ts

import api from "@/lib/axios";

// ── 題目格式 ──
// 後端從 word_definitions 抽題後回傳，answer 不會出現在這裡
// 答案由後端存在 Redis（key: quiz:session:{userId}），前端無法得知
export interface QuizQuestion {
  definitionId: number; // word_definitions.id，作為這題的唯一識別
  definitionEn: string; // 英文定義，作為題目顯示給使用者
  definitionCn: string | null; // 中文定義，目前答題畫面不顯示以免洩漏答案
  pos: string | null; // 詞性（noun / verb / adj...），顯示為提示標籤
  category: string; // 分類（General / Technology...）
}

// ── 每題的使用者答案 ──
// 10 題答完後打包成 answers[] 送到 /submit，後端再統一驗證
export interface UserAnswer {
  definitionId: number; // 對應哪一題
  firstAttempt: string; // 第一次輸入的答案（超時為空字串 ""）
  secondAttempt: string | null; // 第一次答錯才有，直接跳下一題則為 null
}

// ── 送出答題結果的格式 ──
// POST /contest/quiz/submit 的 request body
export interface QuizSubmitRequest {
  category: string; // 固定送 "Mixed"，不分類
  durationSeconds: number; // 從開始到結束的秒數，由前端計算
  answers: UserAnswer[]; // 所有題目的作答紀錄
}

// ── 結果畫面每題的詳細資訊 ──
export interface QuestionReview {
  definitionId: number;
  definitionEn: string; // 英文定義（題目）
  correctAnswer: string; // 正確答案（遊戲結束後才揭露）
  firstAttempt: string; // 第一次輸入
  secondAttempt: string | null; // 第二次輸入，沒有則 null
  correct: boolean; // 最終是否答對
}

// ── 後端儲存完成後回傳的結果 ──
// POST /contest/quiz/submit 的 response body
// 後端會重新驗證答案並計算分數，前端以此為準（不信任前端自算）
export interface QuizResult {
  id: number;
  category: string; // 固定為 "Mixed"
  correctCount: number; // 答對題數（後端算）
  wrongCount: number; // 答錯題數（後端算）
  totalQuestions: number; // 總題數
  durationSeconds: number; // 完成時間（秒）
  wrongWords: string; // JSONB 字串，存答錯的題目，前端需 JSON.parse() 使用
  completedAt: string; // 完成時間戳
  rank: number | null; // 排名，尚未實作時為 null
  review: QuestionReview[]; // 每題的詳細結果，結果畫面用
}

// ── 即時驗證單題的 request ──
// POST /contest/quiz/check 的 request body
// 每答完一題就打一次，後端從 Redis 比對後只回傳對錯，不透露正確答案
export interface QuizCheckRequest {
  definitionId: number; // 這題是哪一個定義
  answer: string; // 使用者輸入的答案
}

// ── 即時驗證單題的 response ──
// POST /contest/quiz/check 的 response body
export interface QuizCheckResponse {
  correct: boolean; // true = 答對，false = 答錯
}

export const quizService = {
  // 取得隨機題目
  // GET /contest/quiz/questions?size=10
  // 不帶 category，後端從所有單字中混抽
  // 後端同時把答案存進 Redis session，前端只拿到無答案的題目列表
  getQuestions(size: number = 10) {
    return api.get<QuizQuestion[]>("/contest/quiz/questions", {
      params: { size },
    });
  },

  // 即時驗證單題答案
  // POST /contest/quiz/check
  // 答完第一次就呼叫，答對直接進下一題，答錯進 retry
  checkAnswer(request: QuizCheckRequest) {
    return api.post<QuizCheckResponse>("/contest/quiz/check", request);
  },

  // 送出完整答題結果
  // POST /contest/quiz/submit
  // 10 題全部作答完畢後呼叫，後端從 Redis 取答案重新驗證並存進 DB
  submitResult(request: QuizSubmitRequest) {
    return api.post<QuizResult>("/contest/quiz/submit", request);
  },

  // 查詢歷史紀錄（分頁）
  // GET /contest/quiz/history?page=0&size=10
  getHistory(page: number = 0, size: number = 10) {
    return api.get<{
      content: QuizResult[]; // 當頁的紀錄
      totalPages: number; // 總頁數
      totalElements: number; // 總筆數
    }>("/contest/quiz/history", { params: { page, size } });
  },
};
