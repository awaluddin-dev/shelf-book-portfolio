"use client";

import React, { useEffect, useState } from "react";

import { secureMathRandom } from "@/shared/lib/utils";

type CardZone = "main" | "terminal" | "metrics";

interface MovingNodeProps {
  path: string;
  duration: string;
  label: string;
  textY: string;
  scale?: [number, number];
  circleR?: number;
  cardZone?: CardZone;
  initialColor?: string;
}

const NODE_PALETTE = [
  "#10b981", // emerald
  "#22d3ee", // cyan
  "#fbbf24", // amber
  "#8b5cf6", // purple
  "#f43f5e", // rose
  "#3b82f6", // blue
  "#f97316", // orange
  "#a855f7", // violet
  "#14b8a6", // teal
  "#ec4899", // pink
];

function MovingNode({
  path,
  duration,
  label,
  textY,
  scale,
  circleR = 4,
  cardZone,
  initialColor,
}: Readonly<MovingNodeProps>) {
  // Random color on mount
  const [nodeColor] = useState(() => initialColor || NODE_PALETTE[Math.floor(secureMathRandom() * NODE_PALETTE.length)] || "#05626E");

  // OPSI A hot-zone window: the node "charges" to the accent color while
  // passing behind the cards (SVG center zone), then returns to its
  // identity color. Purely declarative SVG/SMIL animation — no JS involved.
  const HOT_FILL_VALUES = `${nodeColor}; ${nodeColor}; #00FF87; #00FF87; ${nodeColor}; ${nodeColor}`;
  const HOT_KEY_TIMES = "0; 0.35; 0.45; 0.55; 0.65; 1";
  const textYNum = Number(textY);

  return (
    <g
      style={{ "--node-color": nodeColor } as React.CSSProperties}
      transform={scale ? `scale(${scale[0]}, ${scale[1]})` : undefined}
    >
      <g className="circuit-moving-node" data-node-zone={cardZone}>
        <circle r={circleR} fill="var(--node-color)" fillOpacity="0.5">
          <animate
            attributeName="r"
            values={`${circleR}; ${circleR}; ${circleR * 1.5}; ${circleR * 1.5}; ${circleR}; ${circleR}`}
            keyTimes={HOT_KEY_TIMES}
            dur={duration}
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill"
            values={HOT_FILL_VALUES}
            keyTimes={HOT_KEY_TIMES}
            dur={duration}
            repeatCount="indefinite"
          />
        </circle>
        <circle r={circleR * 0.4} fill="#fff" />
        <animateMotion
          dur={duration}
          repeatCount="indefinite"
          rotate="auto"
          path={path}
        />
        <animate
          attributeName="opacity"
          values="0;1;1;0.01;0.01;1;1;0"
          keyTimes="0; 0.1; 0.45; 0.48; 0.52; 0.55; 0.9; 1"
          dur={duration}
          repeatCount="indefinite"
        />
      </g>
      <g>
        <text
          x="0"
          y={textYNum > 0 ? -textYNum + 5 : textYNum}
          transform={scale ? `scale(${scale[0]}, ${scale[1]})` : undefined}
          fill="var(--node-color)"
          fontSize={Math.max(6, circleR * 1.5)}
          fontFamily="monospace"
          fontWeight="bold"
          textAnchor="middle"
          style={{ textShadow: "0 0 3px var(--node-color)" }}
        >
          {label}
          <animate
            attributeName="fill"
            values={HOT_FILL_VALUES}
            keyTimes={HOT_KEY_TIMES}
            dur={duration}
            repeatCount="indefinite"
          />
        </text>
        <animateMotion dur={duration} repeatCount="indefinite" path={path} />
        <animate
          attributeName="opacity"
          values="0;0.9;0.9;0.01;0.01;0.9;0.9;0"
          keyTimes="0; 0.1; 0.45; 0.48; 0.52; 0.55; 0.9; 1"
          dur={duration}
          repeatCount="indefinite"
        />
      </g>
    </g>
  );
}

