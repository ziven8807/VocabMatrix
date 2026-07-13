import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "https://vocabmatrix.com";

// 帳密改用環境變數帶入，避免寫死在版控裡
// 執行方式：k6 run -e TEST_EMAIL=xxx -e TEST_PASSWORD=xxx k6-test.js
const IDENTIFIER = __ENV.TEST_EMAIL || "ogliao998513@gmail.com";
const PASSWORD = __ENV.TEST_PASSWORD || "945396000";

export const options = {
  stages: [
    { duration: "1m", target: 300 },
    { duration: "1m", target: 400 },
    { duration: "1m", target: 500 },
    { duration: "1m", target: 600 },
    { duration: "1m", target: 700 },
    { duration: "1m", target: 0 }, // 觀察是否恢復
  ],
  thresholds: {
    // 整體門檻
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.01"],
  },
};

// =====================================================
// setup() 只執行一次，拿到 token 後傳給所有 VU
// =====================================================
export function setup() {
  const res = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({
      identifier: IDENTIFIER,
      password: PASSWORD,
    }),
    {
      headers: { "Content-Type": "application/json" },
      tags: { name: "login" },
    },
  );

  const loginOk = check(res, { "login success": (r) => r.status === 200 });

  if (!loginOk) {
    throw new Error(`Setup 登入失敗，status=${res.status}, body=${res.body}`);
  }

  const token = res.json("accessToken");
  return { token };
}

// =====================================================
// 主測試邏輯，每個 VU 反覆執行
// =====================================================
export default function (data) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${data.token}`,
  };

  let res;

  // ── Vocabulary（公開，不需要 token，平行送出）─────────
  const vocabResponses = http.batch([
    [
      "GET",
      `${BASE_URL}/api/vocabulary/autocomplete?prefix=app`,
      null,
      { tags: { name: "vocabulary_autocomplete" } },
    ],
    [
      "GET",
      `${BASE_URL}/api/vocabulary/difficulty/BEGINNER`,
      null,
      { tags: { name: "vocabulary_difficulty" } },
    ],
    [
      "GET",
      `${BASE_URL}/api/vocabulary/category/NOUN`,
      null,
      { tags: { name: "vocabulary_category" } },
    ],
  ]);

  check(vocabResponses[0], {
    "vocabulary autocomplete 200": (r) => r.status === 200,
  });
  check(vocabResponses[1], {
    "vocabulary by difficulty 200": (r) => r.status === 200,
  });
  check(vocabResponses[2], {
    "vocabulary by category 200": (r) => r.status === 200,
  });

  sleep(0.5);

  // ── Leaderboard（公開）──────────────────────────────
  res = http.get(`${BASE_URL}/api/contest/leaderboard/weekly`, {
    tags: { name: "leaderboard" },
  });
  check(res, { "leaderboard 200": (r) => r.status === 200 });

  sleep(0.5);

  // ── Profile（需要 token）────────────────────────────
  res = http.get(`${BASE_URL}/api/user/profile`, {
    headers,
    tags: { name: "profile" },
  });
  check(res, {
    "get profile 200": (r) => r.status === 200,
    "profile has email": (r) => r.json("email") !== undefined,
  });

  sleep(0.5);

  // ── Notebook（需要 token）───────────────────────────
  res = http.get(`${BASE_URL}/api/notebooks`, {
    headers,
    tags: { name: "notebooks_list" },
  });
  check(res, { "get notebooks 200": (r) => r.status === 200 });

  if (res.status === 200) {
    const notebooks = res.json();
    if (notebooks && notebooks.length > 0) {
      const notebookId = notebooks[0].id;

      res = http.get(`${BASE_URL}/api/notebooks/${notebookId}`, {
        headers,
        tags: { name: "notebook_detail" },
      });
      check(res, { "get notebook detail 200": (r) => r.status === 200 });

      res = http.get(`${BASE_URL}/api/notebooks/${notebookId}/entries`, {
        headers,
        tags: { name: "notebook_entries" },
      });
      check(res, { "get notebook entries 200": (r) => r.status === 200 });

      res = http.get(`${BASE_URL}/api/notebooks/${notebookId}/count`, {
        headers,
        tags: { name: "notebook_count" },
      });
      check(res, { "get notebook count 200": (r) => r.status === 200 });
    }
  }

  sleep(0.5);

  // ── Quiz（需要 token）───────────────────────────────
  res = http.get(`${BASE_URL}/api/contest/quiz/questions`, {
    headers,
    tags: { name: "quiz_questions" },
  });
  check(res, { "get quiz questions 200": (r) => r.status === 200 });

  res = http.get(`${BASE_URL}/api/contest/quiz/history`, {
    headers,
    tags: { name: "quiz_history" },
  });
  check(res, { "get quiz history 200": (r) => r.status === 200 });

  sleep(1);
}
