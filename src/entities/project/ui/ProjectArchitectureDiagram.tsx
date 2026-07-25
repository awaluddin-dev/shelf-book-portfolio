"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Network,
  Layers,
  Activity,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  X,
  Move,
  Image as ImageIcon,
} from "lucide-react";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import EmptyState from "@/shared/ui/EmptyState";

// --- Toolbar Controls (must be inside TransformWrapper) ---
function ZoomControls() {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="absolute bottom-4 right-4 z-20 flex gap-2">
      <button
        onClick={() => zoomIn()}
        title="Zoom In"
        className="p-2 rounded-xl bg-neu-bg/80 backdrop-blur-md border border-white/10 text-neu-text hover:text-neu-accent hover:border-neu-accent/40 transition-all duration-200 shadow-neu-sm"
      >
        <ZoomIn size={14} />
      </button>
      <button
        onClick={() => zoomOut()}
        title="Zoom Out"
        className="p-2 rounded-xl bg-neu-bg/80 backdrop-blur-md border border-white/10 text-neu-text hover:text-neu-accent hover:border-neu-accent/40 transition-all duration-200 shadow-neu-sm"
      >
        <ZoomOut size={14} />
      </button>
      <button
        onClick={() => resetTransform()}
        title="Reset View"
        className="p-2 rounded-xl bg-neu-bg/80 backdrop-blur-md border border-white/10 text-neu-text hover:text-neu-accent hover:border-neu-accent/40 transition-all duration-200 shadow-neu-sm"
      >
        <RotateCcw size={14} />
      </button>
    </div>
  );
}

// --- Fullscreen Viewer ---
function FullscreenViewer({
  imageUrl,
  onClose,
}: {
  imageUrl: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          onClose();
        }
      }}
      role="button"
      tabIndex={0}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        <span className="text-xs font-mono text-white/60 flex items-center gap-2">
          <Move size={12} /> Drag to pan • Scroll / Pinch to zoom • Click
          outside to close
        </span>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors border border-white/10"
        >
          <X size={16} />
        </button>
      </div>

      {/* Zoomable Canvas */}
      <div
        className="flex-1 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        <TransformWrapper
          initialScale={1}
          minScale={0.3}
          maxScale={8}
          centerOnInit
          limitToBounds={false}
        >
          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
            <img
              src={imageUrl}
              alt="Architecture Diagram"
              style={{
                maxWidth: "90vw",
                maxHeight: "85vh",
                objectFit: "contain",
              }}
            />
          </TransformComponent>
          <ZoomControls />
        </TransformWrapper>
      </div>
    </motion.div>
  );
}

