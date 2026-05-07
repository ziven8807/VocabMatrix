// frontend/src/app/rank/page.tsx

"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { getFullAvatarUrl } from "@/lib/avatar";

// 排行榜單筆資料格式
interface LeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  nickname: string;
  avatarUrl: string | null;
  correctCount: number;
  durationSeconds: number;
  completedAt: string;
}

// ── SVG：第一名皇冠 ──
const CrownIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
    <path
      d="M3 14h14l2-8-5 3-4-6-4 6-5-3 2 8z"
      fill="#facc15"
      stroke="#facc15"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
);

// ── SVG：時鐘（完成時間用）──
const ClockIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
    <circle cx="10" cy="10" r="7" stroke="#6b7280" strokeWidth="1.5" />
    <path
      d="M10 6v4l3 2"
      stroke="#6b7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// 秒數格式化成 mm:ss
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// 名次對應的文字顏色樣式
const rankStyle = (rank: number) => {
  if (rank === 1) return "text-yellow-400 font-black";
  if (rank === 2) return "text-gray-300 font-black";
  if (rank === 3) return "text-amber-600 font-black";
  return "text-gray-600 font-bold";
};

// 頭像元件
const Avatar = ({
  avatarUrl,
  nickname,
  username,
}: {
  avatarUrl: string | null;
  nickname: string;
  username: string;
}) => {
  const fullUrl = getFullAvatarUrl({ username, nickname, avatarUrl });

  return (
    <img
      src={fullUrl}
      alt={nickname || username}
      className="w-10 h-10 rounded-full object-cover border border-white/10"
      onError={(e) => {
        (
          e.target as HTMLImageElement
        ).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          nickname || username,
        )}&background=6366f1&color=fff`;
      }}
    />
  );
};

export default function RankPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await api.get<LeaderboardEntry[]>(
          "/contest/leaderboard/weekly",
        );
        setEntries(res.data);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-16 pt-24">
      <div className="max-w-2xl mx-auto">
        {/* 頁面標題 */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            RANK
          </h1>
          <p className="text-gray-500">
            Weekly leaderboard · Resets every Monday
          </p>
        </div>

        {/* 排行榜內容 */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-gray-900/50 border border-white/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg font-bold mb-2">
              No results this week
            </p>
            <p className="text-gray-700 text-sm">Be the first to play!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.userId}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  entry.rank === 1
                    ? "bg-yellow-500/5 border-yellow-500/20"
                    : entry.rank === 2
                    ? "bg-gray-400/5 border-gray-500/20"
                    : entry.rank === 3
                    ? "bg-amber-700/5 border-amber-700/20"
                    : "bg-gray-900/50 border-white/5"
                }`}
              >
                {/* 名次，第一名顯示皇冠 SVG */}
                <div
                  className={`w-8 text-center text-lg ${rankStyle(entry.rank)}`}
                >
                  {entry.rank === 1 ? <CrownIcon /> : `#${entry.rank}`}
                </div>

                {/* 頭像 */}
                <Avatar
                  avatarUrl={entry.avatarUrl}
                  nickname={entry.nickname}
                  username={entry.username}
                />

                {/* 名字 + username */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold truncate">
                    {entry.nickname || entry.username}
                  </p>
                  <p className="text-gray-600 text-xs truncate">
                    @{entry.username}
                  </p>
                </div>

                {/* 分數 + 完成時間 */}
                <div className="text-right shrink-0">
                  <p className="text-white font-black text-lg">
                    {entry.correctCount}
                    <span className="text-gray-600 text-sm font-normal">
                      {" "}
                      / 10
                    </span>
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <ClockIcon />
                    <span className="text-gray-500 text-xs font-mono">
                      {formatTime(entry.durationSeconds)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
