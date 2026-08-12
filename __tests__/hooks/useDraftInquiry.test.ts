import { renderHook, act } from '@testing-library/react';
import { useDraftInquiry } from '@/hooks/useDraftInquiry';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

describe('useDraftInquiry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useDraftInquiry());
    expect(result.current.text).toBe('');
    expect(result.current.status).toBe('idle');
    expect(result.current.error).toBeNull();
  });

  it('should reset correctly', () => {
    const { result } = renderHook(() => useDraftInquiry());
    act(() => {
      result.current.reset();
    });
    expect(result.current.text).toBe('');
    expect(result.current.status).toBe('idle');
    expect(result.current.error).toBeNull();
  });

  it('should handle successful stream generation', async () => {
    const mockRead = jest.fn()
      .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Hi"}}]}\n\ndata: [DONE]\n\n') })
      .mockResolvedValueOnce({ done: true });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: mockRead,
        }),
      },
    });

    const { result } = renderHook(() => useDraftInquiry());
    const onUpdate = jest.fn();

    await act(async () => {
      await result.current.draft('test cover letter', onUpdate);
    });

    expect(result.current.text).toBe('Hi');
    expect(result.current.status).toBe('done');
    expect(onUpdate).toHaveBeenCalledWith('Hi');
  });

  it('should handle fetch error', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const { result } = renderHook(() => useDraftInquiry());

    await act(async () => {
      await result.current.draft('test');
    });

    expect(result.current.error).toBe('Request failed: 404 Not Found');
    expect(result.current.status).toBe('error');
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

    const { result } = renderHook(() => useDraftInquiry());

    await act(async () => {
      await result.current.draft('test', undefined, 3);
    });

    expect(result.current.error).toBe('EMPTY_RESPONSE');
    expect(result.current.status).toBe('error');
  });

  it('should handle stream error', async () => {
    const mockRead = jest.fn()
      .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('data: [ERROR] custom error\n\n') })
      .mockResolvedValueOnce({ done: true });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: mockRead,
        }),
      },
    });

    const { result } = renderHook(() => useDraftInquiry());

    await act(async () => {
      await result.current.draft('test');
    });

    expect(result.current.error).toBe('custom error');
    expect(result.current.status).toBe('error');
  });
});
