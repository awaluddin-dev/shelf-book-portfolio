"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useChat } from "@/hooks/useChat";
import { usePortfolioStore } from "@/shared/store/portfolioStore";

const SUGGESTED_QUESTIONS = [
  "What is his tech stack?",
  "Tell me about his work experience",
  "What projects has he built?",
  "Is he available for hire?",
];

const MAX_CHAT_LENGTH = 500;

export function ChatWidget() {
  const { isChatOpen, setIsChatOpen } = usePortfolioStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { messages, status, error, send, reset } = useChat();

  const isActive = status === "loading" || status === "streaming";
  const hasMessages = messages.length > 0;

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    setInput("");
    send(trimmed);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Jangan update state jika panjang karakter melebihi batas
    if (value.length <= MAX_CHAT_LENGTH) {
      setInput(value);
    }
  };

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
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
        <div className="fixed bottom-0 left-0 right-0 z-[60] flex h-[85vh] w-full flex-col rounded-t-2xl border border-subtle bg-card shadow-2xl shadow-black/80 sm:bottom-28 sm:left-auto sm:right-6 sm:h-[520px] sm:w-[420px] sm:rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl border-b border-subtle bg-canvas px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-canvas border border-subtle">
                <SparkleIcon className="h-3.5 w-3.5 text-status" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">
                  Ask about Awaluddin
                </p>
                <p className="text-xs text-muted">
                  Answers based on his portfolio data
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {hasMessages && (
                <button
                  type="button"
                  onClick={handleReset}
                  title="Clear conversation"
                  className="rounded p-1.5 text-muted transition-colors hover:text-primary"
                >
                  <ResetIcon className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close chat"
                className="rounded p-1.5 text-muted transition-colors hover:text-primary"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {!hasMessages && (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-muted text-center">
                  Ask me anything about Awaluddin&apos;s experience, skills, or
                  availability.
                </p>
                <div className="space-y-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      type="button"
                      key={q}
                      onClick={() => handleSuggestedQuestion(q)}
                      className="w-full rounded-lg border border-subtle/60 bg-canvas px-3 py-2 text-left text-xs text-secondary transition-colors hover:border-subtle-hover hover:bg-canvas hover:text-primary"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i as number}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-tr-sm bg-brand text-canvas font-medium"
                      : "rounded-tl-sm bg-canvas border border-subtle/50 text-primary"
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
                  {msg.role === "assistant" &&
                    i === messages.length - 1 &&
                    status === "streaming" &&
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
          <div className="border-t border-subtle/60 p-3 bg-canvas">
            <div className="flex items-end gap-2 rounded-xl border border-subtle/60 bg-card px-3 py-2 focus-within:border-subtle-hover">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                rows={1}
                maxLength={MAX_CHAT_LENGTH}
                disabled={isActive}
                className="flex-1 resize-none bg-transparent text-sm text-primary placeholder-muted outline-none disabled:opacity-50"
                style={{ maxHeight: "80px" }}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isActive}
                aria-label="Send message"
                className="mb-0.5 flex-shrink-0 rounded-lg p-1.5 text-brand transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
              >
                <SendIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between px-1">
              <p className="text-[10px] text-muted">
                Only answers questions about Awaluddin
              </p>
              <span
                className={`text-xs ${input.length >= MAX_CHAT_LENGTH ? "text-red-400 font-semibold" : "text-muted"}`}
              >
                {input.length}/{MAX_CHAT_LENGTH}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Inline icons ──────────────────────────────────────────────────────────────

function SparkleIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      <path d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  );
}

function CloseIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function SendIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}

function ResetIcon({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}
