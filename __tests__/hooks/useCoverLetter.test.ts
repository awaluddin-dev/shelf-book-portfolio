import { renderHook, act } from '@testing-library/react';
import { useCoverLetter } from '@/hooks/useCoverLetter';
import { usePortfolioStore } from '@/shared/store/portfolioStore';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

// Mock the store
jest.mock('@/shared/store/portfolioStore', () => ({
  usePortfolioStore: jest.fn(),
}));

describe('useCoverLetter', () => {
  const mockSetCoverLetterText = jest.fn();
  const mockSetCoverLetterStatus = jest.fn();
  const mockSetCoverLetterError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (usePortfolioStore as unknown as jest.Mock).mockReturnValue({
      coverLetterText: '',
      setCoverLetterText: mockSetCoverLetterText,
      coverLetterStatus: 'idle',
      setCoverLetterStatus: mockSetCoverLetterStatus,
      coverLetterError: null,
      setCoverLetterError: mockSetCoverLetterError,
    });
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useCoverLetter());
    expect(result.current.text).toBe('');
    expect(result.current.status).toBe('idle');
    expect(result.current.error).toBeNull();
  });

  it('should reset correctly', () => {
    const { result } = renderHook(() => useCoverLetter());
    act(() => {
      result.current.reset();
    });
    expect(mockSetCoverLetterText).toHaveBeenCalledWith('');
    expect(mockSetCoverLetterStatus).toHaveBeenCalledWith('idle');
    expect(mockSetCoverLetterError).toHaveBeenCalledWith(null);
  });

  it('should handle successful stream generation', async () => {
    const mockRead = jest.fn()
      .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Hello"}}]}\n\ndata: [DONE]\n\n') })
      .mockResolvedValueOnce({ done: true });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: mockRead,
        }),
      },
    });

    const { result } = renderHook(() => useCoverLetter());

    await act(async () => {
      await result.current.generate('test job');
    });

    expect(mockSetCoverLetterStatus).toHaveBeenCalledWith('loading');
    expect(mockSetCoverLetterStatus).toHaveBeenCalledWith('streaming');
    expect(mockSetCoverLetterText).toHaveBeenCalledWith('Hello');
    expect(mockSetCoverLetterStatus).toHaveBeenCalledWith('done');
  });

  it('should handle fetch error', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const { result } = renderHook(() => useCoverLetter());

    await act(async () => {
      await result.current.generate('test job');
    });

    expect(mockSetCoverLetterError).toHaveBeenCalledWith('Request failed: 500 Internal Server Error');
    expect(mockSetCoverLetterStatus).toHaveBeenCalledWith('error');
  });

  it('should handle empty response error', async () => {
    const mockRead = jest.fn()
      .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('data: [DONE]\n\n') })
      .mockResolvedValueOnce({ done: true });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: mockRead,
        }),
      },
    });

    const { result } = renderHook(() => useCoverLetter());

    await act(async () => {
      await result.current.generate('test job', 3);
    });

    expect(mockSetCoverLetterError).toHaveBeenCalledWith('EMPTY_RESPONSE');
    expect(mockSetCoverLetterStatus).toHaveBeenCalledWith('error');
  });

  it('should handle streaming error event', async () => {
    const mockRead = jest.fn()
      .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('data: [ERROR] Some error occurred\n\n') })
      .mockResolvedValueOnce({ done: true });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: mockRead,
        }),
      },
    });

    const { result } = renderHook(() => useCoverLetter());

    await act(async () => {
      await result.current.generate('test job');
    });

    expect(mockSetCoverLetterError).toHaveBeenCalledWith('Some error occurred');
    expect(mockSetCoverLetterStatus).toHaveBeenCalledWith('error');
  });
});
