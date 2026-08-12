import { parseJwt, isTokenExpired, refreshAccessToken } from '@/shared/lib/auth';

const createMockToken = (payload: any) => {
  if (typeof btoa === 'undefined') {
    global.btoa = (str: string) => Buffer.from(str).toString('base64');
  }
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const data = btoa(JSON.stringify(payload));
  const signature = 'signature';
  return `${header}.${data}.${signature}`;
};

const originalFetch = global.fetch;

describe('auth lib', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  describe('parseJwt', () => {
    it('should parse valid JWT', () => {
      const payload = { userId: 1, name: 'Test' };
      const token = createMockToken(payload);
      expect(parseJwt(token)).toEqual(payload);
    });

    it('should return null for invalid token', () => {
      expect(parseJwt('invalid-token')).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('should return true for invalid token', () => {
      expect(isTokenExpired('invalid-token')).toBe(true);
    });

    it('should return true if token is expired', () => {
      const expiredToken = createMockToken({ exp: Math.floor(Date.now() / 1000) - 100 });
      expect(isTokenExpired(expiredToken)).toBe(true);
    });

    it('should return true if token expires within buffer (10s)', () => {
      const expiringToken = createMockToken({ exp: Math.floor(Date.now() / 1000) + 5 });
      expect(isTokenExpired(expiringToken)).toBe(true);
    });

    it('should return false if token is valid and not expiring soon', () => {
      const validToken = createMockToken({ exp: Math.floor(Date.now() / 1000) + 1000 });
      expect(isTokenExpired(validToken)).toBe(false);
    });

    it('should return true if token has no exp claim', () => {
      const noExpToken = createMockToken({ userId: 1 });
      expect(isTokenExpired(noExpToken)).toBe(true);
    });
  });

  describe('refreshAccessToken', () => {
    it('should return false if no refresh token in localStorage', async () => {
      const result = await refreshAccessToken();
      expect(result).toBe(false);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should refresh token and update localStorage on success (nested data)', async () => {
      localStorage.setItem('refresh_token', 'old-refresh');
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            access_token: 'new-access',
            refresh_token: 'new-refresh'
          }
        })
      });

      const result = await refreshAccessToken();
      
      expect(result).toBe(true);
      expect(localStorage.getItem('token')).toBe('new-access');
      expect(localStorage.getItem('refresh_token')).toBe('new-refresh');
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: 'old-refresh' })
      });
    });

    it('should refresh token and update localStorage on success (flat data)', async () => {
      localStorage.setItem('refresh_token', 'old-refresh');
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          access_token: 'new-access',
          refresh_token: 'new-refresh'
        })
      });

      const result = await refreshAccessToken();
      
      expect(result).toBe(true);
      expect(localStorage.getItem('token')).toBe('new-access');
      expect(localStorage.getItem('refresh_token')).toBe('new-refresh');
    });

    it('should handle response without new refresh token', async () => {
      localStorage.setItem('refresh_token', 'old-refresh');
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          access_token: 'new-access'
        })
      });

      const result = await refreshAccessToken();
      
      expect(result).toBe(true);
      expect(localStorage.getItem('token')).toBe('new-access');
      expect(localStorage.getItem('refresh_token')).toBe('old-refresh');
    });

    it('should return false if response is not ok', async () => {
      localStorage.setItem('refresh_token', 'old-refresh');
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false
      });

      const result = await refreshAccessToken();
      expect(result).toBe(false);
    });

    it('should return false and log error on network error', async () => {
      localStorage.setItem('refresh_token', 'old-refresh');
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await refreshAccessToken();
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });
});