export const CircuitBoardBg = React.memo(function CircuitBoardBg() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  // Card-reactive glow — TRUE visual hit-testing. We never read the layout
  // of the animated <g> (SMIL doesn't move it). Instead we recompute each
  // node's screen position mathematically: point on path at the current
  // SMIL progress -> getCTM() (includes viewBox + quadrant scale, not the
  // CSS translate) -> + svg.getBoundingClientRect() offset (which DOES
  // include the translate) -> real screen coords. Only a node whose circle
  // actually overlaps a card changes that card's color to the node's color.

  useEffect(() => {
    if (!mounted) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const NS = "http://www.w3.org/2000/svg";
    const pathCache = new Map<string, { elem: SVGPathElement; len: number }>();
    const getPathInfo = (d: string) => {
      let info = pathCache.get(d);
      if (!info) {
        const p = document.createElementNS(NS, "path") as SVGPathElement;
        p.setAttribute("d", d);
        info = { elem: p, len: p.getTotalLength() };
        pathCache.set(d, info);
      }
      return info;
    };

    let rafId: number;
    const tick = () => {
      const nodesSvg = document.getElementById(
        "circuit-nodes-svg",
      ) as SVGSVGElement | null;
      const svgTime = nodesSvg?.getCurrentTime() ?? performance.now() / 1000;
      // svgRect includes the CSS translate (-translate-y-*) that moves the
      // circuit up, while getCTM() maps to the svg viewport WITHOUT it —
      // so we add the rect offset to land on real screen coordinates.
      const svgRect = nodesSvg?.getBoundingClientRect();

      const nodes = document.querySelectorAll<SVGGElement>(
        ".circuit-moving-node",
      );
      const cards = document.querySelectorAll<HTMLElement>("[data-card-zone]");

      // card -> strongest touching node
      const active = new Map<
        HTMLElement,
        { color: string; intensity: number }
      >();

      nodes.forEach((node) => {
        const anim =
          node.querySelector<SVGAnimateMotionElement>("animateMotion");
        if (!anim) return;
        const d = anim.getAttribute("path");
        if (!d) return;
        const dur = Number.parseFloat(anim.getAttribute("dur") ?? "0");
        if (!dur) return;

        let start = 0;
        try {
          start = anim.getStartTime();
        } catch {
          start = 0;
        }
        const progress = ((((svgTime - start) % dur) + dur) % dur) / dur;

        const parentG = node.parentElement as SVGGraphicsElement | null;
        if (!parentG) return;
        const color = parentG.style.getPropertyValue("--node-color");
        if (!color) return;
        const ctm = parentG.getCTM();
        if (!ctm) return;

        // Recompute the node's exact position on screen at this instant
        const pathInfo = getPathInfo(d);
        const pt = pathInfo.elem.getPointAtLength(pathInfo.len * progress);
        const vp = new DOMPoint(pt.x, pt.y).matrixTransform(ctm);
        const screen = {
          x: vp.x + (svgRect?.left ?? 0),
          y: vp.y + (svgRect?.top ?? 0),
        };

  // eslint-disable-next-line sonarjs/no-nested-functions
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const margin = 16; // node radius tolerance — "touching"
          if (
            screen.x < rect.left - margin ||
            screen.x > rect.right + margin ||
            screen.y < rect.top - margin ||
            screen.y > rect.bottom + margin
          ) {
            return;
          }

          // Intensity peaks as the node gets closer to the card center
          const cx = (rect.left + rect.right) / 2;
          const cy = (rect.top + rect.bottom) / 2;
          const maxDist = Math.hypot(
            rect.width / 2 + margin,
            rect.height / 2 + margin,
          );
          const intensity = Math.max(
            0,
            Math.min(1, 1 - Math.hypot(screen.x - cx, screen.y - cy) / maxDist),
          );

          const prev = active.get(card);
          if (!prev || intensity > prev.intensity) {
            active.set(card, { color, intensity });
          }
        });
      });

      cards.forEach((card) => {
        const hit = active.get(card);
        if (hit) {
          const glowAlpha = Math.round(0x60 * hit.intensity)
            .toString(16)
            .padStart(2, "0");
          const insetAlpha = Math.round(0x28 * hit.intensity)
            .toString(16)
            .padStart(2, "0");
          card.style.borderColor = hit.color;
          card.style.boxShadow = `0 0 30px ${hit.color}${glowAlpha}, inset 0 0 20px ${hit.color}${insetAlpha}`;
        } else {
          card.style.borderColor = "";
          card.style.boxShadow = "";
        }
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 top-0 w-[100vw] h-[100vh] pointer-events-none z-0 overflow-hidden"
      style={{
        maskImage:
          "radial-gradient(ellipse at 50% 50%, black 20%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at 50% 50%, black 20%, transparent 75%)",
      }}
    >
      {/* Circuit Board SVG Background Pattern - Centered, Mirrored, Circular */}
      <svg
        id="circuit-board-svg"
        className="absolute inset-0 w-full h-full opacity-40 text-neu-accent pointer-events-none -translate-y-12 md:-translate-y-20 lg:-translate-y-24"
        viewBox="-500 -500 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="chip-colorful-grad" gradientUnits="userSpaceOnUse" x1="-80" y1="-80" x2="80" y2="80">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="25%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="75%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
            <animateTransform attributeName="gradientTransform" type="rotate" from="0 0 0" to="360 0 0" dur="4s" repeatCount="indefinite"/>
          </linearGradient>
        </defs>
                  {/* Quadrant 1 (Bottom Right -> original positive coords) */}
          <g id="circuit-quadrant-1">

            {/* Center Processor Chip (Quarter) - REMOVED for new logo */}

            {/* Chip pins */}
            <path d="M 80,15 L 95,15 M 80,35 L 95,35 M 80,55 L 95,55 M 80,75 L 95,75" stroke="currentColor" strokeWidth="2" />
            <path d="M 15,80 L 15,95 M 35,80 L 35,95 M 55,80 L 55,95 M 75,80 L 75,95" stroke="currentColor" strokeWidth="2" />

            {/* Glowing / Thick Data Buses */}
            <path d="M 95,15 L 150,15 L 200,65 L 350,65 L 400,115 L 500,115" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M 15,95 L 15,150 L 65,200 L 65,350 L 115,400 L 115,500" fill="none" stroke="currentColor" strokeWidth="2.5" />

            {/* Static Traces with pulsing glow */}
            <g>
              <animate attributeName="opacity" values="0.1;1;0.1" dur="4s" repeatCount="indefinite" />
              {/* Standard Traces */}
              <path d="M 95,35 L 130,35 L 180,85 L 280,85 L 330,135 L 500,135" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 95,55 L 110,55 L 160,105 L 250,105 L 300,155 L 450,155 L 500,205" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 95,75 L 105,75 L 140,110 L 220,110 L 270,160 L 350,160 L 400,210 L 500,210" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M 35,95 L 35,130 L 85,180 L 85,280 L 135,330 L 135,500" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 55,95 L 55,110 L 105,160 L 105,250 L 155,300 L 155,450 L 205,500" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M 75,95 L 75,105 L 110,140 L 110,220 L 160,270 L 160,350 L 210,400 L 210,500" fill="none" stroke="currentColor" strokeWidth="1.5" />

              {/* Dense 45-degree corner memory bus */}
              <path d="M 200,200 L 250,250 L 500,250" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.9" />
              <path d="M 190,210 L 240,260 L 500,260" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M 180,220 L 230,270 L 500,270" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M 170,230 L 220,280 L 500,280" fill="none" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.9" />
              <path d="M 160,240 L 210,290 L 500,290" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M 200,200 L 250,150 L 250,0" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.9" />
              <path d="M 210,190 L 260,140 L 260,0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M 220,180 L 270,130 L 270,0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M 230,170 L 280,120 L 280,0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.9" />
              <path d="M 240,160 L 290,110 L 290,0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
            </g>

            {/* Vias (Nodes/Circles) */}
            <circle cx="500" cy="115" r="4" fill="currentColor" />
            <circle cx="115" cy="500" r="4" fill="currentColor" />
            <circle cx="500" cy="155" r="3" fill="currentColor" />
            <circle cx="155" cy="450" r="3" fill="currentColor" />
            <circle cx="280" cy="85" r="2.5" fill="currentColor" />
            <circle cx="85" cy="280" r="2.5" fill="currentColor" />
            <circle cx="200" cy="200" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="200" cy="200" r="1.5" fill="currentColor" />

            {/* Component Blocks */}
            <rect x="320" y="320" width="40" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <rect x="325" y="325" width="30" height="10" fill="currentColor" fillOpacity="0.2" />
            <rect x="300" y="400" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="307.5" cy="407.5" r="3" fill="currentColor" />
            <path d="M 400,320 L 400,280 L 450,230 L 500,230" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
          </g>
          {/* Quadrant 2 (Bottom Left) */}
          <g id="circuit-quadrant-2">

            {/* Center Processor Chip (Quarter) - REMOVED for new logo */}

            {/* Chip pins */}
            <path d="M -80,15 L -95,15 M -80,35 L -95,35 M -80,55 L -95,55 M -80,75 L -95,75" stroke="currentColor" strokeWidth="2" />
            <path d="M -15,80 L -15,95 M -35,80 L -35,95 M -55,80 L -55,95 M -75,80 L -75,95" stroke="currentColor" strokeWidth="2" />

            {/* Glowing / Thick Data Buses */}
            <path d="M -95,15 L -150,15 L -200,65 L -350,65 L -400,115 L -500,115" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M -15,95 L -15,150 L -65,200 L -65,350 L -115,400 L -115,500" fill="none" stroke="currentColor" strokeWidth="2.5" />

            {/* Static Traces with pulsing glow */}
            <g>
              <animate attributeName="opacity" values="0.1;1;0.1" dur="4s" repeatCount="indefinite" />
              {/* Standard Traces */}
              <path d="M -95,35 L -130,35 L -180,85 L -280,85 L -330,135 L -500,135" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M -95,55 L -110,55 L -160,105 L -250,105 L -300,155 L -450,155 L -500,205" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M -95,75 L -105,75 L -140,110 L -220,110 L -270,160 L -350,160 L -400,210 L -500,210" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M -35,95 L -35,130 L -85,180 L -85,280 L -135,330 L -135,500" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M -55,95 L -55,110 L -105,160 L -105,250 L -155,300 L -155,450 L -205,500" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M -75,95 L -75,105 L -110,140 L -110,220 L -160,270 L -160,350 L -210,400 L -210,500" fill="none" stroke="currentColor" strokeWidth="1.5" />

              {/* Dense 45-degree corner memory bus */}
              <path d="M -200,200 L -250,250 L -500,250" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.9" />
              <path d="M -190,210 L -240,260 L -500,260" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M -180,220 L -230,270 L -500,270" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M -170,230 L -220,280 L -500,280" fill="none" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.9" />
              <path d="M -160,240 L -210,290 L -500,290" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M -200,200 L -250,150 L -250,0" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.9" />
              <path d="M -210,190 L -260,140 L -260,0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M -220,180 L -270,130 L -270,0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M -230,170 L -280,120 L -280,0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.9" />
              <path d="M -240,160 L -290,110 L -290,0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
            </g>

            {/* Vias (Nodes/Circles) */}
            <circle cx="-500" cy="115" r="4" fill="currentColor" />
            <circle cx="-115" cy="500" r="4" fill="currentColor" />
            <circle cx="-500" cy="155" r="3" fill="currentColor" />
            <circle cx="-155" cy="450" r="3" fill="currentColor" />
            <circle cx="-280" cy="85" r="2.5" fill="currentColor" />
            <circle cx="-85" cy="280" r="2.5" fill="currentColor" />
            <circle cx="-200" cy="200" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="-200" cy="200" r="1.5" fill="currentColor" />

            {/* Component Blocks */}
            <rect x="-360" y="320" width="40" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <rect x="-355" y="325" width="30" height="10" fill="currentColor" fillOpacity="0.2" />
            <rect x="-315" y="400" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="-307.5" cy="407.5" r="3" fill="currentColor" />
            <path d="M -400,320 L -400,280 L -450,230 L -500,230" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
          </g>
          {/* Quadrant 3 (Top Right) */}
          <g id="circuit-quadrant-3">

            {/* Center Processor Chip (Quarter) - REMOVED for new logo */}

            {/* Chip pins */}
            <path d="M 80,-15 L 95,-15 M 80,-35 L 95,-35 M 80,-55 L 95,-55 M 80,-75 L 95,-75" stroke="currentColor" strokeWidth="2" />
            <path d="M 15,-80 L 15,-95 M 35,-80 L 35,-95 M 55,-80 L 55,-95 M 75,-80 L 75,-95" stroke="currentColor" strokeWidth="2" />

            {/* Glowing / Thick Data Buses */}
            <path d="M 95,-15 L 150,-15 L 200,-65 L 350,-65 L 400,-115 L 500,-115" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M 15,-95 L 15,-150 L 65,-200 L 65,-350 L 115,-400 L 115,-500" fill="none" stroke="currentColor" strokeWidth="2.5" />

            {/* Static Traces with pulsing glow */}
            <g>
              <animate attributeName="opacity" values="0.1;1;0.1" dur="4s" repeatCount="indefinite" />
              {/* Standard Traces */}
              <path d="M 95,-35 L 130,-35 L 180,-85 L 280,-85 L 330,-135 L 500,-135" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 95,-55 L 110,-55 L 160,-105 L 250,-105 L 300,-155 L 450,-155 L 500,-205" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 95,-75 L 105,-75 L 140,-110 L 220,-110 L 270,-160 L 350,-160 L 400,-210 L 500,-210" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M 35,-95 L 35,-130 L 85,-180 L 85,-280 L 135,-330 L 135,-500" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 55,-95 L 55,-110 L 105,-160 L 105,-250 L 155,-300 L 155,-450 L 205,-500" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M 75,-95 L 75,-105 L 110,-140 L 110,-220 L 160,-270 L 160,-350 L 210,-400 L 210,-500" fill="none" stroke="currentColor" strokeWidth="1.5" />

              {/* Dense 45-degree corner memory bus */}
              <path d="M 200,-200 L 250,-250 L 500,-250" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.9" />
              <path d="M 190,-210 L 240,-260 L 500,-260" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M 180,-220 L 230,-270 L 500,-270" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M 170,-230 L 220,-280 L 500,-280" fill="none" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.9" />
              <path d="M 160,-240 L 210,-290 L 500,-290" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M 200,-200 L 250,-150 L 250,0" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.9" />
              <path d="M 210,-190 L 260,-140 L 260,0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M 220,-180 L 270,-130 L 270,0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M 230,-170 L 280,-120 L 280,0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.9" />
              <path d="M 240,-160 L 290,-110 L 290,0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
            </g>

            {/* Vias (Nodes/Circles) */}
            <circle cx="500" cy="-115" r="4" fill="currentColor" />
            <circle cx="115" cy="-500" r="4" fill="currentColor" />
            <circle cx="500" cy="-155" r="3" fill="currentColor" />
            <circle cx="155" cy="-450" r="3" fill="currentColor" />
            <circle cx="280" cy="-85" r="2.5" fill="currentColor" />
            <circle cx="85" cy="-280" r="2.5" fill="currentColor" />
            <circle cx="200" cy="-200" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="200" cy="-200" r="1.5" fill="currentColor" />

            {/* Component Blocks */}
            <rect x="320" y="-340" width="40" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <rect x="325" y="-335" width="30" height="10" fill="currentColor" fillOpacity="0.2" />
            <rect x="300" y="-415" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="307.5" cy="-407.5" r="3" fill="currentColor" />
            <path d="M 400,-320 L 400,-280 L 450,-230 L 500,-230" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
          </g>
          {/* Quadrant 4 (Top Left) */}
          <g id="circuit-quadrant-4">

            {/* Center Processor Chip (Quarter) - REMOVED for new logo */}

            {/* Chip pins */}
            <path d="M -80,-15 L -95,-15 M -80,-35 L -95,-35 M -80,-55 L -95,-55 M -80,-75 L -95,-75" stroke="currentColor" strokeWidth="2" />
            <path d="M -15,-80 L -15,-95 M -35,-80 L -35,-95 M -55,-80 L -55,-95 M -75,-80 L -75,-95" stroke="currentColor" strokeWidth="2" />

            {/* Glowing / Thick Data Buses */}
            <path d="M -95,-15 L -150,-15 L -200,-65 L -350,-65 L -400,-115 L -500,-115" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M -15,-95 L -15,-150 L -65,-200 L -65,-350 L -115,-400 L -115,-500" fill="none" stroke="currentColor" strokeWidth="2.5" />

            {/* Static Traces with pulsing glow */}
            <g>
              <animate attributeName="opacity" values="0.1;1;0.1" dur="4s" repeatCount="indefinite" />
              {/* Standard Traces */}
              <path d="M -95,-35 L -130,-35 L -180,-85 L -280,-85 L -330,-135 L -500,-135" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M -95,-55 L -110,-55 L -160,-105 L -250,-105 L -300,-155 L -450,-155 L -500,-205" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M -95,-75 L -105,-75 L -140,-110 L -220,-110 L -270,-160 L -350,-160 L -400,-210 L -500,-210" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M -35,-95 L -35,-130 L -85,-180 L -85,-280 L -135,-330 L -135,-500" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M -55,-95 L -55,-110 L -105,-160 L -105,-250 L -155,-300 L -155,-450 L -205,-500" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M -75,-95 L -75,-105 L -110,-140 L -110,-220 L -160,-270 L -160,-350 L -210,-400 L -210,-500" fill="none" stroke="currentColor" strokeWidth="1.5" />

              {/* Dense 45-degree corner memory bus */}
              <path d="M -200,-200 L -250,-250 L -500,-250" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.9" />
              <path d="M -190,-210 L -240,-260 L -500,-260" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M -180,-220 L -230,-270 L -500,-270" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M -170,-230 L -220,-280 L -500,-280" fill="none" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.9" />
              <path d="M -160,-240 L -210,-290 L -500,-290" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M -200,-200 L -250,-150 L -250,0" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.9" />
              <path d="M -210,-190 L -260,-140 L -260,0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M -220,-180 L -270,-130 L -270,0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
              <path d="M -230,-170 L -280,-120 L -280,0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.9" />
              <path d="M -240,-160 L -290,-110 L -290,0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
            </g>

            {/* Vias (Nodes/Circles) */}
            <circle cx="-500" cy="-115" r="4" fill="currentColor" />
            <circle cx="-115" cy="-500" r="4" fill="currentColor" />
            <circle cx="-500" cy="-155" r="3" fill="currentColor" />
            <circle cx="-155" cy="-450" r="3" fill="currentColor" />
            <circle cx="-280" cy="-85" r="2.5" fill="currentColor" />
            <circle cx="-85" cy="-280" r="2.5" fill="currentColor" />
            <circle cx="-200" cy="-200" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="-200" cy="-200" r="1.5" fill="currentColor" />

            {/* Component Blocks */}
            <rect x="-360" y="-340" width="40" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <rect x="-355" y="-335" width="30" height="10" fill="currentColor" fillOpacity="0.2" />
            <rect x="-315" y="-415" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="-307.5" cy="-407.5" r="3" fill="currentColor" />
            <path d="M -400,-320 L -400,-280 L -450,-230 L -500,-230" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
          </g>


                {/* NEW Center Chip Custom Logo */}
        <svg x="-60" y="-60" width="120" height="120" viewBox="0 0 1034 1058" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-neu-accent" style={{ overflow: 'visible' }}>
          <g fill="currentColor">
            <path d="M885.854 311.43C915.947 368.12 933 432.81 933 501.488C933 725.446 751.675 907 528 907V816.886C701.97 816.886 843 675.678 843 501.488C843 463.963 836.454 427.968 824.445 394.586C849.648 369.59 869.847 341.119 885.854 311.43ZM885.544 326.691C871.128 351.388 853.687 375.087 832.736 396.462C844.055 429.394 850.2 464.73 850.2 501.488C850.2 677.25 709.821 820.181 535.2 824.014V899.726C751.577 895.88 925.8 719.057 925.8 501.488C925.8 438.769 911.323 379.455 885.544 326.691ZM531.15 105C637.755 105.813 734.557 147.866 806.429 216.013C805.695 216.674 804.955 217.332 804.209 217.985C802.86 219.164 801.492 220.331 800.102 221.483C778.573 243.646 755.972 260.439 734.049 271.93C685.086 229.497 622.925 201.923 554.561 196.208C553.486 194.5 552.434 192.826 551.407 191.192L551.353 191.107C542.671 177.285 535.789 166.331 531.15 162.286V105ZM538.35 159.304C540.726 161.923 543.202 165.324 545.684 168.968C549.16 174.073 553.127 180.391 557.443 187.261H557.444L557.498 187.347L557.501 187.354C557.915 188.012 558.332 188.675 558.753 189.344C625.524 195.677 686.362 222.413 734.968 263.245C754.831 252.232 775.299 236.677 794.941 216.457L795.211 216.178L795.51 215.931C795.553 215.895 795.595 215.858 795.638 215.822C727.341 153.598 637.347 114.86 538.35 112.329V159.304Z" />
            <path d="M149.263 311.43C119.095 368.12 102 432.81 102 501.488C102 725.446 283.772 907 508 907V816.886C333.601 816.886 192.222 675.678 192.222 501.488C192.222 463.963 198.785 427.968 210.824 394.586C185.558 369.59 165.309 341.119 149.263 311.43ZM149.573 326.691C164.025 351.388 181.508 375.087 202.511 396.462C191.165 429.394 185.004 464.73 185.004 501.488C185.004 677.25 325.73 820.181 500.782 824.014V899.726C283.871 895.88 109.218 719.057 109.218 501.488C109.218 438.769 123.73 379.455 149.573 326.691ZM504.842 105C397.974 105.813 300.933 147.866 228.884 216.013C229.619 216.674 230.361 217.332 231.109 217.985C232.461 219.164 233.833 220.331 235.226 221.483C256.809 243.646 279.465 260.439 301.442 271.93C350.526 229.497 412.84 201.923 481.373 196.208C482.451 194.5 483.506 192.826 484.535 191.192L484.589 191.107C493.293 177.285 500.192 166.331 504.842 162.286V105ZM497.624 159.304C495.242 161.923 492.76 165.324 490.272 168.968C486.788 174.073 482.81 180.391 478.484 187.261H478.483L478.429 187.347L478.426 187.354C478.012 188.012 477.593 188.675 477.171 189.344C410.235 195.677 349.247 222.413 300.521 263.245C280.609 252.232 260.091 236.677 240.399 216.457L240.129 216.178L239.829 215.931C239.786 215.895 239.744 215.858 239.701 215.822C308.167 153.598 398.383 114.86 497.624 112.329V159.304Z" />
            <path d="M897.832 37.4869C901.251 35.0187 905.164 34.3158 909.334 35.7026C913.017 36.025 915.67 38.8522 917.469 41.8838C919.469 45.2532 921.083 49.932 922.352 55.5291C924.903 66.7813 926.259 82.6577 925.959 101.592C925.359 139.504 918.113 190.273 899.933 242.002C863.561 345.498 783.14 453.426 624.177 468.982L623.982 469L623.785 468.998C595.649 468.681 574.56 452.44 559.085 429.562C543.643 406.734 533.485 376.908 527.087 348.266L527 347.878V176.804L533.344 184.212C536.158 187.499 539.569 193.697 543.248 200.337L543.296 200.424L543.306 200.445C546.265 205.785 549.524 211.664 553.076 217.322C561.847 231.295 572.422 248.135 584.377 263.501C596.179 278.671 609.102 292.104 622.663 299.918L623.309 300.287L623.496 300.391L623.669 300.517C640.187 312.586 665.368 314.847 694.499 305.936C723.543 297.051 755.991 277.182 786.333 245.922L786.469 245.783L786.618 245.659C840.026 201.354 860.866 134.51 875.269 88.1207C880.323 71.842 884.673 57.7851 889.441 48.4597C891.817 43.8111 894.516 39.8803 897.832 37.4869ZM907.364 42.6583C905.288 41.8783 903.705 42.147 902.051 43.3412C900.139 44.7214 898.076 47.4157 895.862 51.7473C891.447 60.3832 887.295 73.7093 882.155 90.2618C867.845 136.354 846.547 205.226 791.368 251.092C760.38 282.975 726.975 303.549 696.608 312.838C666.379 322.085 638.638 320.272 619.599 306.478C604.611 297.999 590.817 283.527 578.687 267.936C566.474 252.238 555.714 235.093 546.969 221.162C543.279 215.285 539.914 209.207 536.959 203.873L536.945 203.848L536.931 203.821L536.918 203.797C535.962 202.071 535.061 200.447 534.212 198.941V347.075C540.524 375.188 550.405 403.856 565.057 425.516C579.705 447.169 598.814 461.425 623.679 461.776C778.776 446.513 857.344 341.435 893.13 239.607C911.037 188.652 918.159 138.658 918.748 101.479C919.042 82.8678 917.697 67.616 915.318 57.1266C914.123 51.8531 912.715 48.0076 911.269 45.5705C909.734 42.9852 908.741 42.8883 908.632 42.8883H907.977L907.364 42.6583Z" />
            <path d="M137.168 37.4869C133.749 35.0187 129.836 34.3158 125.666 35.7026C121.983 36.025 119.33 38.8522 117.531 41.8838C115.531 45.2532 113.917 49.932 112.648 55.5291C110.097 66.7813 108.741 82.6577 109.041 101.592C109.641 139.504 116.887 190.273 135.067 242.002C171.439 345.498 251.86 453.426 410.823 468.982L411.018 469L411.215 468.998C439.351 468.681 460.44 452.44 475.915 429.562C491.357 406.734 501.515 376.908 507.913 348.266L508 347.878V176.804L501.656 184.212C498.842 187.499 495.431 193.697 491.752 200.337L491.704 200.424L491.694 200.445C488.735 205.785 485.476 211.664 481.924 217.322C473.153 231.295 462.578 248.135 450.623 263.501C438.821 278.671 425.898 292.104 412.337 299.918L411.691 300.287L411.504 300.391L411.331 300.517C394.813 312.586 369.632 314.847 340.501 305.936C311.457 297.051 279.009 277.182 248.667 245.922L248.531 245.783L248.382 245.659C194.974 201.354 174.134 134.51 159.731 88.1207C154.677 71.842 150.327 57.7851 145.559 48.4597C143.183 43.8111 140.484 39.8803 137.168 37.4869ZM127.636 42.6583C129.712 41.8783 131.295 42.147 132.949 43.3412C134.861 44.7214 136.924 47.4157 139.138 51.7473C143.553 60.3832 147.705 73.7093 152.845 90.2618C167.155 136.354 188.453 205.226 243.632 251.092C274.62 282.975 308.025 303.549 338.392 312.838C368.621 322.085 396.362 320.272 415.401 306.478C430.389 297.999 444.183 283.527 456.313 267.936C468.526 252.238 479.286 235.093 488.031 221.162C491.721 215.285 495.086 209.207 498.041 203.873L498.055 203.848L498.069 203.821L498.082 203.797C499.038 202.071 499.939 200.447 500.788 198.941V347.075C494.476 375.188 484.595 403.856 469.943 425.516C455.295 447.169 436.186 461.425 411.321 461.776C256.224 446.513 177.656 341.435 141.87 239.607C123.963 188.652 116.841 138.658 116.252 101.479C115.958 82.8678 117.303 67.616 119.682 57.1266C120.877 51.8531 122.285 48.0076 123.731 45.5705C125.266 42.9852 126.259 42.8883 126.368 42.8883H127.023L127.636 42.6583Z" />
            <path d="M662 673V565H683.916V651.169H731V673H662ZM668.04 667.137H725.114V657.186H677.953V570.786H668.04V667.137Z" />
            <path d="M527 565H548.872V651.091H552.272L565.101 574.257H603.899L616.805 651.091H620.128V565H642V673H599.03L586.355 596.397H582.645L569.97 673H527V565ZM532.951 570.863V667.06H564.56L578.24 590.843H590.76L604.362 667.06H636.049V570.863H626.079V657.031H612.4L598.72 580.737H570.202L556.6 657.031H542.843V570.863H532.951Z" />
            <path d="M440.89 673L425 657.109V580.891L440.89 565H492.11L508 580.891V657.109L492.11 673H440.89ZM451.535 651.169H481.465L486.17 646.463V591.537L481.465 586.831H451.535L446.83 591.537V646.463L451.535 651.169ZM443.976 666.829H489.101L502.06 653.946V583.669L489.101 570.786H443.976L431.094 583.669V653.946L443.976 666.829ZM448.835 656.954L440.967 649.163V588.451L448.835 580.737H484.319L492.11 588.451V649.163L484.319 656.954H448.835Z" />
            <path d="M316 673V580.891L331.966 565H382.034L398 580.891V673H376.144V641.217H337.856V673H316ZM322.2 666.597H332.121V635.431H382.112V666.597H392.11V583.514L379.089 570.631H335.144L322.2 583.514V666.597ZM337.856 619.463H376.144V591.537L371.416 586.831H342.584L337.856 591.537V619.463ZM332.121 625.48V588.297L339.949 580.506H374.284L382.112 588.297V625.48H332.121Z" />
            <path d="M414 586.165L321.165 679L299 656.835L391.835 564L414 586.165ZM309.132 656.834L321.165 668.867L403.867 586.165L391.834 574.132L309.132 656.834Z" />
            <path d="M414 656.835L391.835 679L299 586.165L321.165 564L414 656.835ZM309.132 586.165L391.834 668.867L403.867 656.834L321.165 574.132L309.132 586.165Z" />
            <path d="M0 1045.65H5V1053H7.49316V1058H0V1045.65ZM12.4932 1053V1058H7.49316V1053H12.4932ZM37.4639 1053V1058H32.4639V1053H37.4639ZM52.4492 1053V1058H37.4639V1053H52.4492ZM57.4492 1053V1058H52.4492V1053H57.4492ZM82.4199 1053V1058H77.4199V1053H82.4199ZM97.4062 1053V1058H82.4199V1053H97.4062ZM102.406 1053V1058H97.4062V1053H102.406ZM127.377 1053V1058H122.377V1053H127.377ZM142.362 1053V1058H127.377V1053H142.362ZM147.362 1053V1058H142.362V1053H147.362ZM172.333 1053V1058H167.333V1053H172.333ZM187.318 1053V1058H172.333V1053H187.318ZM192.318 1053V1058H187.318V1053H192.318ZM217.29 1053V1058H212.29V1053H217.29ZM232.275 1053V1058H217.29V1053H232.275ZM237.275 1053V1058H232.275V1053H237.275ZM262.246 1053V1058H257.246V1053H262.246ZM277.231 1053V1058H262.246V1053H277.231ZM282.231 1053V1058H277.231V1053H282.231ZM307.203 1053V1058H302.203V1053H307.203ZM322.188 1053V1058H307.203V1053H322.188ZM327.188 1053V1058H322.188V1053H327.188ZM352.159 1053V1058H347.159V1053H352.159ZM367.145 1053V1058H352.159V1053H367.145ZM372.145 1053V1058H367.145V1053H372.145ZM397.116 1053V1058H392.116V1053H397.116ZM412.102 1053V1058H397.116V1053H412.102ZM417.102 1053V1058H412.102V1053H417.102ZM442.072 1053V1058H437.072V1053H442.072ZM457.058 1053V1058H442.072V1053H457.058ZM462.058 1053V1058H457.058V1053H462.058ZM487.029 1053V1058H482.029V1053H487.029ZM502.015 1053V1058H487.029V1053H502.015ZM507.015 1053V1058H502.015V1053H507.015ZM531.985 1053V1058H526.985V1053H531.985ZM546.971 1053V1058H531.985V1053H546.971ZM551.971 1053V1058H546.971V1053H551.971ZM576.942 1053V1058H571.942V1053H576.942ZM591.928 1053V1058H576.942V1053H591.928ZM596.928 1053V1058H591.928V1053H596.928ZM621.898 1053V1058H616.898V1053H621.898ZM636.884 1053V1058H621.898V1053H636.884ZM641.884 1053V1058H636.884V1053H641.884ZM666.855 1053V1058H661.855V1053H666.855ZM681.841 1053V1058H666.855V1053H681.841ZM686.841 1053V1058H681.841V1053H686.841ZM711.812 1053V1058H706.812V1053H711.812ZM726.797 1053V1058H711.812V1053H726.797ZM731.797 1053V1058H726.797V1053H731.797ZM756.769 1053V1058H751.769V1053H756.769ZM771.754 1053V1058H756.769V1053H771.754ZM776.754 1053V1058H771.754V1053H776.754ZM801.725 1053V1058H796.725V1053H801.725ZM816.71 1053V1058H801.725V1053H816.71ZM821.71 1053V1058H816.71V1053H821.71ZM846.682 1053V1058H841.682V1053H846.682ZM861.667 1053V1058H846.682V1053H861.667ZM866.667 1053V1058H861.667V1053H866.667ZM891.638 1053V1058H886.638V1053H891.638ZM906.623 1053V1058H891.638V1053H906.623ZM911.623 1053V1058H906.623V1053H911.623ZM936.595 1053V1058H931.595V1053H936.595ZM951.58 1053V1058H936.595V1053H951.58ZM956.58 1053V1058H951.58V1053H956.58ZM981.551 1053V1058H976.551V1053H981.551ZM996.536 1053V1058H981.551V1053H996.536ZM1001.54 1053V1058H996.536V1053H1001.54ZM1026.51 1053V1058H1021.51V1053H1026.51ZM1034 1058H1026.51V1053H1029V1045.65H1034V1058ZM0 1001.57H5V1026.26H0V1001.57ZM1034 1026.26H1029V1001.57H1034V1026.26ZM0 957.486H5V982.181H0V957.486ZM1034 982.181H1029V957.486H1034V982.181ZM0 913.403H5V938.098H0V913.403ZM1034 938.098H1029V913.402H1034V938.098ZM0 869.32H5V894.015H0V869.32ZM1034 894.014H1029V869.319H1034V894.014ZM0 825.236H5V849.931H0V825.236ZM1034 849.931H1029V825.236H1034V849.931ZM0 781.153H5V805.848H0V781.153ZM1034 805.848H1029V781.152H1034V805.848ZM0 737.069H5V761.765H0V737.069ZM1034 761.764H1029V737.069H1034V761.764ZM0 692.986H5V717.681H0V692.986ZM1034 717.681H1029V692.986H1034V717.681ZM0 648.903H5V673.598H0V648.903ZM1034 673.598H1029V648.902H1034V673.598ZM0 604.819H5V629.514H0V604.819ZM1034 629.514H1029V604.819H1034V629.514ZM0 560.736H5V585.431H0V560.736ZM1034 585.431H1029V560.736H1034V585.431ZM0 516.653H5V541.348H0V516.653ZM1034 541.348H1029V516.652H1034V541.348ZM0 472.569H5V497.264H0V472.569ZM1034 497.264H1029V472.569H1034V497.264ZM0 428.486H5V453.181H0V428.486ZM1034 453.181H1029V428.486H1034V453.181ZM0 384.402H5V409.098H0V384.402ZM1034 409.097H1029V384.402H1034V409.097ZM0 340.319H5V365.014H0V340.319ZM1034 365.014H1029V340.319H1034V365.014ZM0 296.236H5V320.931H0V296.236ZM1034 320.931H1029V296.236H1034V320.931ZM0 252.152H5V276.848H0V252.152ZM1034 276.847H1029V252.152H1034V276.847ZM0 208.069H5V232.764H0V208.069ZM1034 232.764H1029V208.069H1034V232.764ZM0 163.986H5V188.681H0V163.986ZM1034 188.681H1029V163.985H1034V188.681ZM0 119.902H5V144.598H0V119.902ZM1034 144.597H1029V119.902H1034V144.597ZM0 75.8193H5V100.514H0V75.8193ZM1034 100.514H1029V75.8193H1034V100.514ZM0 31.7363H5V56.4307H0V31.7363ZM1034 56.4297H1029V31.7354H1034V56.4297ZM0 0H12.4922V5H5V12.3477H0V0ZM1034 12.3467H1029V5H1021.51V0H1034V12.3467ZM57.4492 5H32.4639V0H57.4492V5ZM102.405 5H77.4199V0H102.405V5ZM147.362 5H122.377V0H147.362V5ZM192.318 5H167.333V0H192.318V5ZM237.275 5H212.29V0H237.275V5ZM282.231 5H257.246V0H282.231V5ZM327.188 5H302.203V0H327.188V5ZM372.145 5H347.159V0H372.145V5ZM417.102 5H392.116V0H417.102V5ZM462.058 5H437.072V0H462.058V5ZM507.015 5H482.029V0H507.015V5ZM551.971 5H526.985V0H551.971V5ZM596.928 5H571.942V0H596.928V5ZM641.884 5H616.898V0H641.884V5ZM686.841 5H661.855V0H686.841V5ZM731.797 5H706.812V0H731.797V5ZM776.754 5H751.769V0H776.754V5ZM821.71 5H796.725V0H821.71V5ZM866.667 5H841.682V0H866.667V5ZM911.623 5H886.638V0H911.623V5ZM956.58 5H931.595V0H956.58V5ZM1001.54 5H976.551V0H1001.54V5Z" />
            <path d="M889.354 1010.06L870.002 990.704V938H884.568V983.602L895.067 994.05H900.986L911.435 983.602V938H926V990.704L906.648 1010.06H889.354ZM891.362 1006.09H904.692L922.037 988.8V941.86H915.449V985.609L902.016 998.888H894.038L880.605 985.609V941.86H873.965V988.8L891.362 1006.09Z" />
            <path d="M810.779 1010.06V938H857.616V952.566H825.345V966.411H854.065V980.977H825.345V995.491H857.616V1010.06H810.779ZM814.845 1005.94H854.116V999.351H821.485V976.962H850.513V970.374H821.485V948.5H854.116V941.86H814.845V1005.94Z" />
            <path d="M744.947 1010.06V938H787.821L798.424 948.603V999.454L787.821 1010.06H744.947ZM759.513 995.491H780.77L783.909 992.351V955.705L780.77 952.566H759.513V995.491ZM748.962 1006.09H785.814L794.409 997.498V950.61L785.814 942.015H748.962V1006.09ZM755.601 999.454V948.603H782.571L787.821 953.801V994.307L782.571 999.454H755.601Z" />
            <path d="M645.168 1006.2H651.756V948.706H660.712L679.189 1006.09H699.828V941.86H693.24V999.351H684.233L665.859 942.015H645.168V1006.2ZM641.205 1010.06V938H669.153L686.961 995.285H689.174V938H703.74V1010.06H675.792L657.881 952.617H655.771V1010.06H641.205Z" />
            <path d="M586.205 1010.06V995.491H600.308V952.566H586.205V938H628.873V952.566H614.822V995.491H628.873V1010.06H586.205ZM590.168 1006.09H624.961V999.506H610.601V948.5H624.961V941.86H590.168V948.5H604.013V999.506H590.168V1006.09Z" />
            <path d="M520.374 1010.06V938H563.248L573.85 948.603V999.454L563.248 1010.06H520.374ZM534.94 995.491H556.197L559.336 992.351V955.705L556.197 952.566H534.94V995.491ZM524.389 1006.09H561.24L569.836 997.498V950.61L561.24 942.015H524.389V1006.09ZM531.028 999.454V948.603H557.998L563.248 953.801V994.307L557.998 999.454H531.028Z" />
            <path d="M454.026 1010.06V938H496.9L507.503 948.603V999.454L496.9 1010.06H454.026ZM468.592 995.491H489.849L492.988 992.351V955.705L489.849 952.566H468.592V995.491ZM458.041 1006.09H494.893L503.488 997.498V950.61L494.893 942.015H458.041V1006.09ZM464.68 999.454V948.603H491.65L496.9 953.801V994.307L491.65 999.454H464.68Z" />
            <path d="M395.757 1010.06L385.154 999.454V938H399.72V992.351L402.86 995.491H423.962L427.102 992.351V938H441.667V999.454L431.065 1010.06H395.757ZM397.764 1006.09H429.109L437.704 997.55V941.86H431.116V994.359L425.866 999.454H401.007L395.757 994.359V941.86H389.117V997.55L397.764 1006.09Z" />
            <path d="M329.476 1010.06V938H344.041V995.491H375.335V1010.06H329.476ZM333.49 1006.15H371.423V999.506H340.078V941.86H333.49V1006.15Z" />
            <path d="M262.714 1010.06V948.603L273.316 938H306.566L317.168 948.603V1010.06H302.654V988.851H277.228V1010.06H262.714ZM266.831 1005.78H273.419V984.991H306.617V1005.78H313.257V950.353L304.61 941.757H275.427L266.831 950.353V1005.78ZM277.228 974.337H302.654V955.705L299.514 952.566H280.368L277.228 955.705V974.337ZM273.419 978.352V953.544L278.618 948.345H301.419L306.617 953.544V978.352H273.419Z" />
            <path d="M173.762 938H188.327V995.44H190.592L199.136 944.176H224.973L233.569 995.44H235.782V938H250.348V1010.06H221.731L213.29 958.948H210.819L202.379 1010.06H173.762V938ZM177.725 941.912V1006.09H198.776L207.886 955.242H216.224L225.282 1006.09H246.385V941.912H239.745V999.403H230.635L221.525 948.5H202.533L193.474 999.403H184.313V941.912H177.725Z" />
            <path d="M107 1010.06V948.603L117.603 938H150.852L161.454 948.603V1010.06H146.94V988.851H121.514V1010.06H107ZM111.118 1005.78H117.706V984.991H150.903V1005.78H157.543V950.353L148.896 941.757H119.713L111.118 950.353V1005.78ZM121.514 974.337H146.94V955.705L143.8 952.566H124.654L121.514 955.705V974.337ZM117.706 978.352V953.544L122.904 948.345H145.705L150.903 953.544V978.352H117.706Z" />
          </g>
        </svg>


        {/* Fake Lightweight Aura Glow */}
        <rect
          x="-86"
          y="-86"
          width="172"
          height="172"
          fill="none"
          stroke="url(#chip-colorful-grad)"
          strokeOpacity="0.15"
          strokeWidth="8"
        />

        {/* Central processor accent with running colorful border */}
        <rect
          x="-80"
          y="-80"
          width="160"
          height="160"
          fill="currentColor"
          fillOpacity="0.05"
          stroke="url(#chip-colorful-grad)"
          strokeWidth="4"
          strokeDasharray="40 20"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="120;0"
            dur="2s"
            repeatCount="indefinite"
            calcMode="linear"
          />
        </rect>
      </svg>

      {/* Animated Data Nodes Overlay - 100% Opacity, No Vignette Mask */}
      <svg
        id="circuit-nodes-svg"
        className="absolute inset-0 w-full h-full pointer-events-none -translate-y-12 md:-translate-y-20 lg:-translate-y-24"
        viewBox="-500 -500 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Quadrant 1: Top Right (feeds the Connection Terminal card on the right) */}
        <MovingNode
          label="{JSON}"
          textY="-9"
          initialColor="#10b981"
          duration="16s"
          circleR={4}
          cardZone="terminal"
          path="M 500,115 L 400,115 L 350,65 L 200,65 L 150,15 L 95,15 L 150,15 L 200,65 L 350,65 L 400,115 L 500,115"
        />
        <MovingNode
          label="[TENSOR]"
          textY="-10"
          initialColor="#22d3ee"
          duration="22s"
          circleR={5}
          cardZone="terminal"
          path="M 115,500 L 115,400 L 65,350 L 65,200 L 15,150 L 15,95 L 15,150 L 65,200 L 65,350 L 115,400 L 115,500"
        />
        <MovingNode
          label="gRPC"
          textY="-7"
          initialColor="#fbbf24"
          duration="18s"
          circleR={3}
          cardZone="terminal"
          path="M 500,210 L 400,210 L 350,160 L 270,160 L 220,110 L 140,110 L 105,75 L 95,75 L 105,75 L 140,110 L 220,110 L 270,160 L 350,160 L 400,210 L 500,210"
        />

        {/* Quadrant 2: Top Left (feeds the Main card on the left) */}
        <MovingNode
          label="REST"
          textY="-9"
          initialColor="#fbbf24"
          duration="17s"
          circleR={4}
          scale={[-1, 1]}
          cardZone="main"
          path="M 500,115 L 400,115 L 350,65 L 200,65 L 150,15 L 95,15 L 150,15 L 200,65 L 350,65 L 400,115 L 500,115"
        />
        <MovingNode
          label="GraphQL"
          textY="-10"
          initialColor="#22d3ee"
          duration="23s"
          circleR={5}
          scale={[-1, 1]}
          cardZone="main"
          path="M 115,500 L 115,400 L 65,350 L 65,200 L 15,150 L 15,95 L 15,150 L 65,200 L 65,350 L 115,400 L 115,500"
        />
        <MovingNode
          label="Kafka"
          textY="-7"
          initialColor="#8b5cf6"
          duration="19s"
          circleR={3}
          scale={[-1, 1]}
          cardZone="main"
          path="M 500,210 L 400,210 L 350,160 L 270,160 L 220,110 L 140,110 L 105,75 L 95,75 L 105,75 L 140,110 L 220,110 L 270,160 L 350,160 L 400,210 L 500,210"
        />

        {/* Quadrant 3: Bottom Right (emerald — feeds the Metric strip below) */}
        <MovingNode
          label="Redis"
          textY="15"
          initialColor="#10b981"
          duration="15s"
          circleR={4}
          scale={[1, -1]}
          cardZone="metrics"
          path="M 500,115 L 400,115 L 350,65 L 200,65 L 150,15 L 95,15 L 150,15 L 200,65 L 350,65 L 400,115 L 500,115"
        />
        <MovingNode
          label="Docker"
          textY="15"
          initialColor="#f43f5e"
          duration="21s"
          circleR={5}
          scale={[1, -1]}
          cardZone="metrics"
          path="M 115,500 L 115,400 L 65,350 L 65,200 L 15,150 L 15,95 L 15,150 L 65,200 L 65,350 L 115,400 L 115,500"
        />
        <MovingNode
          label="SQL"
          textY="12"
          initialColor="#f43f5e"
          duration="17s"
          circleR={3}
          scale={[1, -1]}
          cardZone="metrics"
          path="M 500,210 L 400,210 L 350,160 L 270,160 L 220,110 L 140,110 L 105,75 L 95,75 L 105,75 L 140,110 L 220,110 L 270,160 L 350,160 L 400,210 L 500,210"
        />

        {/* Quadrant 4: Bottom Left (purple — feeds the Metric strip below) */}
        <MovingNode
          label="OAuth"
          textY="15"
          initialColor="#8b5cf6"
          duration="16.5s"
          circleR={4}
          scale={[-1, -1]}
          cardZone="metrics"
          path="M 500,115 L 400,115 L 350,65 L 200,65 L 150,15 L 95,15 L 150,15 L 200,65 L 350,65 L 400,115 L 500,115"
        />
        <MovingNode
          label="CUDA"
          textY="15"
          initialColor="#22d3ee"
          duration="22.5s"
          circleR={5}
          scale={[-1, -1]}
          cardZone="metrics"
          path="M 115,500 L 115,400 L 65,350 L 65,200 L 15,150 L 15,95 L 15,150 L 65,200 L 65,350 L 115,400 L 115,500"
        />
        <MovingNode
          label="Python"
          textY="12"
          initialColor="#8b5cf6"
          duration="18.5s"
          circleR={3}
          scale={[-1, -1]}
          cardZone="metrics"
          path="M 500,210 L 400,210 L 350,160 L 270,160 L 220,110 L 140,110 L 105,75 L 95,75 L 105,75 L 140,110 L 220,110 L 270,160 L 350,160 L 400,210 L 500,210"
        />
      </svg>
    </div>
  );
});
