import { useState, useCallback, useRef } from "react";
import { parseSSEStream } from "@/shared/lib/sse";

type Status = "idle" | "loading" | "streaming" | "done" | "error";

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/draft-inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter }),
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
        if (onUpdate) onUpdate(delta);
      });
      
      if (currentText.trim() === "") throw new Error("EMPTY_RESPONSE");
      setStatus("done");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      
      if ((err as Error).message === "EMPTY_RESPONSE" && retryCount < 3) {
        // Auto retry after a short delay
        setTimeout(() => draft(coverLetter, onUpdate, retryCount + 1), 500);
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

  return { text, status, error, draft, reset };
}
