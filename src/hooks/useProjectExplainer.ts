import { useState, useCallback, useRef } from "react";
import { parseSSEStream } from "@/shared/lib/sse";

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

      let fullText = "";
      await parseSSEStream(res.body, (delta) => {
        fullText += delta;
        setText((prev) => prev + delta);
      });
      explanationCache.set(project.id, fullText);

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
