import { useState, useCallback, useRef } from "react";

export interface ProjectPayload {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  metrics?: string;
  role?: string;
}

type Status = "idle" | "loading" | "streaming" | "done" | "error";

const explanationCache = new Map<string, string>();

export function useProjectExplainer() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const explain = useCallback(async (project: ProjectPayload) => {
    // Abort any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setText("");
    setError(null);

    if (explanationCache.has(project.id)) {
      setText(explanationCache.get(project.id)!);
      setStatus("done");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ai/explain-project`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(project),
          signal: controller.signal,
        },
      );

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
      }

      if (!res.body) {
        throw new Error("No response body received");
      }

      setStatus("streaming");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE lines from buffer
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? ""; // keep incomplete last line in buffer

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          const data = line.slice(6).trim();

          if (data === "[DONE]") {
            setStatus("done");
            explanationCache.set(project.id, fullText);
            return;
          }

          if (data.startsWith("[ERROR]")) {
            throw new Error(data.slice(7).trim());
          }

          try {
            const parsed = JSON.parse(data);
            const delta = parsed?.choices?.[0]?.delta?.content;
            if (delta) {
              fullText += delta;
              setText((prev) => prev + delta);
            }
          } catch {
            // Non-JSON SSE line — skip silently
          }
        }
      }

      setStatus("done");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
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

  return { text, status, error, explain, reset };
}
