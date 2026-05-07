// frontend/src/app/contest/quiz/page.tsx

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  quizService,
  QuizQuestion,
  UserAnswer,
  QuestionReview,
} from "@/services/quizService";

type GameState = "start" | "playing" | "feedback" | "retry" | "result";
type FeedbackType = "correct" | "wrong" | null;

const TOTAL_QUESTIONS = 10;
const TIME_LIMIT = 30;
const FEEDBACK_DURATION = 900;

// ── SVG：獎盃（8 題以上）──
const TrophyIcon = () => (
  <svg viewBox="0 0 80 80" fill="none" className="w-24 h-24 mx-auto mb-2">
    <path
      d="M24 14h32v22c0 12-7 20-16 23-9-3-16-11-16-23V14z"
      fill="#a855f7"
      fillOpacity="0.15"
      stroke="#a855f7"
      strokeWidth="2"
    />
    <path
      d="M24 22H15c0 9 4 15 10 17"
      stroke="#a855f7"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M56 22h9c0 9-4 15-10 17"
      stroke="#a855f7"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path d="M40 59v7" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M28 66h24"
      stroke="#a855f7"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M40 26l2 5h5l-4 3 1.5 5L40 36l-4.5 3 1.5-5-4-3h5z"
      fill="#a855f7"
    />
  </svg>
);

// ── SVG：豎拇指（5–7 題）──
const ThumbUpIcon = () => (
  <svg viewBox="0 0 80 80" fill="none" className="w-24 h-24 mx-auto mb-2">
    <path
      d="M34 50V34c0-2 1-4 3-5l8-16c1-2 4-1 5 1l1 3c1 3 0 6-2 8h12c2 0 4 2 4 4 0 1 0 2-1 3 1 1 1 2 1 3 0 1-1 3-2 3 0 2-1 3-2 4 0 2-2 3-4 3H38c-2 0-4-1-4-3z"
      fill="#6366f1"
      fillOpacity="0.15"
      stroke="#6366f1"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M26 48h8v18h-8c-1 0-2-1-2-2V50c0-1 1-2 2-2z"
      fill="#6366f1"
      fillOpacity="0.3"
      stroke="#6366f1"
      strokeWidth="2"
    />
  </svg>
);

// ── SVG：啞鈴（4 題以下）──
const DumbbellIcon = () => (
  <svg viewBox="0 0 80 80" fill="none" className="w-24 h-24 mx-auto mb-2">
    <rect
      x="10"
      y="28"
      width="8"
      height="24"
      rx="3"
      fill="#ef4444"
      fillOpacity="0.15"
      stroke="#ef4444"
      strokeWidth="2"
    />
    <rect
      x="18"
      y="33"
      width="6"
      height="14"
      rx="2"
      fill="#ef4444"
      fillOpacity="0.2"
      stroke="#ef4444"
      strokeWidth="2"
    />
    <path
      d="M24 40h32"
      stroke="#ef4444"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <rect
      x="56"
      y="33"
      width="6"
      height="14"
      rx="2"
      fill="#ef4444"
      fillOpacity="0.2"
      stroke="#ef4444"
      strokeWidth="2"
    />
    <rect
      x="62"
      y="28"
      width="8"
      height="24"
      rx="3"
      fill="#ef4444"
      fillOpacity="0.15"
      stroke="#ef4444"
      strokeWidth="2"
    />
  </svg>
);

// ── SVG：打勾（答對反饋標籤用）──
const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 inline mr-1">
    <path
      d="M4 10l4 4 8-8"
      stroke="#86efac"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── SVG：打叉（答錯反饋標籤用）──
const CrossIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 inline mr-1">
    <path
      d="M5 5l10 10M15 5L5 15"
      stroke="#fca5a5"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

