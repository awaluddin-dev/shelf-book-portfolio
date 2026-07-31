"use client";

import { useEffect, useState, useRef } from "react";

const COLORS = ['#10b981', '#22d3ee', '#fbbf24', '#f43f5e', '#8b5cf6', '#00FF87'];

function MovingNode({ path, duration, initialColor, label, textY, scale, circleR = 4 }: any) {
  const [color, setColor] = useState(initialColor);
  const animRef = useRef<SVGAnimateMotionElement>(null);

  useEffect(() => {
    const el = animRef.current;
    if (!el) return;
    const handleRepeat = () => {
      const nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      setColor(nextColor);
    };
    el.addEventListener('repeatEvent', handleRepeat);
    return () => el.removeEventListener('repeatEvent', handleRepeat);
  }, []);

  return (
    <g 
      style={{ '--node-color': color } as React.CSSProperties}
      transform={scale ? `scale(${scale[0]}, ${scale[1]})` : undefined}
    >
      <g className="circuit-moving-node">
        <circle r={circleR} fill="var(--node-color)" fillOpacity="0.5">
          <animate attributeName="r" values={`${circleR}; ${circleR}; ${circleR * 1.5}; ${circleR * 1.5}; ${circleR}; ${circleR}`} keyTimes="0; 0.35; 0.45; 0.55; 0.65; 1" dur={duration} repeatCount="indefinite" />
        </circle>
        <circle r={circleR * 0.4} fill="#fff" />
        <animateMotion ref={animRef} dur={duration} repeatCount="indefinite" rotate="auto" path={path} />
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
      </g>
      <g>
        <text 
          x="0" 
          y={textY > 0 ? -textY + 5 : textY} 
          transform={scale ? `scale(${scale[0]}, ${scale[1]})` : undefined}
          fill="var(--node-color)" 
          fontSize={Math.max(6, circleR * 1.5)} 
          fontFamily="monospace" 
          fontWeight="bold" 
          textAnchor="middle" 
          style={{ textShadow: "0 0 3px var(--node-color)" }}
        >
          {label}
        </text>
        <animateMotion dur={duration} repeatCount="indefinite" path={path} />
        <animate attributeName="opacity" values="0.2;0.9;0.2" dur="2.5s" repeatCount="indefinite" />
      </g>
    </g>
  );
}

