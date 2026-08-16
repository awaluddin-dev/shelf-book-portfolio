import { useState, useCallback, useRef } from 'react';
import { parseSSEStream } from '@/shared/lib/sse';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

type Status = 'idle' | 'loading' | 'streaming' | 'error';

async function fetchChatStream(
  messages: ChatMessage[],
  signal: AbortSignal,
  onStart: () => void,
  onChunk: (delta: string) => void
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  });

  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  if (!res.body) throw new Error('No response body');

  onStart();
  await parseSSEStream(res.body, onChunk);
}

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

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: userMessage.trim() },
    ];
    setMessages([...newMessages, { role: 'assistant', content: '' }]);
    setError(null);
    setStatus('loading');

    try {
      await fetchChatStream(
        newMessages,
        controller.signal,
        () => setStatus('streaming'),
        (delta) => {
          setMessages((prev) => {
            const updated = [...prev];
            const lastMsg = updated.at(-1);
            if (lastMsg) {
              updated[updated.length - 1] = {
                role: 'assistant',
                content: lastMsg.content + delta,
              };
            }
            return updated;
          });
        }
      );
      setStatus('idle');
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setError((err as Error).message);
      setStatus('error');
      setMessages((prev) => {
        const updated = [...prev];
        const lastMsg = updated.at(-1);
        if (lastMsg?.role === 'assistant' && !lastMsg.content) {
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
