// frontend/src/app/notebooks/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { notebookService, NotebookEntry } from "@/services/notebookService";
import { useToast } from "@/app/components/toast/ToastProvider";

export default function NotebookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [cursor, setCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState<{
    show: boolean;
    wordId: number | null;
    word: string;
  }>({ show: false, wordId: null, word: "" });

  const notebookId = Number(params.id);
  const PAGE_SIZE = 10;

  const loadEntries = async () => {
    try {
      setLoading(true);
      const response = await notebookService.getEntries(
        notebookId,
        0,
        PAGE_SIZE,
      );
      const data = response.data ?? [];
      setEntries(data);
      setCursor(data.length > 0 ? data[data.length - 1].id : 0);
      setHasMore(data.length === PAGE_SIZE);
    } catch (error) {
      console.error("載入單字失敗:", error);
      showToast("Failed to load entries. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    try {
      setLoadingMore(true);
      const response = await notebookService.getEntries(
        notebookId,
        cursor,
        PAGE_SIZE,
      );
      const data = response.data ?? [];
      setEntries((prev) => [...prev, ...data]);
      setCursor(data.length > 0 ? data[data.length - 1].id : cursor);
      setHasMore(data.length === PAGE_SIZE);
    } catch (error) {
      console.error("載入更多失敗:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (isNaN(notebookId)) {
      router.push("/notebooks");
      return;
    }
    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notebookId]);

  const handleToggleFavorite = async (entry: NotebookEntry) => {
    const originalState = entry.isFavorite;
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entry.id ? { ...e, isFavorite: !e.isFavorite } : e,
      ),
    );
    try {
      await notebookService.updateEntry(notebookId, entry.word.id, {
        isFavorite: !originalState,
      });
    } catch (error) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id ? { ...e, isFavorite: originalState } : e,
        ),
      );
      console.error("更新失敗:", error);
      showToast("Failed to update favorite. Please try again.", "error");
    }
  };

  const updateMastery = async (wordId: number, level: number) => {
    const entry = entries.find((e) => e.word.id === wordId);
    const originalLevel = entry?.masteryLevel ?? 0;
    setEntries((prev) =>
      prev.map((e) =>
        e.word.id === wordId ? { ...e, masteryLevel: level } : e,
      ),
    );
    try {
      await notebookService.updateEntry(notebookId, wordId, {
        masteryLevel: level,
      });
    } catch (error) {
      setEntries((prev) =>
        prev.map((e) =>
          e.word.id === wordId ? { ...e, masteryLevel: originalLevel } : e,
        ),
      );
      console.error("更新熟悉度失敗:", error);
      showToast("Failed to update mastery level. Please try again.", "error");
    }
  };

  const handleRemoveClick = (wordId: number, word: string) => {
    setRemoveConfirm({ show: true, wordId, word });
  };

  const handleConfirmRemove = async () => {
    const { wordId } = removeConfirm;
    if (!wordId) return;

    const removedEntry = entries.find((e) => e.word.id === wordId);
    if (!removedEntry) return;

    setEntries((prev) => prev.filter((e) => e.word.id !== wordId));
    setRemoveConfirm({ show: false, wordId: null, word: "" });

    try {
      await notebookService.removeVocabulary(notebookId, wordId);
      showToast("Word removed successfully.", "success");
    } catch (error) {
      setEntries((prev) => [...prev, removedEntry]);
      console.error("移除失敗:", error);
      showToast("Failed to remove word. Please try again.", "error");
    }
  };

  const handleCancelRemove = () => {
    setRemoveConfirm({ show: false, wordId: null, word: "" });
  };

  const getMasteryColor = (level: number) => {
    const colors = [
      "bg-gray-700",
      "bg-red-500/60",
      "bg-orange-500/60",
      "bg-yellow-500/60",
      "bg-green-500/60",
      "bg-cyan-500/60",
    ];
    return colors[level] || colors[0];
  };

  const getMasteryLabel = (level: number) => {
    const labels = [
      "Unknown",
      "Seen",
      "Understood",
      "Can use w/ help",
      "Can use actively",
      "Mastered",
    ];
    return labels[level] || labels[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isNaN(notebookId)) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-xl mb-4">Invalid notebook ID</p>
          <button
            onClick={() => router.push("/notebooks")}
            className="text-purple-400 hover:underline"
          >
            Back to Notebooks
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gray-950 text-gray-100 pt-28 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-10 animate-fade-in">
            <button
              onClick={() => router.push("/notebooks")}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-purple-400"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Vocabulary List
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Review and master your words
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {entries.length > 0 ? (
              entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="group relative animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="relative bg-gray-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-purple-500/30 transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {/* 改成 entry.word.word */}
                          <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                            {entry.word.word}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 ml-4">
                        <button
                          onClick={() => handleToggleFavorite(entry)}
                          className={`text-2xl transition-all duration-300 transform hover:scale-125 ${
                            entry.isFavorite
                              ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                              : "text-gray-600"
                          }`}
                        >
                          {entry.isFavorite ? "★" : "☆"}
                        </button>
                        <button
                          onClick={() =>
                            handleRemoveClick(entry.word.id, entry.word.word)
                          }
                          className="text-gray-600 hover:text-red-500 transition-colors p-1"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/5 pt-5">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                        Mastery
                      </span>
                      <div className="flex gap-2">
                        {[0, 1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            onClick={() => updateMastery(entry.word.id, level)}
                            className={`w-10 h-2.5 rounded-full transition-all duration-300 ${
                              entry.masteryLevel >= level
                                ? getMasteryColor(level)
                                : "bg-gray-800"
                            } ${
                              entry.masteryLevel === level
                                ? "ring-2 ring-white scale-y-125"
                                : "hover:bg-gray-700"
                            }`}
                            title={`${getMasteryLabel(level)} (Level ${level})`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 font-mono ml-auto">
                        {getMasteryLabel(entry.masteryLevel)} (Lvl{" "}
                        {entry.masteryLevel})
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 bg-gray-900/20 border-2 border-dashed border-white/5 rounded-3xl">
                <div className="text-5xl mb-4 opacity-20">📂</div>
                <p className="text-gray-500 text-lg">Your notebook is empty.</p>
                <button
                  onClick={() => router.push("/learning")}
                  className="mt-4 text-purple-400 hover:underline"
                >
                  Go find some words to learn!
                </button>
              </div>
            )}
          </div>

          {/* 無限捲動按鈕 */}
          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-2 bg-gray-900 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-all text-sm font-bold disabled:opacity-50"
              >
                {loadingMore ? (
                  <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </div>
      </main>

      {removeConfirm.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/10 rounded-full">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Remove Word</h3>
            </div>
            <p className="text-gray-400 mb-2">
              Are you sure you want to remove{" "}
              <span className="text-purple-400 font-bold">
                &quot;{removeConfirm.word}&quot;
              </span>{" "}
              from this notebook?
            </p>
            <p className="text-gray-500 text-sm mb-8">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelRemove}
                className="flex-1 px-4 py-2.5 bg-gray-800 text-white rounded-lg transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
