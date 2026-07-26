import { fetchWithRetry, warmupDatabase } from '@/shared/lib/fetchUtils'

// Mock global fetch
global.fetch = jest.fn()

describe('fetchUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('fetchWithRetry', () => {
    it('returns immediately on a successful 200 response', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
        ok: true,
      })

      const res = await fetchWithRetry('/test')
      expect(res.status).toBe(200)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('retries on 408 response and succeeds', async () => {
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({ status: 408 })
        .mockResolvedValueOnce({ status: 200 })

      const fetchPromise = fetchWithRetry('/test', { retryDelayMs: 100 })
      
      // Fast forward past the retry delay
      await jest.runAllTimersAsync()
      
      const res = await fetchPromise
      expect(res.status).toBe(200)
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it('retries on 500 response and succeeds', async () => {
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({ status: 500 })
        .mockResolvedValueOnce({ status: 200 })

      const fetchPromise = fetchWithRetry('/test', { retryDelayMs: 100 })
      
      await jest.runAllTimersAsync()
      
      const res = await fetchPromise
      expect(res.status).toBe(200)
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it('throws error if max retries are exceeded', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({ status: 500 })

      let caughtError: any = null
      
      const fetchPromise = fetchWithRetry('/test', { maxRetries: 2, retryDelayMs: 100 })
        .catch(e => { caughtError = e })
      
      await jest.runAllTimersAsync()
      await fetchPromise
      
      expect(caughtError?.message).toBe('Server responded with 500')
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it('retries on network failure', async () => {
      ;(global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ status: 200 })

      const fetchPromise = fetchWithRetry('/test', { retryDelayMs: 100 })
      
      await jest.runAllTimersAsync()
      
      const res = await fetchPromise
      expect(res.status).toBe(200)
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('warmupDatabase', () => {
    it('returns true on immediate 200 response', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
        ok: true,
      })

      const res = await warmupDatabase()
      expect(res).toBe(true)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('returns true for other non-500/408 statuses', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 404,
        ok: false,
      })

      const res = await warmupDatabase()
      expect(res).toBe(true)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('retries on 500 response and triggers onRetry callback', async () => {
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({ status: 500 })
        .mockResolvedValueOnce({ status: 200, ok: true })

      const onRetryMock = jest.fn()
      const fetchPromise = warmupDatabase(onRetryMock)
      
      await jest.runAllTimersAsync()
      
      const res = await fetchPromise
      expect(res).toBe(true)
      expect(onRetryMock).toHaveBeenCalledWith(1)
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it('returns false if max retries are exceeded', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network timeout'))

      const fetchPromise = warmupDatabase()
      
      // max retries is 4, so run timers 4 times
      for (let i = 0; i < 4; i++) {
        await jest.runAllTimersAsync()
      }
      
      const res = await fetchPromise
      expect(res).toBe(false)
      expect(global.fetch).toHaveBeenCalledTimes(4)
    })
  })
})