// --- Image View Mode ---
function ImageView({ imageUrl }: { imageUrl: string }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      {/* Compact Pan/Zoom Canvas */}
      <div
        className="relative rounded-2xl overflow-hidden border border-white/5 bg-zinc-950/50 dark:bg-black/30 group"
        style={{ height: "420px" }}
      >
        {/* Hint overlay */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] font-mono text-white/70 pointer-events-none select-none">
          <Move size={10} /> Drag · Scroll to zoom
        </div>

        {/* Fullscreen button */}
        <button
          onClick={() => setIsFullscreen(true)}
          title="Open Fullscreen"
          className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-black/60 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <Maximize2 size={13} />
        </button>

        <TransformWrapper
          initialScale={1}
          minScale={0.3}
          maxScale={10}
          centerOnInit
          limitToBounds={false}
          wheel={{ step: 0.1 }}
        >
          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%", cursor: "grab" }}
            contentStyle={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={imageUrl}
              alt="Architecture Diagram"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                userSelect: "none",
                pointerEvents: "none",
              }}
              draggable={false}
            />
          </TransformComponent>
          <ZoomControls />
        </TransformWrapper>
      </div>

      {/* Fullscreen Portal */}
      <AnimatePresence>
        {isFullscreen && (
          <FullscreenViewer
            imageUrl={imageUrl}
            onClose={() => setIsFullscreen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// --- Legacy Node View Mode ---
function NodeView({
  nodes,
}: {
  nodes: any[];
}) {
  const [hoveredNode, setHoveredNode] = useState<any | null>(null);

  return (
    <>
      {/* Horizontal scrollable node pipeline */}
      <div className="w-full relative py-8 overflow-x-auto hide-scrollbar">
        <div className="flex items-center min-w-max gap-4 px-4 pb-8">
          {nodes.map((node, idx) => (
            <div key={node.id} className="flex items-center">
              <div
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`relative cursor-pointer transition-all duration-300 rounded-2xl p-5 w-48 shrink-0 flex flex-col items-center text-center 
                  ${hoveredNode?.id === node.id ? "glass-card border-neu-accent scale-105" : "glass-card-inset border-transparent hover:border-white/10"}`}
                style={{ borderWidth: "2px" }}
              >
                <div
                  className={`p-3 rounded-xl mb-3 ${hoveredNode?.id === node.id ? "bg-neu-accent/20 text-neu-accent" : "bg-black/5 dark:bg-white/5 text-neu-text"}`}
                >
                  <Layers size={24} />
                </div>
                <h5 className="font-bold text-neu-text text-sm mb-1">
                  {node.name}
                </h5>
                <p className="text-[10px] font-mono text-neu-text-muted line-clamp-2">
                  {node.title}
                </p>

                {hoveredNode?.id === node.id && (
                  <div className="absolute -inset-1 border-2 border-neu-accent/30 rounded-2xl animate-pulse -z-10" />
                )}
              </div>

              {idx < nodes.length - 1 && (
                <div className="w-12 h-[2px] bg-neu-text-muted/30 shrink-0 relative flex items-center mx-1">
                  <div className="absolute right-0 w-2 h-2 border-t-2 border-r-2 border-neu-text-muted/30 rotate-45 transform translate-x-1" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hover detail panel */}
      <div className="mt-2 p-5 rounded-2xl glass-card relative min-h-[96px] flex flex-col justify-center border border-white/5">
        {hoveredNode ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
          >
            <div className="md:col-span-3">
              <span className="text-xs font-mono text-neu-accent font-bold uppercase tracking-wider block mb-1">
                Node: {hoveredNode.name}
              </span>
              <h5 className="text-sm font-bold text-neu-text font-display">
                {hoveredNode.title}
              </h5>
              <p className="text-xs text-neu-text-muted mt-1 leading-relaxed font-light">
                {hoveredNode.description}
              </p>
            </div>
            <div className="p-3 rounded-xl glass-card-inset text-center md:col-span-1 border border-white/5 flex flex-col justify-center items-center gap-1 h-full">
              <span className="text-[9px] font-mono text-neu-text-muted block uppercase flex items-center gap-1">
                <Activity size={10} /> KPI Performance
              </span>
              <span className="text-xs font-mono font-bold text-neu-accent block">
                {hoveredNode.metrics}
              </span>
            </div>
          </motion.div>
        ) : (
          <p className="text-xs font-mono text-neu-text-muted text-center italic flex items-center justify-center gap-2">
            <Layers size={14} /> Hover over any component node to inspect
            technical metrics.
          </p>
        )}
      </div>
    </>
  );
}

// --- Main Component ---
export default function ProjectArchitectureDiagram({
  project,
}: {
  project: any;
}) {
  const [nodes, setNodes] = useState<any[]>([]);
  const hasImage = !!project?.architectureImage;
  const [loading, setLoading] = useState(!hasImage);

  useEffect(() => {
    if (hasImage) return;
    fetch("/api/architecture")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        const arr = data.data || data;
        const projectNodes = (Array.isArray(arr) ? arr : [])
          .filter((n: any) => n.projectId === project?.id)
          .sort((a: any, b: any) => a.order - b.order);
        setNodes(projectNodes);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err); // NOSONAR: We explicitly log this network error for admin debugging
        setLoading(false);
      });
  }, [project?.id, hasImage]);

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center text-neu-text-muted animate-pulse">
        Loading Architecture...
      </div>
    );
  }

  const showEmptyState = !hasImage && nodes.length === 0;

  return (
    <div className="mb-10 p-6 md:p-8 rounded-3xl glass-card-inset border border-gray-300/10 relative overflow-hidden transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <div>
          <h4 className="text-sm font-mono font-bold text-neu-accent uppercase tracking-wider flex items-center gap-2">
            <Network size={14} /> System Architecture
          </h4>
          <p className="text-xs font-mono text-neu-text-muted mt-1">
            {hasImage
              ? "Drag to pan · Scroll or pinch to zoom · Click ⛶ for fullscreen."
              : "Hover over nodes to inspect technical details and orchestration patterns."}
          </p>
        </div>
        {hasImage && (
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-neu-accent/70 border border-neu-accent/20 px-2.5 py-1 rounded-lg bg-neu-accent/5">
            <ImageIcon size={10} /> Excalidraw Export
          </span>
        )}
      </div>

      {showEmptyState ? (
        <EmptyState message="No architecture diagram defined for this project. Upload an Excalidraw export or add architecture nodes via the Admin panel." />
      ) : hasImage ? (
        <ImageView imageUrl={project.architectureImage} />
      ) : (
        <NodeView nodes={nodes} />
      )}
    </div>
  );
}
