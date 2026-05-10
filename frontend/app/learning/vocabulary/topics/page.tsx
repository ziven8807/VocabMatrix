// frontend/src/app/learning/vocabulary/topics/page.tsx

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { vocabularyService, Vocabulary } from "@/services/vocabularyService";
import { notebookService, Notebook } from "@/services/notebookService";
import VocabularyCard from "@/app/components/VocabularyCard";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 20;

const Icons = {
  Search: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  Education: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  Technology: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="14" x="3" y="5" rx="2" ry="2" />
      <path d="M7 15h10M12 15v4M9 21h6" />
    </svg>
  ),
  Environment: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 21 2c-1 5-1 7-3 12" />
      <path d="M14 14.7a1.3 1.3 0 1 0-2 0" />
      <path d="M12 21.5V16.5" />
      <path d="M12 21.5c4 0 4-4 4-4" />
    </svg>
  ),
  Society: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Media: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="15" x="2" y="7" rx="2" ry="2" />
      <polyline points="17 2 12 7 7 2" />
    </svg>
  ),
  Government: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 2l10 5H2z" />
    </svg>
  ),
  Work: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Health: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  Globalization: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Economy: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Back: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),
};

const IELTS_CATEGORIES = [
  { id: "Education", label: "Education", icon: <Icons.Education /> },
  { id: "Technology", label: "Technology", icon: <Icons.Technology /> },
  { id: "Environment", label: "Environment", icon: <Icons.Environment /> },
  { id: "Society", label: "Society", icon: <Icons.Society /> },
  { id: "Media", label: "Media & Ad", icon: <Icons.Media /> },
  { id: "Government", label: "Gov & Law", icon: <Icons.Government /> },
  { id: "Work", label: "Work", icon: <Icons.Work /> },
  { id: "Health", label: "Health", icon: <Icons.Health /> },
  { id: "Globalization", label: "Global", icon: <Icons.Globalization /> },
  { id: "Economy", label: "Economy", icon: <Icons.Economy /> },
];

