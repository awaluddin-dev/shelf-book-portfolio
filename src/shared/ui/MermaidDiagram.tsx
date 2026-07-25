"use client";

import { useEffect, useRef, useState, useId } from "react";
import { GitBranch } from "lucide-react";

interface MermaidDiagramProps {
  chart: string;
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRendered, setIsRendered] = useState(false);
  const reactId = useId();
  const idRef = useRef(`mermaid-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!ref.current || !chart.trim()) return;
      setError(null);
      setIsRendered(false);

      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            primaryColor: "#0ea5e9",
            primaryTextColor: "#f1f5f9",
            primaryBorderColor: "#0ea5e9",
            lineColor: "#64748b",
            secondaryColor: "#1e293b",
            tertiaryColor: "#0f172a",
            background: "#0f172a",
            mainBkg: "#1e293b",
            nodeBorder: "#334155",
            clusterBkg: "#0f172a",
            titleColor: "#f1f5f9",
            edgeLabelBackground: "#1e293b",
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: "13px",
          },
          flowchart: { curve: "basis", padding: 20 },
          sequence: { diagramMarginX: 20, diagramMarginY: 20 },
        });

        const id = idRef.current;
        const { svg } = await mermaid.render(id, chart.trim());

        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          // Make SVG responsive
          const svgEl = ref.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.width = "100%";
            svgEl.style.height = "auto";
            svgEl.style.maxWidth = "100%";
            svgEl.removeAttribute("height");
          }
          setIsRendered(true);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Failed to render Mermaid diagram.");
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="my-4 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10">
        <p className="text-xs font-mono text-rose-400 flex items-center gap-2">
          <GitBranch size={12} />
          <span className="font-bold">Mermaid Error:</span>
        </p>
        <pre className="text-[10px] text-rose-300 mt-2 whitespace-pre-wrap">{error}</pre>
        <details className="mt-3">
          <summary className="text-[10px] font-mono text-rose-400/70 cursor-pointer">Show source</summary>
          <pre className="mt-2 p-2 bg-black/20 rounded text-[10px] text-zinc-400 whitespace-pre-wrap">{chart}</pre>
        </details>
      </div>
    );
  }

  return (
    <div className="relative my-6 rounded-2xl overflow-hidden border border-white/5 bg-zinc-950/70">
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border-b border-white/5 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
        <GitBranch size={10} className="text-neu-accent" />
        <span className="text-neu-accent">Mermaid Diagram</span>
      </div>
      {/* Loading skeleton */}
      {!isRendered && (
        <div className="absolute inset-0 top-8 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-neu-accent/30 border-t-neu-accent rounded-full animate-spin" />
        </div>
      )}
      {/* Rendered SVG */}
      <div
        ref={ref}
        className={`p-5 overflow-x-auto transition-opacity duration-300 ${isRendered ? "opacity-100" : "opacity-0 min-h-[120px]"}`}
      />
    </div>
  );
}
