import { isTokenExpired, refreshAccessToken } from "./auth";

export interface FetchOptions extends RequestInit {
  maxRetries?: number;
  retryDelayMs?: number;
  headers?: HeadersInit;
}

/**
 * Enhanced fetch that retries on 408 (Timeout) and 5xx (Server Error) responses.
 * Essential for handling serverless/free-tier database cold starts.
 */
export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {},
): Promise<Response> {
  const { maxRetries = 3, retryDelayMs = 4000, ...fetchOptions } = options;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(url, fetchOptions);

      // If the database is waking up, the API might timeout (408) or throw a 5xx error
      if (response.status === 408 || response.status >= 500) {
        throw new Error(`Server responded with ${response.status}`);
      }

      return response;
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) {
        throw error;
      }
      // Wait before retrying
      await new Promise((res) => setTimeout(res, retryDelayMs));
    }
  }

  throw new Error("Max retries reached");
}

/**
 * Pings the backend health endpoint to ensure the database is awake.
 * Returns true if successful, throws if it fails after all retries.
 */
export async function warmupDatabase(
  onRetry?: (attempt: number) => void,
): Promise<boolean> {
  let attempt = 0;
  const maxRetries = 4;

  while (attempt < maxRetries) {
    try {
      // The health endpoint checks Prisma connection to the DB
      const res = await fetch("/api/health");
      if (res.ok) {
        return true;
      }
      if (res.status === 408 || res.status >= 500) {
        throw new Error("Cold start timeout");
      }
      return true; // Any other response means API is up
    } catch (error) {
      console.warn("DB warmup attempt failed:", error);
      attempt++;
      if (attempt >= maxRetries) {
        return false;
      }
      if (onRetry) onRetry(attempt);
      await new Promise((res) => setTimeout(res, 3500));
    }
  }

  return false;
}

/**
 * Authenticated fetch for admin operations with automatic token refresh.
 */
export async function fetchWithAuth(
  url: string,
  options: FetchOptions = {},
): Promise<Response> {
  let token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 1. Cek apakah token expired sebelum menembak API
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

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response = await fetch(url, { ...options, headers });

  // 2. Jika 401 Unauthorized, coba refresh token 1 kali
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      token = localStorage.getItem("token");
      const retryHeaders = new Headers(headers);
      if (token) {
        retryHeaders.set("Authorization", `Bearer ${token}`);
      }
      response = await fetch(url, { ...options, headers: retryHeaders });
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
