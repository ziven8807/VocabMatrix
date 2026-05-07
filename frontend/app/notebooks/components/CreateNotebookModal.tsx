// frontend/src/app/notebooks/components/CreateNotebookModal.tsx

"use client";

import { useState } from "react";
import { useToast } from "@/app/components/toast/ToastProvider";
import { notebookService } from "@/services/notebookService";

interface CreateNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateNotebookModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateNotebookModalProps) {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 驗證
    if (!name.trim()) {
      showToast("Please enter a notebook name", "error");
      return;
    }

    if (name.length > 100) {
      showToast("Name is too long (max 100 characters)", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      await notebookService.createNotebook(
        name.trim(),
        description.trim() || undefined,
      );
      showToast("Notebook created successfully!", "success");

      // 重置表單
      setName("");
      setDescription("");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("建立失敗:", error);
      showToast("Failed to create notebook. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setName("");
      setDescription("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal 內容 */}
      <div className="relative bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-fade-in">
        {/* 標題 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Create New Notebook
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Organize your vocabulary into collections
          </p>
        </div>

        {/* 表單 */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 名稱欄位 */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Notebook Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., TOEFL Vocabulary"
              maxLength={100}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all disabled:opacity-50"
            />
            <div className="mt-1 text-xs text-gray-500 text-right">
              {name.length} / 100
            </div>
          </div>

          {/* 描述欄位 */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes about this collection..."
              rows={3}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none disabled:opacity-50"
            />
          </div>

          {/* 按鈕 */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-white/10 rounded-lg text-gray-300 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Notebook"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
