const processSSELine = (
  line: string,
  onDelta: (delta: string) => void,
  onDone?: () => void
): boolean => {
  if (!line.startsWith("data: ")) return false;
  const data = line.slice(6).trim();

  if (data === "[DONE]") {
    if (onDone) onDone();
    return true; // indicates done
  }
  
  if (data.startsWith("[ERROR]")) {
    throw new Error(data.slice(7).trim());
  }

  try {
    const parsed = JSON.parse(data);
    const delta = parsed?.choices?.[0]?.delta?.content;
    if (delta) {
      onDelta(delta);
    }
  } catch {
    /* non-JSON SSE line */
  }
  return false;
};

export async function parseSSEStream(
  body: ReadableStream<Uint8Array>,
  onDelta: (delta: string) => void,
  onDone?: () => void
) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const isDone = processSSELine(line, onDelta, onDone);
      if (isDone) return;
    }
  }
  
  if (onDone) onDone();
}
