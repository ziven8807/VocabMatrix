// frontend/src/app/notebooks/page.tsx

"use client";

import { useState, useEffect } from "react";
import { notebookService, Notebook } from "@/services/notebookService";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/toast/ToastProvider";
import CreateNotebookModal from "./components/CreateNotebookModal";

export default function NotebooksPage() {
  const router = useRouter();
  const { showToast } = useToast();
  useAuth();

  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    id: number | null;
  }>({ show: false, id: null });

  const loadNotebooks = async () => {
    try {
      setIsLoading(true);
      const response = await notebookService.getMyNotebooks();
      if (response && Array.isArray(response.data)) {
        setNotebooks(response.data);
      }
    } catch (error) {
      console.error("載入失敗:", error);
      showToast("Failed to load notebooks", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotebooks();
  }, []);

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDeleteConfirm({ show: true, id });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.id) return;

    try {
      await notebookService.deleteNotebook(deleteConfirm.id);
      showToast("Notebook deleted successfully", "success");
      loadNotebooks();
    } catch (error) {
      console.error("刪除失敗:", error);
      showToast("Failed to delete notebook", "error");
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({ show: false, id: null });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gray-950 text-gray-100 pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-fade-in">
            <div>
              <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                My Notebooks
              </h1>
              <p className="text-gray-400 mt-2">
                Manage your vocabulary collections and track your progress.
              </p>
            </div>

            <button
              onClick={handleCreate}
              className="group relative px-6 py-3 font-bold text-white transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-sm group-hover:blur-md transition-all"></div>
              <div className="relative bg-gray-900 px-6 py-3 rounded-lg border border-purple-500/50 flex items-center gap-2">
                <span className="text-xl">+</span> Create Notebook
              </div>
            </button>
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notebooks.length > 0 ? (
              notebooks.map((notebook, index) => (
                <div
                  key={notebook.id}
                  onClick={() => router.push(`/notebooks/${notebook.id}`)}
                  className="group relative cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* 背景發光效果 */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

                  <div className="relative bg-gray-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl hover:border-purple-500/50 transition-all duration-300 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <svg
                          className="w-6 h-6 text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <button
                        onClick={(e) => handleDeleteClick(e, notebook.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
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

                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {notebook.name}
                    </h3>
                    <p className="text-gray-400 text-sm flex-grow">
                      {notebook.description || "No description provided."}
                    </p>

                    <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
                      <span>
                        Updated:{" "}
                        {new Date(notebook.updatedAt).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-1 bg-white/5 rounded">
                        View Collection →
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl bg-gray-900/20">
                <div className="text-6xl mb-6 opacity-20">📭</div>
                <p className="text-gray-400 text-xl font-medium">
                  No notebooks found.
                </p>
                <p className="text-gray-600 mt-2">
                  Start your journey by creating your first collection.
                </p>
                <button
                  onClick={handleCreate}
                  className="mt-8 text-purple-400 hover:text-purple-300 font-bold transition-colors"
                >
                  + Create One Now
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Modal */}
      <CreateNotebookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadNotebooks}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
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
              <h3 className="text-xl font-bold text-white">Delete Notebook</h3>
            </div>

            <p className="text-gray-400 mb-8">
              Are you sure you want to delete this notebook? This action cannot
              be undone and all vocabulary entries will be removed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-750 text-white rounded-lg transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
