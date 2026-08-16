export function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.codePointAt(0)?.toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error: unknown) {
    console.error("Failed to parse JWT", error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = parseJwt(token);
  if (!decoded?.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  // Add a 10 seconds buffer
  return decoded.exp < (currentTime + 10);
}

export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return false;

  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (!res.ok) {
      return false;
    }

    const data = await res.json();
    const newToken = data.data?.access_token || data.access_token;
    const newRefreshToken = data.data?.refresh_token || data.refresh_token;

    if (newToken) {
      localStorage.setItem('token', newToken);
      if (newRefreshToken) {
        localStorage.setItem('refresh_token', newRefreshToken);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to refresh token', error);
    return false;
  }
}
