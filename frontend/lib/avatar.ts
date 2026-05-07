// src/lib/avatar.ts

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const getFullAvatarUrl = (user: {
  username: string;
  nickname?: string;
  avatarUrl: string | null;
}): string => {
  if (!user || !user.avatarUrl || user.avatarUrl.trim() === "") {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.nickname || user?.username || "User",
    )}&background=6366f1&color=fff`;
  }
  if (user.avatarUrl.startsWith("http")) return user.avatarUrl;
  const base = BACKEND_URL.replace(/\/$/, "");
  let path = user.avatarUrl.replace(/^\/?api/, "");
  if (!path.startsWith("/")) path = "/" + path;
  return `${base}${path}`;
};
