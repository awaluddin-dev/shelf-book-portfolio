"use client";

import { useEffect } from "react";

export function ButtonSprinkles() {
  const createSprinkles = (button: HTMLElement) => {
    const rect = button.getBoundingClientRect();
    const numSprinkles = 20;
    const colors = ["#10B981", "#3B82F6", "#A855F7", "#F59E0B", "#EC4899", "#06B6D4"];

    const perimeter = 2 * rect.width + 2 * rect.height;

    for (let i = 0; i < numSprinkles; i++) {
      const sprinkle = document.createElement("div");
      
      const random = () => crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;
      const size = random() * 5 + 3; // 3px to 8px
      const color = colors[Math.floor(random() * colors.length)];
      
      // Calculate random position on the perimeter
      const p = random() * perimeter;
      let px, py, tx, ty;
      
      const velocity = random() * 40 + 30;

      if (p < rect.width) {
        // Top edge
        px = rect.left + p;
        py = rect.top;
        tx = (random() - 0.5) * velocity;
        ty = -(random() * velocity + 10);
      } else if (p < rect.width + rect.height) {
        // Right edge
        px = rect.right;
        py = rect.top + (p - rect.width);
        tx = random() * velocity + 10;
        ty = (random() - 0.5) * velocity;
      } else if (p < 2 * rect.width + rect.height) {
        // Bottom edge
        px = rect.right - (p - rect.width - rect.height);
        py = rect.bottom;
        tx = (random() - 0.5) * velocity;
        ty = random() * velocity + 10;
      } else {
        // Left edge
        px = rect.left;
        py = rect.bottom - (p - 2 * rect.width - rect.height);
        tx = -(random() * velocity + 10);
        ty = (random() - 0.5) * velocity;
      }

      sprinkle.style.position = "fixed";
      sprinkle.style.left = `${px}px`;
      sprinkle.style.top = `${py}px`;
      sprinkle.style.width = `${size}px`;
      sprinkle.style.height = `${size}px`;
      sprinkle.style.backgroundColor = color;
      sprinkle.style.borderRadius = random() > 0.5 ? "50%" : "2px";
      sprinkle.style.pointerEvents = "none";
      sprinkle.style.zIndex = "99999";
      
      document.body.appendChild(sprinkle);

      sprinkle.animate([
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
      ], {
        duration: random() * 400 + 400, // 400ms to 800ms
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        fill: "forwards"
      });

      // Cleanup
      setTimeout(() => {
        if (document.body.contains(sprinkle)) {
          sprinkle.remove();
        }
      }, 1000);
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Trigger only for elements acting as buttons
      const button = target.closest("button, [role='button'], a.glass-card, a[download]");
      if (!button) return;

      createSprinkles(button as HTMLElement);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
