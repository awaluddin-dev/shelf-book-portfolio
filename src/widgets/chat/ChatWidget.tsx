'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useChat } from '@/hooks/useChat';
import { usePortfolioStore } from '@/shared/store/portfolioStore';

const SUGGESTED_QUESTIONS = [
  'What is his tech stack?',
  'Tell me about his work experience',
  'What projects has he built?',
  'Is he available for hire?',
];

export function ChatWidget() {
  const { isChatOpen, setIsChatOpen } = usePortfolioStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { messages, status, error, send, reset } = useChat();

  const isActive = status === 'loading' || status === 'streaming';
  const hasMessages = messages.length > 0;

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isChatOpen]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isActive) return;
    setInput('');
    send(trimmed);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSuggestedQuestion(q: string) {
    send(q);
  }

  function handleClose() {
    setIsChatOpen(false);
  }

  function handleReset() {
    reset();
  }

  return (
    <>
      {/* Chat panel */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-4 z-[60] flex h-[520px] w-[360px] flex-col rounded-2xl border border-white/10 bg-[#0d0d0d] shadow-2xl shadow-black/50 sm:right-6 sm:bottom-28">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                <SparkleIcon className="h-3.5 w-3.5 text-white/70" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/90">Ask about Awaluddin</p>
                <p className="text-xs text-white/35">Answers based on his portfolio data</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {hasMessages && (
                <button
                  onClick={handleReset}
                  title="Clear conversation"
                  className="rounded p-1.5 text-white/30 transition-colors hover:text-white/60"
                >
                  <ResetIcon className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={handleClose}
                aria-label="Close chat"
                className="rounded p-1.5 text-white/30 transition-colors hover:text-white/60"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {!hasMessages && (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-white/40 text-center">
                  Ask me anything about Awaluddin&apos;s experience, skills, or availability.
                </p>
                <div className="space-y-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSuggestedQuestion(q)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-white/60 transition-colors hover:border-white/20 hover:bg-white/8 hover:text-white/80"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-tr-sm bg-white text-black'
                      : 'rounded-tl-sm bg-white/8 text-white/80'
                  }`}
                >
                  {msg.content || (
                    // Loading pulse for empty assistant placeholder
                    <span className="flex items-center gap-1 text-white/30">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40" />
                    </span>
                  )}
                  {/* Streaming cursor on last assistant message */}
                  {msg.role === 'assistant' &&
                    i === messages.length - 1 &&
                    status === 'streaming' &&
                    msg.content && (
                      <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-white/50 align-middle" />
                    )}
                </div>
              </div>
            ))}

            {error && (
              <p className="text-center text-xs text-red-400">{error}</p>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-white/10 p-3">
            <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                rows={1}
                disabled={isActive}
                className="flex-1 resize-none bg-transparent text-sm text-white/80 placeholder-white/25 outline-none disabled:opacity-50"
                style={{ maxHeight: '80px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isActive}
                aria-label="Send message"
                className="mb-0.5 flex-shrink-0 rounded-lg p-1.5 text-white/40 transition-colors hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <SendIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-white/20">
              Only answers questions about Awaluddin
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// ── Inline icons ──────────────────────────────────────────────────────────────

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      <path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}

function ResetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}