// ── SVG：重試箭頭（Try Again 標籤用）──
const RetryIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 inline mr-1">
    <path
      d="M4 10a6 6 0 106-6H8"
      stroke="#fde68a"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 4L6 7l3 1"
      stroke="#fde68a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function QuizPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [gameState, setGameState] = useState<GameState>("start");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [rank, setRank] = useState<number | null>(null);
  const [review, setReview] = useState<QuestionReview[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const feedbackRef = useRef<NodeJS.Timeout | null>(null);
  // 超時防重複觸發的 flag
  const timeoutFiredRef = useRef(false);

  const currentQuestion = questions[currentIndex];

  // 未登入導向登入頁
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // 跳下一題，或最後一題時送出結果
  const goNext = useCallback(
    (updatedAnswers: UserAnswer[]) => {
      clearTimer();
      const nextIndex = currentIndex + 1;

      if (nextIndex >= TOTAL_QUESTIONS) {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        setTotalDuration(duration);
        submitResult(updatedAnswers, duration);
      } else {
        setCurrentIndex(nextIndex);
        setInput("");
        setTimeLeft(TIME_LIMIT);
        setFeedback(null);
        // 重置超時 flag，準備下一題
        timeoutFiredRef.current = false;
        setGameState("playing");
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    },
    [currentIndex, startTime],
  );

  // 顯示對/錯反饋動畫，結束後進下一題或 retry
  const showFeedbackThenProceed = useCallback(
    (type: FeedbackType, updatedAnswers: UserAnswer[], goToRetry: boolean) => {
      setFeedback(type);
      setGameState("feedback");
      clearTimer();

      if (feedbackRef.current) clearTimeout(feedbackRef.current);
      feedbackRef.current = setTimeout(() => {
        if (goToRetry) {
          setFeedback(null);
          setInput("");
          setTimeLeft(TIME_LIMIT);
          setGameState("retry");
          setTimeout(() => inputRef.current?.focus(), 100);
        } else {
          goNext(updatedAnswers);
        }
      }, FEEDBACK_DURATION);
    },
    [goNext],
  );

  // 倒數計時器，只在 playing 狀態啟動
  useEffect(() => {
    if (gameState !== "playing") return;

    // 每次進新題目時重置 flag
    timeoutFiredRef.current = false;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);

          // flag 防止 React StrictMode 或 state 非同步造成重複觸發
          if (timeoutFiredRef.current) return 0;
          timeoutFiredRef.current = true;

          // 超時：記空字串算錯，顯示紅色反饋後跳下一題（不進 retry）
          setAnswers((prev) => {
            const timeoutAnswer: UserAnswer = {
              definitionId: currentQuestion.definitionId,
              firstAttempt: "",
              secondAttempt: null,
            };
            const updated = [...prev, timeoutAnswer];
            setWrongCount((c) => c + 1);
            showFeedbackThenProceed("wrong", updated, false);
            return updated;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
  }, [gameState, currentIndex]);

  const startGame = async () => {
    setLoading(true);
    try {
      // 不帶 category，後端從所有單字中混抽
      const response = await quizService.getQuestions(TOTAL_QUESTIONS);
      setQuestions(response.data);
      setCurrentIndex(0);
      setAnswers([]);
      setCorrectCount(0);
      setWrongCount(0);
      setInput("");
      setTimeLeft(TIME_LIMIT);
      setFeedback(null);
      setRank(null);
      setReview([]);
      setStartTime(Date.now());
      timeoutFiredRef.current = false;
      setGameState("playing");
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (error) {
      console.error("Failed to load questions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || checking) return;
    clearTimer();

    if (gameState === "playing") {
      setChecking(true);
      try {
        // 打 /check 即時驗證這題
        const res = await quizService.checkAnswer({
          definitionId: currentQuestion.definitionId,
          answer: input.trim(),
        });
        const isCorrect = res.data.correct;

        const newAnswer: UserAnswer = {
          definitionId: currentQuestion.definitionId,
          firstAttempt: input.trim(),
          secondAttempt: null,
        };

        if (isCorrect) {
          // 答對：顯示綠色反饋後跳下一題
          const updated = [...answers, newAnswer];
          setAnswers(updated);
          setCorrectCount((c) => c + 1);
          showFeedbackThenProceed("correct", updated, false);
        } else {
          // 答錯：記 firstAttempt，顯示紅色反饋後進 retry
          setAnswers((prev) => [...prev, newAnswer]);
          showFeedbackThenProceed("wrong", [], true);
        }
      } catch (error) {
        console.error("Check answer failed", error);
        // 打 API 失敗時恢復計時，讓使用者可以繼續作答
        setGameState("playing");
      } finally {
        setChecking(false);
      }
      return;
    }

    if (gameState === "retry") {
      // retry 打 /check 驗證 secondAttempt，顯示對錯反饋後跳下一題
      setChecking(true);
      try {
        const res = await quizService.checkAnswer({
          definitionId: currentQuestion.definitionId,
          answer: input.trim(),
        });
        const isCorrect = res.data.correct;

        const updated = answers.map((a) =>
          a.definitionId === currentQuestion.definitionId
            ? { ...a, secondAttempt: input.trim() }
            : a,
        );
        setAnswers(updated);

        if (isCorrect) {
          setCorrectCount((c) => c + 1);
        } else {
          setWrongCount((c) => c + 1);
        }

        // retry 不管對錯都跳下一題，反饋後直接 goNext
        showFeedbackThenProceed(
          isCorrect ? "correct" : "wrong",
          updated,
          false,
        );
      } catch (error) {
        console.error("Check answer failed", error);
        setGameState("retry");
      } finally {
        setChecking(false);
      }
    }
  };

  const submitResult = async (finalAnswers: UserAnswer[], duration: number) => {
    setSubmitting(true);
    setGameState("result");
    try {
      const response = await quizService.submitResult({
        category: "Mixed", // 不分類，固定送 Mixed
        durationSeconds: duration,
        answers: finalAnswers,
      });
      // 以後端驗證後的分數為準
      setCorrectCount(response.data.correctCount);
      setWrongCount(response.data.wrongCount);
      setTotalDuration(response.data.durationSeconds);
      setRank(response.data.rank);
      setReview(response.data.review ?? []);
    } catch (error) {
      console.error("Failed to submit result", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // 全頁載入中
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── 開始畫面 ──
  if (gameState === "start") {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 pt-24">
        <div className="text-center max-w-md w-full">
          <h1 className="text-5xl font-black text-white mb-3 tracking-tight">
            SPELL <span className="text-purple-500">MATRIX</span>
          </h1>
          <p className="text-gray-500 mb-10">
            10 questions. 30 seconds each. Can you spell them all?
          </p>
          <button
            onClick={startGame}
            disabled={loading}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-lg rounded-2xl transition-all active:scale-95 shadow-lg shadow-purple-500/30 disabled:opacity-50"
          >
            {loading ? "Loading..." : "START"}
          </button>
        </div>
      </main>
    );
  }

  // ── 結果畫面 ──
  if (gameState === "result") {
    // 根據分數決定顯示哪個 SVG 圖示
    const ResultIcon =
      correctCount >= 8
        ? TrophyIcon
        : correctCount >= 5
        ? ThumbUpIcon
        : DumbbellIcon;

    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 py-12 pt-24">
        <div className="w-full max-w-xl">
          {/* 成績圖示 */}
          <div className="text-center mb-6">
            <ResultIcon />
            <h2 className="text-4xl font-black text-white">
              {submitting ? "Calculating..." : "RESULT"}
            </h2>
          </div>

          {!submitting && (
            <>
              {/* 分數卡片 */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900 border border-white/10 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-black text-green-400">
                    {correctCount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                    Correct
                  </p>
                </div>
                <div className="bg-gray-900 border border-white/10 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-black text-red-400">
                    {wrongCount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                    Wrong
                  </p>
                </div>
                <div className="bg-gray-900 border border-white/10 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-black text-purple-400">
                    {formatTime(totalDuration)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                    Time
                  </p>
                </div>
              </div>

              {/* 排名（有的話才顯示）*/}
              {rank && (
                <div className="mb-6 py-3 px-6 bg-purple-600/20 border border-purple-500/30 rounded-xl text-center">
                  <p className="text-purple-300 font-bold">
                    Your rank:{" "}
                    <span className="text-white text-xl">#{rank}</span>
                  </p>
                </div>
              )}

              {/* 每題答案回顧，答錯的用紅框標示 */}
              {review.length > 0 && (
                <div className="mb-6 space-y-3">
                  <p className="text-gray-400 text-sm uppercase tracking-widest mb-3">
                    Review
                  </p>
                  {review.map((item, i) => (
                    <div
                      key={item.definitionId}
                      className={`rounded-2xl p-4 border transition-all ${
                        item.correct
                          ? "bg-gray-900/50 border-white/10" // 答對：一般樣式
                          : "bg-red-950/30 border-red-500/50" // 答錯：紅框
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {/* 題號 + 英文定義 */}
                          <p className="text-gray-400 text-xs mb-1">#{i + 1}</p>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {item.definitionEn}
                          </p>
                        </div>
                        {/* 正確答案 */}
                        <div className="text-right shrink-0">
                          <p
                            className={`font-bold text-base ${
                              item.correct ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {item.correctAnswer}
                          </p>
                          {/* 答錯才顯示使用者輸入了什麼 */}
                          {!item.correct && (
                            <p className="text-gray-600 text-xs line-through mt-0.5">
                              {item.secondAttempt || item.firstAttempt || "—"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 按鈕 */}
              <div className="flex gap-3">
                <button
                  onClick={startGame}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all"
                >
                  Play Again
                </button>
                <button
                  onClick={() => router.push("/contest")}
                  className="flex-1 py-3 bg-gray-900 border border-white/10 text-gray-300 font-bold rounded-xl hover:border-purple-500/50 transition-all"
                >
                  Back
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    );
  }

  // ── 答題畫面（playing / feedback / retry）──

  // 題目卡片 border 顏色：答對綠、答錯紅、預設無色
  const cardBorder =
    feedback === "correct"
      ? "border-green-500 shadow-green-500/20 shadow-lg"
      : feedback === "wrong"
      ? "border-red-500 shadow-red-500/20 shadow-lg"
      : "border-white/10";

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 pt-24">
      <div className="w-full max-w-xl">
        {/* 進度列 */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-500 text-sm font-mono">
            {currentIndex + 1} / {TOTAL_QUESTIONS}
          </span>
          <div className="flex-1 mx-4 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${(currentIndex / TOTAL_QUESTIONS) * 100}%` }}
            />
          </div>
          {/* retry 時計時暫停，顯示破折號；10 秒以下變紅 */}
          <span
            className={`text-sm font-mono font-bold w-10 text-right ${
              timeLeft <= 10 ? "text-red-400" : "text-gray-400"
            }`}
          >
            {gameState === "retry" ? "—" : `${timeLeft}s`}
          </span>
        </div>

        {/* 題目卡片，border 顏色隨反饋變化 */}
        <div
          className={`bg-gray-900/50 border rounded-3xl p-8 mb-6 transition-all duration-300 ${cardBorder}`}
        >
          {/* 反饋標籤 */}
          {feedback === "correct" && (
            <div className="mb-4 text-center">
              <span className="inline-flex items-center text-xs px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full font-bold uppercase tracking-wider">
                <CheckIcon /> Correct!
              </span>
            </div>
          )}
          {feedback === "wrong" && (
            <div className="mb-4 text-center">
              <span className="inline-flex items-center text-xs px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full font-bold uppercase tracking-wider">
                <CrossIcon /> Wrong
              </span>
            </div>
          )}
          {gameState === "retry" && !feedback && (
            <div className="mb-4 text-center">
              <span className="inline-flex items-center text-xs px-3 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full font-bold uppercase tracking-wider">
                <RetryIcon /> Try Again
              </span>
            </div>
          )}

          {/* 詞性標籤 */}
          {currentQuestion?.pos && (
            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
              {currentQuestion.pos}
            </span>
          )}

          {/* 英文定義（不顯示中文，避免洩漏答案）*/}
          <p className="text-white text-xl leading-relaxed mt-4">
            {currentQuestion?.definitionEn}
          </p>
        </div>

        {/* 輸入框，feedback 期間 disabled */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={gameState === "feedback"}
          placeholder="Type the word..."
          className="w-full bg-gray-900 border border-white/10 rounded-2xl px-6 py-4 text-white text-lg outline-none focus:border-purple-500 transition-all disabled:opacity-40"
        />

        {/* 送出按鈕，checking 或 feedback 期間 disabled */}
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || checking || gameState === "feedback"}
          className="w-full mt-4 py-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-lg rounded-2xl transition-all active:scale-95 disabled:opacity-30"
        >
          {checking
            ? "Checking..."
            : gameState === "retry"
            ? "FINAL ANSWER"
            : "SUBMIT"}
        </button>
      </div>
    </main>
  );
}
