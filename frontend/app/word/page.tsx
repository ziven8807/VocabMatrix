// frontend/app/word/page.tsx

"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Clock,
  CheckCircle,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import api from "@/lib/axios";
import { AxiosError } from "axios";

interface Word {
  id: number;
  word: string;
  phonetic: string;
  translation: string;
  definition: string;
}

interface UserWordProgress {
  id: number;
  wordId: number;
  word: string;
  phonetic: string;
  translation: string;
  masteryLevel: "NEW" | "LEARNING" | "MASTERED" | "FORGOTTEN";
  totalReviews: number;
  correctCount: number;
  wrongCount: number;
  accuracyRate: number;
  nextReviewAt: string;
}

interface LearningStats {
  newWords: number;
  learningWords: number;
  masteredWords: number;
  forgottenWords: number;
  totalWords: number;
}

interface ApiErrorResponse {
  message?: string;
}

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export default function VocabTestPage() {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "learning" | "review"
  >("dashboard");
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [progress, setProgress] = useState<UserWordProgress[]>([]);
  const [reviewWords, setReviewWords] = useState<UserWordProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 載入學習統計
  const loadStats = async () => {
    try {
      const response = await api.get<LearningStats>("/words/progress/stats");
      setStats(response.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(
        axiosError.response?.data?.message || "Failed to load statistics",
      );
    }
  };

  // 載入學習進度
  const loadProgress = async () => {
    try {
      const response = await api.get<PageResponse<UserWordProgress>>(
        "/words/progress",
        {
          params: { page: 0, size: 10 },
        },
      );
      setProgress(response.data.content || []);
    } catch (err) {
      console.error("Failed to load progress:", err);
    }
  };

  // 載入需要複習的單字
  const loadReviewWords = async () => {
    try {
      const response = await api.get<UserWordProgress[]>(
        "/words/progress/review",
      );
      setReviewWords(response.data);
    } catch (err) {
      console.error("Failed to load review words:", err);
    }
  };

  // 載入一個隨機高頻單字
  const loadRandomWord = async () => {
    try {
      setLoading(true);
      const response = await api.get<PageResponse<Word>>(
        "/words/high-frequency",
        {
          params: { minFrq: 4, page: 0, size: 50 },
        },
      );
      const words = response.data.content || [];
      if (words.length > 0) {
        const randomIndex = Math.floor(Math.random() * words.length);
        setCurrentWord(words[randomIndex]);
      }
    } catch (err) {
      console.error("Failed to load word:", err);
      setError("Failed to load word");
    } finally {
      setLoading(false);
    }
  };

  // 標記單字
  const markWord = async (
    wordId: number,
    masteryLevel: string,
    isCorrect?: boolean,
  ) => {
    try {
      setLoading(true);
      await api.post("/words/progress/mark", {
        wordId,
        masteryLevel,
        isCorrect,
      });

      await loadStats();
      await loadProgress();

      if (currentView === "learning") {
        await loadRandomWord();
      }

      setError(null);
    } catch (err) {
      console.error("Failed to mark word:", err);
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || "Failed to mark word");
    } finally {
      setLoading(false);
    }
  };

  // 初始化載入
  useEffect(() => {
    const initData = async () => {
      setInitialLoading(true);
      await Promise.all([loadStats(), loadProgress(), loadReviewWords()]);
      setInitialLoading(false);
    };

    initData();
  }, []);

  // 初始載入畫面
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-400" />
          </div>
          <p className="text-purple-200 mt-4 font-medium">
            Loading your vocabulary journey...
          </p>
        </div>
      </div>
    );
  }

  // 儀表板視圖
  const DashboardView = () => (
    <div className="space-y-6 animate-fade-in">
      {/* 歡迎標題 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Your Learning Dashboard
        </h1>
        <p className="text-purple-200">
          Track your progress and master new words
        </p>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="New Words"
          value={stats?.newWords || 0}
          icon={<BookOpen className="w-5 h-5" />}
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          title="Learning"
          value={stats?.learningWords || 0}
          icon={<Clock className="w-5 h-5" />}
          gradient="from-yellow-500 to-orange-500"
        />
        <StatCard
          title="Mastered"
          value={stats?.masteredWords || 0}
          icon={<CheckCircle className="w-5 h-5" />}
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard
          title="Review"
          value={stats?.forgottenWords || 0}
          icon={<RotateCcw className="w-5 h-5" />}
          gradient="from-red-500 to-pink-500"
        />
      </div>

      {/* 快速行動 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => {
            setCurrentView("learning");
            loadRandomWord();
          }}
          className="group relative bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 rounded-xl p-6 text-left transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white text-lg">Start Learning</h3>
          </div>
          <p className="text-sm text-purple-200">
            Discover high-frequency words
          </p>
        </button>

        <button
          onClick={() => setCurrentView("review")}
          className="group relative bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-sm border border-pink-500/20 hover:border-pink-400/40 rounded-xl p-6 text-left transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-pink-500/20 rounded-lg group-hover:bg-pink-500/30 transition">
              <TrendingUp className="w-5 h-5 text-pink-400" />
            </div>
            <h3 className="font-semibold text-white text-lg">Daily Review</h3>
          </div>
          <p className="text-sm text-pink-200">
            {reviewWords.length} words waiting
          </p>
        </button>
      </div>

      {/* 最近學習的單字 */}
      {progress.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            Recent Progress
          </h2>
          <div className="space-y-3">
            {progress.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {item.word}
                    </h3>
                    <p className="text-sm text-purple-300">{item.phonetic}</p>
                    <p className="text-purple-200 mt-1">{item.translation}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        item.masteryLevel === "MASTERED"
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : item.masteryLevel === "LEARNING"
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                      }`}
                    >
                      {item.masteryLevel}
                    </span>
                    <p className="text-sm text-purple-300 mt-1">
                      {item.accuracyRate ? `${item.accuracyRate}%` : "0%"}{" "}
                      accuracy
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 如果還沒學習過任何單字 */}
      {progress.length === 0 && (
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-500/20 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Begin Your Journey!
          </h2>
          <p className="text-purple-200 mb-6">
            Click &quot;Start Learning&quot; to build your vocabulary
          </p>
        </div>
      )}
    </div>
  );

  // 學習視圖
  const LearningView = () => {
    if (!currentWord) {
      return (
        <div className="text-center py-20">
          <button
            onClick={loadRandomWord}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
          >
            {loading ? "Loading..." : "Load Word"}
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <button
          onClick={() => setCurrentView("dashboard")}
          className="text-purple-300 mb-6 hover:text-purple-200 transition flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-white mb-3 tracking-tight">
              {currentWord.word}
            </h1>
            <p className="text-2xl text-purple-300 mb-4">
              {currentWord.phonetic}
            </p>
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl p-4 inline-block">
              <p className="text-lg text-purple-100">
                {currentWord.translation}
              </p>
            </div>
          </div>

          {currentWord.definition && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-blue-300 mb-2">
                📝 Definition
              </p>
              <p className="text-blue-100">{currentWord.definition}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => markWord(currentWord.id, "FORGOTTEN", false)}
              disabled={loading}
              className="flex-1 bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-200 py-4 rounded-xl font-semibold hover:from-red-500/30 hover:to-pink-500/30 transition-all disabled:opacity-50 hover:scale-105"
            >
              😵 Don&apos;t Know
            </button>
            <button
              onClick={() => markWord(currentWord.id, "LEARNING")}
              disabled={loading}
              className="flex-1 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-200 py-4 rounded-xl font-semibold hover:from-yellow-500/30 hover:to-orange-500/30 transition-all disabled:opacity-50 hover:scale-105"
            >
              🤔 Learning
            </button>
            <button
              onClick={() => markWord(currentWord.id, "MASTERED", true)}
              disabled={loading}
              className="flex-1 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-200 py-4 rounded-xl font-semibold hover:from-green-500/30 hover:to-emerald-500/30 transition-all disabled:opacity-50 hover:scale-105"
            >
              ✅ Mastered
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 複習視圖
  const ReviewView = () => (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button
        onClick={() => setCurrentView("dashboard")}
        className="text-purple-300 mb-6 hover:text-purple-200 transition flex items-center gap-2"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <RotateCcw className="w-6 h-6 text-purple-400" />
          Words to Review ({reviewWords.length})
        </h2>

        {reviewWords.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-purple-200 text-lg">
              Amazing! No words to review right now
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviewWords.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {item.word}
                    </h3>
                    <p className="text-sm text-purple-300">{item.phonetic}</p>
                    <p className="text-purple-200 mt-1">{item.translation}</p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-semibold ${
                        (item.accuracyRate || 0) >= 70
                          ? "text-green-400"
                          : (item.accuracyRate || 0) >= 50
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {item.accuracyRate || 0}% accuracy
                    </div>
                    <p className="text-xs text-purple-300 mt-1">
                      {item.totalReviews} reviews
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8 pt-24 md:pt-28">
      {/* 頂部導航 */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 text-white p-3 rounded-xl shadow-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">VocabMatrix</h1>
              <p className="text-xs text-purple-200">
                Your Vocabulary Learning Companion
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <div className="max-w-6xl mx-auto mb-4">
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm">
            {error}
          </div>
        </div>
      )}

      {/* 主要內容 */}
      <div className="max-w-6xl mx-auto">
        {currentView === "dashboard" && <DashboardView />}
        {currentView === "learning" && <LearningView />}
        {currentView === "review" && <ReviewView />}
      </div>
    </div>
  );
}

// 統計卡片組件
function StatCard({
  title,
  value,
  icon,
  gradient,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-xl p-4 text-white shadow-lg hover:scale-105 transition-transform`}
    >
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm opacity-90 font-medium">{title}</p>
        <div className="bg-white/20 p-1.5 rounded-lg">{icon}</div>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
