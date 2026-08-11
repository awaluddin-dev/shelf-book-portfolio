import { renderHook, act } from '@testing-library/react';
import { useProjectExplainer } from '@/hooks/useProjectExplainer';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

describe('useProjectExplainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useProjectExplainer());
    expect(result.current.text).toBe('');
    expect(result.current.status).toBe('idle');
    expect(result.current.error).toBeNull();
  });

  it('should reset correctly', () => {
    const { result } = renderHook(() => useProjectExplainer());
    act(() => {
      result.current.reset();
    });
    expect(result.current.text).toBe('');
    expect(result.current.status).toBe('idle');
    expect(result.current.error).toBeNull();
  });

  it('should handle successful stream explanation and caching', async () => {
    const mockRead = jest.fn()
      .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Explained"}}]}\n\ndata: [DONE]\n\n') })
      .mockResolvedValueOnce({ done: true });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: mockRead,
        }),
      },
    });

    const { result } = renderHook(() => useProjectExplainer());
    const project = { id: 'p1', title: 'T', description: 'D', tech_stack: ['A'] };

    await act(async () => {
      await result.current.explain(project);
    });

    expect(result.current.text).toBe('Explained');
    expect(result.current.status).toBe('done');

    // Should use cache on second call
    await act(async () => {
      await result.current.explain(project);
    });
    expect(global.fetch).toHaveBeenCalledTimes(1); // not called again
  });

  it('should handle fetch error', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
    });

    const { result } = renderHook(() => useProjectExplainer());

    await act(async () => {
      await result.current.explain({ id: 'p2', title: 'T', description: 'D', tech_stack: [] });
    });

    expect(result.current.error).toBe('Request failed: 400 Bad Request');
    expect(result.current.status).toBe('error');
  });

  it('should handle missing body error', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: null,
    });

    const { result } = renderHook(() => useProjectExplainer());

    await act(async () => {
      await result.current.explain({ id: 'p3', title: 'T', description: 'D', tech_stack: [] });
    });

    expect(result.current.error).toBe('No response body received');
    expect(result.current.status).toBe('error');
  });

  it('should handle stream error', async () => {
    const mockRead = jest.fn()
      .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('data: [ERROR] stream err\n\n') })
      .mockResolvedValueOnce({ done: true });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: mockRead,
        }),
      },
    });

    const { result } = renderHook(() => useProjectExplainer());

    await act(async () => {
      await result.current.explain({ id: 'p4', title: 'T', description: 'D', tech_stack: [] });
    });

    expect(result.current.error).toBe('stream err');
    expect(result.current.status).toBe('error');
  });
});
