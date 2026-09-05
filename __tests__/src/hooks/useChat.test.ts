import { renderHook, act } from "@testing-library/react";
import { useChat } from "@/hooks/useChat";
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

const originalFetch = global.fetch;
const originalAbortController = global.AbortController;

describe("useChat", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    process.env.API_URL = "http://localhost:3000";
  });

  afterEach(() => {
    global.fetch = originalFetch;
    global.AbortController = originalAbortController;
    jest.clearAllMocks();
  });

  it("should have initial state", () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.messages).toEqual([]);
    expect(result.current.status).toBe("idle");
    expect(result.current.error).toBeNull();
  });

  it("should ignore empty messages", async () => {
    const { result } = renderHook(() => useChat());
    await act(async () => {
      await result.current.send("   ");
    });
    expect(result.current.messages).toEqual([]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should handle successful stream", async () => {
    const mockRead = jest
      .fn()
      .mockResolvedValueOnce({
        done: false,
        value: new TextEncoder().encode(
          'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n',
        ),
      })
      .mockResolvedValueOnce({
        done: false,
        value: new TextEncoder().encode(
          'data: {"choices":[{"delta":{"content":" World"}}]}\n\n',
        ),
      })
      .mockResolvedValueOnce({
        done: false,
        value: new TextEncoder().encode("data: [DONE]\n\n"),
      })
      .mockResolvedValueOnce({ done: true, value: undefined });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: mockRead,
        }),
      },
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.send("Hi");
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.messages).toEqual([
      { role: "user", content: "Hi" },
      { role: "assistant", content: "Hello World" },
    ]);
  });

  it("should handle API error", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.send("Hi");
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toBe(
      "Request failed: 500 Internal Server Error",
    );
  });

  it("should handle missing response body", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      body: null,
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.send("Hi");
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toBe("No response body");
  });

  it("should handle stream error data format", async () => {
    const mockRead = jest
      .fn()
      .mockResolvedValueOnce({
        done: false,
        value: new TextEncoder().encode(
          "data: [ERROR] Something went wrong\n\n",
        ),
      })
      .mockResolvedValueOnce({ done: true, value: undefined });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: mockRead,
        }),
      },
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.send("Hi");
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toBe("Something went wrong");
  });

  it("should abort ongoing request when sending new message", async () => {
    const mockAbort = jest.fn();
    const mockController = jest.fn().mockImplementation(() => ({
      abort: mockAbort,
      signal: {},
    }));
    global.AbortController = mockController as any;

    const mockRead = jest.fn().mockImplementation(() => new Promise(() => {})); // Never resolves

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: mockRead,
        }),
      },
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      result.current.send("First");
    });

    await act(async () => {
      result.current.send("Second");
    });

    expect(mockAbort).toHaveBeenCalledTimes(1);
  });

  it("should handle AbortError gracefully", async () => {
    global.fetch = jest.fn().mockRejectedValue({
      name: "AbortError",
      message: "Aborted",
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.send("Hi");
    });

    expect(result.current.status).not.toBe("error");
  });

  it("should handle non-AbortError network errors", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network failed"));

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.send("Hi");
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toBe("Network failed");
  });

  it("should handle invalid JSON in stream", async () => {
    const mockRead = jest
      .fn()
      .mockResolvedValueOnce({
        done: false,
        value: new TextEncoder().encode("data: invalid-json\n\n"),
      })
      .mockResolvedValueOnce({ done: true, value: undefined });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: mockRead,
        }),
      },
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.send("Hi");
    });

    expect(result.current.status).toBe("idle");
  });

  it("should clear messages on reset", async () => {
    const { result } = renderHook(() => useChat());

    await act(async () => {
      result.current.reset();
    });

    expect(result.current.messages).toEqual([]);
    expect(result.current.status).toBe("idle");
    expect(result.current.error).toBeNull();
  });
});
