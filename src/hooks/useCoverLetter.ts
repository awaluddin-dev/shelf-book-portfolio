import { useCallback, useRef } from "react";
import { usePortfolioStore } from "@/shared/store/portfolioStore";
import { parseSSEStream } from "@/shared/lib/sse";

async function fetchCoverLetterStream(
  jobDescription: string,
  signal: AbortSignal,
) {
  const res = await fetch(`/api/ai/cover-letter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobDescription }),
    signal,
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  if (!res.body) throw new Error("No response body received");
  return res.body;
}

export function useCoverLetter() {
  const {
    coverLetterText: text,
    setCoverLetterText: setText,
    coverLetterStatus: status,
    setCoverLetterStatus: setStatus,
    coverLetterError: error,
    setCoverLetterError: setError,
  } = usePortfolioStore();

  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(
    async function generateReq(jobDescription: string, retryCount = 0) {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setText("");
      setError(null);
      setStatus("loading");

      try {
        const body = await fetchCoverLetterStream(
          jobDescription,
          controller.signal,
        );
        setStatus("streaming");

        let currentText = "";
        await parseSSEStream(body, (delta) => {
          currentText += delta;
          setText(currentText);
        });

        if (currentText.trim() === "") throw new Error("EMPTY_RESPONSE");
        setStatus("done");
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;

        console.error(err);

        if (
          err instanceof Error &&
          err.message === "EMPTY_RESPONSE" &&
          retryCount < 3
        ) {
          // Auto retry after a short delay

          setTimeout(() => generateReq(jobDescription, retryCount + 1), 500);
          return;
        }

        setError(err instanceof Error ? err.message : String(err));
        setStatus("error");
      }
    },
    [setError, setStatus, setText],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setText("");
    setStatus("idle");
    setError(null);
  }, [setError, setStatus, setText]);

  return { text, status, error, generate, reset };
}
