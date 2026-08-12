import { useCallback, useRef } from "react";
import { usePortfolioStore } from "@/shared/store/portfolioStore";
import { parseSSEStream } from "@/shared/lib/sse";

export function useCoverLetter() {
  const { 
    coverLetterText: text, 
    setCoverLetterText: setText,
    coverLetterStatus: status,
    setCoverLetterStatus: setStatus,
    coverLetterError: error,
    setCoverLetterError: setError
  } = usePortfolioStore();

  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (jobDescription: string, retryCount = 0) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setText("");
    setError(null);
    setStatus("loading");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/cover-letter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
      }

      if (!res.body) throw new Error("No response body received");

      setStatus("streaming");

      let currentText = "";
      await parseSSEStream(res.body, (delta) => {
        currentText += delta;
        setText(currentText);
      });
      
      if (currentText.trim() === "") throw new Error("EMPTY_RESPONSE");
      setStatus("done");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      
      if ((err as Error).message === "EMPTY_RESPONSE" && retryCount < 3) {
        // Auto retry after a short delay
        setTimeout(() => generate(jobDescription, retryCount + 1), 500);
        return;
      }
      
      setError((err as Error).message);
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setText("");
    setStatus("idle");
    setError(null);
  }, []);

  return { text, status, error, generate, reset };
}