export function CircuitBoardBg() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Collision detection loop
  useEffect(() => {
    if (!mounted) return;
    
    let rafId: number;
    const checkCollisions = () => {
      const nodes = document.querySelectorAll('.circuit-moving-node');
      const cards = document.querySelectorAll('[data-collision-target="true"]') as NodeListOf<HTMLElement>;
      
      if (nodes.length > 0 && cards.length > 0) {
        const activeColors = new Map<HTMLElement, string>();

        nodes.forEach(node => {
          const rect = node.getBoundingClientRect();
          // Find color from parent scope
          const parentG = node.parentElement;
          if (!parentG) return;
          const color = parentG.style.getPropertyValue('--node-color');
          if (!color) return;

          cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            // Check intersection
            if (
              rect.right > cardRect.left &&
              rect.left < cardRect.right &&
              rect.bottom > cardRect.top &&
              rect.top < cardRect.bottom
            ) {
              activeColors.set(card, color);
            }
          });
        });

        cards.forEach(card => {
          const color = activeColors.get(card);
          if (color) {
            card.style.borderColor = color;
            card.style.boxShadow = `0 0 30px ${color}40, inset 0 0 20px ${color}10`;
          } else {
            card.style.borderColor = '';
            card.style.boxShadow = '';
          }
        });
      }

      rafId = requestAnimationFrame(checkCollisions);
    };

    rafId = requestAnimationFrame(checkCollisions);
    return () => cancelAnimationFrame(rafId);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[100vw] h-[100vh] pointer-events-none z-0 overflow-hidden">
      {/* Circuit Board SVG Background Pattern - Centered, Mirrored, Circular */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-40 text-neu-accent pointer-events-none" 
        viewBox="-500 -500 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        style={{
          maskImage: "radial-gradient(circle at 50% 50%, black 10%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 10%, transparent 80%)"
        }}
      >
        <defs>
          <g id="circuit-quadrant">
            {/* Center Processor Chip (Quarter) */}
            <rect x="0" y="0" width="80" height="80" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="2" />
            <rect x="0" y="0" width="70" height="70" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            <rect x="10" y="10" width="45" height="45" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="32.5" cy="32.5" r="15" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" />
            
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
        </defs>

        {/* 4-Way Symmetrical Rendering */}
        <use href="#circuit-quadrant" />
        <use href="#circuit-quadrant" transform="scale(-1, 1)" />
        <use href="#circuit-quadrant" transform="scale(1, -1)" />
        <use href="#circuit-quadrant" transform="scale(-1, -1)" />
        
        {/* Fake Lightweight Aura Glow (No blur filter used = fast performance) */}
        <rect x="-86" y="-86" width="172" height="172" fill="none" stroke="currentColor" strokeWidth="8">
          <animate attributeName="stroke-opacity" values="0;0.25;0" dur="3s" repeatCount="indefinite" />
        </rect>
        
        {/* Central glowing processor accent */}
        <rect x="-80" y="-80" width="160" height="160" fill="currentColor" stroke="currentColor" strokeWidth="4">
          <animate attributeName="stroke-opacity" values="0.2;1;0.2" dur="3s" repeatCount="indefinite" />
          <animate attributeName="fill-opacity" values="0.02;0.25;0.02" dur="3s" repeatCount="indefinite" />
        </rect>
      </svg>
      
      {/* Animated Data Nodes Overlay - 100% Opacity, No Vignette Mask */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="-500 -500 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Quadrant 1: Top Right */}
        <MovingNode 
          label="{JSON}" textY="-9" initialColor="#10b981" duration="16s" circleR={4}
          path="M 500,115 L 400,115 L 350,65 L 200,65 L 150,15 L 95,15 L 150,15 L 200,65 L 350,65 L 400,115 L 500,115"
        />
        <MovingNode 
          label="[TENSOR]" textY="-10" initialColor="#22d3ee" duration="22s" circleR={5}
          path="M 115,500 L 115,400 L 65,350 L 65,200 L 15,150 L 15,95 L 15,150 L 65,200 L 65,350 L 115,400 L 115,500"
        />
        <MovingNode 
          label="gRPC" textY="-7" initialColor="#fbbf24" duration="18s" circleR={3}
          path="M 500,210 L 400,210 L 350,160 L 270,160 L 220,110 L 140,110 L 105,75 L 95,75 L 105,75 L 140,110 L 220,110 L 270,160 L 350,160 L 400,210 L 500,210"
        />

        {/* Quadrant 2: Top Left */}
        <MovingNode 
          label="REST" textY="-9" initialColor="#fbbf24" duration="17s" circleR={4} scale={[-1, 1]}
          path="M 500,115 L 400,115 L 350,65 L 200,65 L 150,15 L 95,15 L 150,15 L 200,65 L 350,65 L 400,115 L 500,115"
        />
        <MovingNode 
          label="GraphQL" textY="-10" initialColor="#22d3ee" duration="23s" circleR={5} scale={[-1, 1]}
          path="M 115,500 L 115,400 L 65,350 L 65,200 L 15,150 L 15,95 L 15,150 L 65,200 L 65,350 L 115,400 L 115,500"
        />
        <MovingNode 
          label="Kafka" textY="-7" initialColor="#8b5cf6" duration="19s" circleR={3} scale={[-1, 1]}
          path="M 500,210 L 400,210 L 350,160 L 270,160 L 220,110 L 140,110 L 105,75 L 95,75 L 105,75 L 140,110 L 220,110 L 270,160 L 350,160 L 400,210 L 500,210"
        />

        {/* Quadrant 3: Bottom Right */}
        <MovingNode 
          label="Redis" textY="15" initialColor="#fbbf24" duration="15s" circleR={4} scale={[1, -1]}
          path="M 500,115 L 400,115 L 350,65 L 200,65 L 150,15 L 95,15 L 150,15 L 200,65 L 350,65 L 400,115 L 500,115"
        />
        <MovingNode 
          label="Docker" textY="15" initialColor="#f43f5e" duration="21s" circleR={5} scale={[1, -1]}
          path="M 115,500 L 115,400 L 65,350 L 65,200 L 15,150 L 15,95 L 15,150 L 65,200 L 65,350 L 115,400 L 115,500"
        />
        <MovingNode 
          label="SQL" textY="12" initialColor="#fbbf24" duration="17s" circleR={3} scale={[1, -1]}
          path="M 500,210 L 400,210 L 350,160 L 270,160 L 220,110 L 140,110 L 105,75 L 95,75 L 105,75 L 140,110 L 220,110 L 270,160 L 350,160 L 400,210 L 500,210"
        />

        {/* Quadrant 4: Bottom Left */}
        <MovingNode 
          label="OAuth" textY="15" initialColor="#fbbf24" duration="16.5s" circleR={4} scale={[-1, -1]}
          path="M 500,115 L 400,115 L 350,65 L 200,65 L 150,15 L 95,15 L 150,15 L 200,65 L 350,65 L 400,115 L 500,115"
        />
        <MovingNode 
          label="CUDA" textY="15" initialColor="#22d3ee" duration="22.5s" circleR={5} scale={[-1, -1]}
          path="M 115,500 L 115,400 L 65,350 L 65,200 L 15,150 L 15,95 L 15,150 L 65,200 L 65,350 L 115,400 L 115,500"
        />
        <MovingNode 
          label="Python" textY="12" initialColor="#fbbf24" duration="18.5s" circleR={3} scale={[-1, -1]}
          path="M 500,210 L 400,210 L 350,160 L 270,160 L 220,110 L 140,110 L 105,75 L 95,75 L 105,75 L 140,110 L 220,110 L 270,160 L 350,160 L 400,210 L 500,210"
        />
      </svg>
    </div>
  );
}
