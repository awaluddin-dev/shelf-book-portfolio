import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoaderProps {
  fullScreen?: boolean;
  size?: number;
  className?: string;
  text?: string;
  dynamicTexts?: string[];
}

const defaultDynamicTexts = [
  "Awakening database...",
  "Fetching portfolio data...",
  "Compiling metrics...",
  "Synchronizing state...",
  "Rendering UI...",
  "Almost there...",
];

export function Loader({
  fullScreen = false,
  size = 64,
  className = "",
  text,
  dynamicTexts = defaultDynamicTexts,
}: Readonly<LoaderProps>) {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) return 99; // Hold at 99% until actually done
        // Use a fixed pseudo-random increment to avoid crypto requirements and lint errors
        const increment = (Date.now() % 8) + 2;
        return Math.min(prev + increment, 99);
      });
    }, 150);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (text) return;
    const textTimer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % dynamicTexts.length);
    }, 800);
    return () => clearInterval(textTimer);
  }, [text, dynamicTexts]);

  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-6 ${className}`}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full blur-2xl bg-neu-accent/30 dark:bg-neu-accent/20 animate-pulse"></div>

        {/* SVG Circle */}
        <svg
          className="transform -rotate-90 relative z-10"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            className="text-black/5 dark:text-white/5"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            className="text-neu-accent transition-all duration-300 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>

        {/* Percentage Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span
            className="font-mono text-sm font-bold text-neu-text tracking-tighter"
            style={{ fontSize: size * 0.25 }}
          >
            {Math.round(progress)}
            <span className="text-[0.6em] text-neu-text-muted">%</span>
          </span>
        </div>
      </div>

      <div className="h-6 relative w-64 flex items-center justify-center overflow-hidden">
        {text ? (
          <p className="text-xs md:text-sm font-mono text-neu-text-muted animate-pulse font-medium uppercase tracking-widest absolute">
            {text}
          </p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xs md:text-sm font-mono text-neu-text-muted font-medium uppercase tracking-widest absolute text-center w-full"
            >
              {dynamicTexts[textIndex]}
            </motion.p>
          </AnimatePresence>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neu-bg/80 backdrop-blur-md border border-white/10 rounded-2xl">
        {content}
      </div>
    );
  }

  return content;
}
