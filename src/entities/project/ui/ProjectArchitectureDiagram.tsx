"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  X,
  Move,
} from "lucide-react";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";

// --- Toolbar Controls ---
function ZoomControls() {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="absolute bottom-4 right-4 z-20 flex gap-2">
      <button
        type="button"
        onClick={() => zoomIn()}
        title="Zoom In"
        className="p-2 rounded-xl bg-neu-bg/80 backdrop-blur-md border border-white/10 text-neu-text hover:text-neu-accent hover:border-neu-accent/40 transition-all duration-200 shadow-neu-sm"
      >
        <ZoomIn size={14} />
      </button>
      <button
        type="button"
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
}: Readonly<{
  imageUrl: string;
  onClose: () => void;
}>) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.stopPropagation();
        }}
      >
        <span className="text-xs font-mono text-white/60 flex items-center gap-2">
          <Move size={12} /> Drag to pan • Scroll / Pinch to zoom • Click outside to close
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors border border-white/10"
        >
          <X size={16} />
        </button>
      </div>

      <div
        className="flex-1 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.stopPropagation();
        }}
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
              className={imageUrl.toLowerCase().endsWith('.svg') ? 'dark:invert dark:hue-rotate-180 transition-all duration-300' : ''}
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

// --- Main Component ---
export default function ProjectArchitectureDiagram({
  imageUrl,
}: {
  imageUrl: string;
  project?: any; // Kept for backwards compatibility if passed, though unused
  isDark?: boolean; // Kept for backwards compatibility if passed, though unused
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!imageUrl) return null;

  return (
    <>
      <div className="w-full h-full relative rounded-2xl overflow-hidden group">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] font-mono text-white/70 pointer-events-none select-none">
          <Move size={10} /> Drag · Scroll to zoom
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsFullscreen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setIsFullscreen(true);
          }}
          title="Open Fullscreen"
          className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-black/60 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <Maximize2 size={13} />
        </div>

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
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={imageUrl}
              alt="Architecture Diagram"
              className={imageUrl.toLowerCase().endsWith('.svg') ? 'dark:invert dark:hue-rotate-180 transition-all duration-300' : ''}
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
