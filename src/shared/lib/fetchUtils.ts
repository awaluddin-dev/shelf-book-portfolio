import { isTokenExpired, refreshAccessToken } from "./auth";

const API_BASE_URL = process.env.API_URL || "https://sb.awaluddin.dev";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Helper untuk memastikan request mengarah ke backend jika berupa path relatif
function resolveUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${API_BASE_URL}${cleanPath}`;
}

export async function fetchWithAuth(url: string, options: FetchOptions = {}) {
  const targetUrl = resolveUrl(url);
  let token = localStorage.getItem("token");

  // 1. Cek apakah token sudah expired sebelum menembak API
  if (token && isTokenExpired(token)) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      token = localStorage.getItem("token");
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("isAdmin");
      window.location.href = "/admin/login";
      throw new Error("Session expired. Please login again.");
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let response = await fetch(targetUrl, { ...options, headers });

  // 2. Jika backend mengembalikan 401 Unauthorized, coba refresh token 1 kali
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      token = localStorage.getItem("token");
      const retryHeaders = {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      response = await fetch(targetUrl, { ...options, headers: retryHeaders });
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("isAdmin");
      window.location.href = "/admin/login";
      throw new Error("Session expired. Please login again.");
    }
  }

  return response;
}
