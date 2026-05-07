// frontend/src/components/VocabularyCard.tsx

"use client";

import { useState } from "react";
import { notebookService } from "@/services/notebookService";
import { AxiosError } from "axios";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/app/components/toast/ToastProvider";

interface Vocabulary {
  id: number; // definitionId
  wordId: number; // 新增：收藏時用這個
  word: string;
  definitionEn: string;
  definitionCn?: string;
  pos?: string;
}

interface Notebook {
  id: number;
  name: string;
}

interface Props {
  vocabulary: Vocabulary;
  notebooks: Notebook[];
}

interface ErrorResponse {
  message: string;
  status: number;
  error: string;
}

export default function VocabularyCard({ vocabulary, notebooks }: Props) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [selectedNotebook, setSelectedNotebook] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToNotebook = async () => {
    if (!selectedNotebook) return;
    try {
      setIsAdding(true);
      // 改成傳 wordId，不是 definitionId
      await notebookService.addVocabulary(selectedNotebook, vocabulary.wordId);
      showToast(`Success! Added "${vocabulary.word}" to notebook.`, "success");
      setSelectedNotebook(null);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errMsg = axiosError.response?.data?.message || "Addition failed";
      showToast(
        errMsg.includes("already in notebook")
          ? "Already in this notebook!"
          : errMsg,
        "error",
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group relative animate-fade-in">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500"></div>

      <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col h-full">
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
              {vocabulary.word}
            </h3>
            {vocabulary.pos && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-widest font-bold">
                {vocabulary.pos}
              </span>
            )}
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-gray-300 line-clamp-2">
              {vocabulary.definitionEn}
            </p>
            {vocabulary.definitionCn && (
              <p className="text-gray-500 text-sm italic">
                {vocabulary.definitionCn}
              </p>
            )}
          </div>
        </div>

        {user && (
          <div className="mt-auto pt-4 border-t border-white/5 space-y-3">
            <div className="relative">
              <select
                className="w-full bg-gray-950/50 border border-white/10 text-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                value={selectedNotebook || ""}
                onChange={(e) =>
                  setSelectedNotebook(Number(e.target.value) || null)
                }
                disabled={isAdding}
              >
                <option value="" className="bg-gray-900">
                  Add to Notebook...
                </option>
                {notebooks.map((nb) => (
                  <option
                    key={nb.id}
                    value={nb.id}
                    className="bg-gray-900 text-white"
                  >
                    {nb.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-2.5 pointer-events-none text-gray-500">
                ▼
              </div>
            </div>

            <button
              onClick={handleAddToNotebook}
              disabled={!selectedNotebook || isAdding}
              className="w-full relative group/btn disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-sm opacity-50 group-hover/btn:opacity-100 transition"></div>
              <div className="relative bg-gray-900 text-white font-bold py-2 rounded-lg border border-white/10 flex items-center justify-center gap-2 transition-transform active:scale-95">
                {isAdding ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Collect"
                )}
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
