// frontend/src/lib/tokenManager.ts

/**
 * Token 管理器 - 統一管理 Access Token
 * 使用記憶體存儲,避免 XSS 攻擊
 */

class TokenManager {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken() {
    this.token = null;
  }

  // 從 Token 解析 userId
  getUserId(): number | null {
    if (!this.token) return null;
    try {
      const payload = this.parseJwt(this.token);
      return payload?.userId || payload?.sub || null;
    } catch (e) {
      console.error("解析 userId 失敗:", e);
      return null;
    }
  }

  // JWT 解析工具
  private parseJwt(token: string) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }
}

export const tokenManager = new TokenManager();