export default function TopicsVocabularyPage() {
  const router = useRouter();

  // ===== 狀態定義 =====
  const [query, setQuery] = useState(""); // 搜尋關鍵字
  const [results, setResults] = useState<Vocabulary[]>([]); // 顯示的單字列表
  const [notebooks, setNotebooks] = useState<Notebook[]>([]); // 使用者的筆記本列表（供 VocabularyCard 使用）
  const [loading, setLoading] = useState(false); // 初次載入或搜尋時的 loading 狀態
  const [loadingMore, setLoadingMore] = useState(false); // 無限捲動載入更多時的 loading 狀態
  const [activeCategory, setActiveCategory] = useState<string | null>(null); // 目前選中的分類 ID
  const [currentPage, setCurrentPage] = useState(0); // 目前分頁（從 0 開始）
  const [hasMore, setHasMore] = useState(false); // 是否還有更多資料可載入

  const [suggestions, setSuggestions] = useState<Vocabulary[]>([]); // 搜尋自動補全建議
  const [showSuggestions, setShowSuggestions] = useState(false); // 是否顯示建議下拉選單

  const dropdownRef = useRef<HTMLDivElement>(null); // 用於偵測點擊下拉選單外部以關閉建議
  const sentinelRef = useRef<HTMLDivElement>(null); // IntersectionObserver 偵測捲到底部的 sentinel element

  // 取得使用者筆記本列表（供 VocabularyCard 新增單字到筆記本使用）
  useEffect(() => {
    notebookService
      .getMyNotebooks()
      .then((res) => {
        const data = res?.data ?? [];
        setNotebooks(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
  }, []);

  // 點擊下拉選單外部時，關閉自動補全建議
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 監聽搜尋輸入，300ms debounce 後觸發自動補全 API
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await vocabularyService.autocomplete(query);
        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Autocomplete failed", error);
      }
    };
    const delayDebounceFn = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // 無限捲動：載入目前分類的下一頁（未選分類或搜尋模式下不觸發）
  const loadMore = useCallback(async () => {
    if (!activeCategory || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await vocabularyService.getByCategory(
        activeCategory,
        nextPage,
        PAGE_SIZE,
      );
      const data: Vocabulary[] = Array.isArray(response.data)
        ? response.data
        : (response.data as { content?: Vocabulary[] }).content ?? [];
      setResults((prev) => [...prev, ...data]);
      setCurrentPage(nextPage);
      setHasMore(data.length === PAGE_SIZE);
    } catch (error) {
      console.error("Load more failed", error);
    } finally {
      setLoadingMore(false);
    }
  }, [activeCategory, currentPage, hasMore, loadingMore]);

  // IntersectionObserver：sentinel element 進入視窗時觸發 loadMore
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  // 執行全局搜尋（不限分類），清除已選分類
  const performSearch = async (searchWord: string) => {
    setLoading(true);
    setShowSuggestions(false);
    setActiveCategory(null);
    setHasMore(false);
    try {
      const response = await vocabularyService.searchWord(searchWord);
      setResults(response.data);
    } catch (error) {
      console.error("Search failed", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) performSearch(query);
  };

  // 點擊分類按鈕：重置所有狀態並載入該分類第 0 頁單字
  const handleCategoryClick = async (categoryId: string) => {
    setLoading(true);
    setActiveCategory(categoryId);
    setQuery("");
    setResults([]);
    setCurrentPage(0);
    setHasMore(false);
    try {
      const response = await vocabularyService.getByCategory(
        categoryId,
        0,
        PAGE_SIZE,
      );
      const data: Vocabulary[] = Array.isArray(response.data)
        ? response.data
        : (response.data as { content?: Vocabulary[] }).content ?? [];
      setResults(data);
      setHasMore(data.length === PAGE_SIZE);
    } catch (error) {
      console.error("Category fetch failed", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* ===== 返回按鈕 + 頁面標題 ===== */}
        <div className="text-center mb-12">
          <button
            onClick={() => router.push("/learning/vocabulary")}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 text-sm"
          >
            <Icons.Back />
            Back to Vocabulary
          </button>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            TOPICS <span className="text-purple-500">VOCABULARY</span>
          </h1>
          <p className="text-gray-500">
            Category-specific words for every IELTS topic.
          </p>
        </div>

        {/* ===== 搜尋框 + 自動補全下拉選單 ===== */}
        <div className="max-w-2xl mx-auto mb-10 relative" ref={dropdownRef}>
          <form onSubmit={handleSearchSubmit} className="relative flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowSuggestions(true)}
              placeholder="Search word (e.g., curriculum)..."
              className="flex-1 bg-gray-900 border border-white/10 rounded-xl px-6 py-4 text-white outline-none focus:border-purple-500 transition-all shadow-inner"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-500/30"
            >
              <Icons.Search />
            </button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-[#151515] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setQuery(item.word);
                    performSearch(item.word);
                  }}
                  className="px-6 py-4 hover:bg-purple-600/20 cursor-pointer border-b border-white/5 last:border-none group transition-colors flex justify-between items-center"
                >
                  <span className="text-gray-200 group-hover:text-white font-medium">
                    {item.word}
                  </span>
                  <span className="text-xs text-gray-500 italic">
                    {item.pos} {item.definitionCn}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== 10 大主題分類按鈕（不含 General） ===== */}
        <div className="mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {IELTS_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all duration-300 h-32 ${
                  activeCategory === cat.id
                    ? "bg-purple-600 border-purple-400 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                    : "bg-gray-900 border-white/5 text-gray-400 hover:border-purple-500/50 hover:text-white"
                }`}
              >
                <div
                  className={
                    activeCategory === cat.id ? "text-white" : "text-purple-500"
                  }
                >
                  {cat.icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ===== 單字卡片列表 + 無限捲動 sentinel ===== */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((vocab) => (
                <VocabularyCard
                  key={vocab.id}
                  vocabulary={vocab}
                  notebooks={notebooks}
                />
              ))}
              {results.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
                  <p className="text-gray-500">
                    Select a topic to explore vocabulary.
                  </p>
                </div>
              )}
            </div>
            <div
              ref={sentinelRef}
              className="h-10 mt-8 flex items-center justify-center"
            >
              {loadingMore && (
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
