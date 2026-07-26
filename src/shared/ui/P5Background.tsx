"use client";

import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

interface P5BackgroundProps {
  isDark: boolean;
}

class Orb {
  x: number;
  y: number;
  r: number;
  maxR: number;
  speed: number;
  vx: number;
  vy: number;
  hue: number;
  growing: boolean;

  constructor(p: p5) {
    this.x = p.random(p.width);
    this.y = p.random(p.height);
    this.maxR = p.random(80, 200);
    this.r = p.random(40, this.maxR);
    this.speed = p.random(0.3, 1.2);
    this.vx = p.random(-1.5, 1.5);
    this.vy = p.random(-1.5, 1.5);
    // emerald (150), blue (210), purple (270)
    this.hue = p.random([150, 210, 270]); 
    this.growing = p.random([true, false]);
  }

  update(p: p5) {
    // Pulsing size logic
    if (this.growing) {
      this.r += this.speed;
      if (this.r > this.maxR) this.growing = false;
    } else {
      this.r -= this.speed;
      if (this.r < 40) this.growing = true;
    }

    // Movement logic
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off walls smoothly
    if (this.x < -this.maxR || this.x > p.width + this.maxR) {
      this.vx *= -1;
    }
    if (this.y < -this.maxR || this.y > p.height + this.maxR) {
      this.vy *= -1;
    }
  }

  display(p: p5, isDark: boolean) {
    p.noStroke();
    // draw multiple layers for glow effect
    const layers = 5;
    for (let i = 0; i < layers; i++) {
      const currentR = this.r - (i * (this.r / layers));
      const baseAlpha = isDark ? 0.08 : 0.12;
      const alpha = p.map(i, 0, layers, baseAlpha, 0);
      
      p.fill(this.hue, isDark ? 80 : 60, isDark ? 80 : 90, alpha);
      p.circle(this.x, this.y, currentR * 2);
    }
  }
}

const P5Background: React.FC<P5BackgroundProps> = ({ isDark }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let p5Instance: p5;

    const sketch = (p: p5) => {
      const orbs: Orb[] = [];

      p.setup = () => {
        p.createCanvas(containerRef.current!.offsetWidth, containerRef.current!.offsetHeight);
        p.colorMode(p.HSB, 360, 100, 100, 1);
        p.frameRate(15); // Optimize performance via low framerate
        
        for (let i = 0; i < 4; i++) {
          orbs.push(new Orb(p));
        }
      };

      p.draw = () => {
        p.clear();
        for (const orb of orbs) {
          orb.update(p);
          orb.display(p, isDark);
        }
      };

      p.windowResized = () => {
        if (containerRef.current) {
          p.resizeCanvas(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
        }
      };
    };

    // Instantiate p5
    p5Instance = new p5(sketch, containerRef.current);

    return () => {
      if (p5Instance) {
        p5Instance.remove();
      }
    };
  }, [isDark]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 pointer-events-none opacity-50 dark:opacity-40"
      style={{ overflow: 'hidden', mixBlendMode: isDark ? 'screen' : 'multiply' }}
    />
  );
};

export default P5Background;
