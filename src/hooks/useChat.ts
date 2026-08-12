import { useState, useCallback, useRef } from 'react';
import { parseSSEStream } from '@/shared/lib/sse';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

type Status = 'idle' | 'loading' | 'streaming' | 'error';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Append user message immediately for optimistic UI
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: userMessage.trim() },
    ];
    setMessages(newMessages);
    setError(null);
    setStatus('loading');

    // Placeholder for assistant response — will be updated as stream comes in
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ai/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newMessages }),
          signal: controller.signal,
        },
      );

      if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
      if (!res.body) throw new Error('No response body');

      setStatus('streaming');

      await parseSSEStream(res.body, (delta) => {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: updated[updated.length - 1].content + delta,
          };
          return updated;
        });
      });

      setStatus('idle');
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const message = (err as Error).message;
      setError(message);
      setStatus('error');
      // Replace empty assistant placeholder with error message
      setMessages((prev) => {
        const updated = [...prev];
        if (updated[updated.length - 1].role === 'assistant' && !updated[updated.length - 1].content) {
          updated[updated.length - 1] = { role: 'assistant', content: '' };
        }
        return updated;
      });
    }
  }, [messages]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setStatus('idle');
    setError(null);
  }, []);

  return { messages, status, error, send, reset };
}
