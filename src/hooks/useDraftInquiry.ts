import { useState, useCallback, useRef } from "react";

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

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let currentText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();

          if (data === "[DONE]") {
            if (currentText.trim() === "") throw new Error("EMPTY_RESPONSE");
            setStatus("done");
            return;
          }
          if (data.startsWith("[ERROR]")) {
            throw new Error(data.slice(7).trim());
          }

          try {
            const parsed = JSON.parse(data);
            const delta = parsed?.choices?.[0]?.delta?.content;
            if (delta) {
              currentText += delta;
              setText(currentText);
              if (onUpdate) onUpdate(delta);
            }
          } catch (e) {
            /* non-JSON SSE line */
          }
        }
      }
      
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
