import { useState, useCallback, useRef } from "react";
import { parseSSEStream } from "@/shared/lib/sse";

type Status = "idle" | "loading" | "streaming" | "done" | "error";

async function fetchDraftInquiryStream(coverLetter: string, signal: AbortSignal) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/draft-inquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ coverLetter }),
    signal,
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  if (!res.body) throw new Error("No response body received");
  return res.body;
}

export function useDraftInquiry() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

   
  const draft = useCallback(async (coverLetter: string, onUpdate?: (chunk: string) => void, retryCount = 0) => {
    // Abort any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setText("");
    setError(null);
    setStatus("loading");

    try {
      const body = await fetchDraftInquiryStream(coverLetter, controller.signal);
      setStatus("streaming");

      let currentText = "";
      await parseSSEStream(body, (delta) => {
        currentText += delta;
        setText(currentText);
        if (onUpdate) onUpdate(delta);
      });
      
      if (currentText.trim() === "") throw new Error("EMPTY_RESPONSE");
      setStatus("done");
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      
      console.error(err);
      
      if (err instanceof Error && err.message === "EMPTY_RESPONSE" && retryCount < 3) {
        // Auto retry after a short delay
         
        setTimeout(() => draft(coverLetter, onUpdate, retryCount + 1), 500);
        return;
      }

      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }, [setError, setStatus, setText]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setText("");
    setStatus("idle");
    setError(null);
  }, [setError, setStatus, setText]);

  return { text, status, error, draft, reset };
}
