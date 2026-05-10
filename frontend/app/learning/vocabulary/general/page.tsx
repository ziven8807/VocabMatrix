// frontend/src/app/learning/vocabulary/general/page.tsx

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { vocabularyService, Vocabulary } from "@/services/vocabularyService";
import { notebookService, Notebook } from "@/services/notebookService";
import VocabularyCard from "@/app/components/VocabularyCard";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 20;

const SearchIcon = () => (
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
);

const BackIcon = () => (
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
);

export default function GeneralVocabularyPage() {
  const router = useRouter();

  // ===== 狀態定義 =====
  const [query, setQuery] = useState(""); // 搜尋關鍵字
  const [results, setResults] = useState<Vocabulary[]>([]); // 顯示的單字列表
  const [notebooks, setNotebooks] = useState<Notebook[]>([]); // 使用者的筆記本列表（供 VocabularyCard 使用）
  const [loading, setLoading] = useState(false); // 初次載入或搜尋時的 loading 狀態
  const [loadingMore, setLoadingMore] = useState(false); // 無限捲動載入更多時的 loading 狀態
  const [currentPage, setCurrentPage] = useState(0); // 目前分頁（從 0 開始）
  const [hasMore, setHasMore] = useState(false); // 是否還有更多資料可載入
  const [suggestions, setSuggestions] = useState<Vocabulary[]>([]); // 搜尋自動補全建議
  const [showSuggestions, setShowSuggestions] = useState(false); // 是否顯示建議下拉選單
  const [isSearchMode, setIsSearchMode] = useState(false); // 是否處於搜尋模式（搜尋模式下不觸發無限捲動）

  const dropdownRef = useRef<HTMLDivElement>(null); // 用於偵測點擊下拉選單外部以關閉建議
  const sentinelRef = useRef<HTMLDivElement>(null); // IntersectionObserver 偵測捲到底部的 sentinel element

  // 進入頁面時，自動載入第 0 頁的 General 分類單字
  useEffect(() => {
    loadGeneralWords(0, true);
  }, []);

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

  // 從 API 載入 General 分類單字
  // reset=true：清空現有結果重新載入（換頁或初始化）
  // reset=false：append 到現有結果（無限捲動）
  const loadGeneralWords = async (page: number, reset: boolean) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);
    try {
      const response = await vocabularyService.getByCategory(
        "General",
        page,
        PAGE_SIZE,
      );
      const data: Vocabulary[] = Array.isArray(response.data)
        ? response.data
        : (response.data as { content?: Vocabulary[] }).content ?? [];
      if (reset) {
        setResults(data);
      } else {
        setResults((prev) => [...prev, ...data]);
      }
      setCurrentPage(page);
      setHasMore(data.length === PAGE_SIZE);
    } catch (error) {
      console.error("Load failed", error);
      if (reset) setResults([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 無限捲動：載入下一頁（搜尋模式下不觸發）
  const loadMore = useCallback(async () => {
    if (isSearchMode || loadingMore || !hasMore) return;
    await loadGeneralWords(currentPage + 1, false);
  }, [isSearchMode, currentPage, hasMore, loadingMore]);

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

  // 執行全局搜尋（不限分類），切換為搜尋模式
  const performSearch = async (searchWord: string) => {
    setLoading(true);
    setShowSuggestions(false);
    setIsSearchMode(true);
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

  // 清除搜尋，回到 General 分類瀏覽模式
  const handleClearSearch = () => {
    setQuery("");
    setIsSearchMode(false);
    loadGeneralWords(0, true);
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
            <BackIcon />
            Back to Vocabulary
          </button>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            GENERAL <span className="text-purple-500">VOCABULARY</span>
          </h1>
          <p className="text-gray-500">
            Core vocabulary used across all IELTS topics.
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
            {isSearchMode && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white px-4 rounded-xl transition-all"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-500/30"
            >
              <SearchIcon />
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
                    Matrix scanning complete. No matches found.
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
