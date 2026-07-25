import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

interface P5BackgroundProps {
  isDark: boolean;
}

const P5Background: React.FC<P5BackgroundProps> = ({ isDark }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let p5Instance: p5;

    const sketch = (p: p5) => {
      let orbs: Orb[] = [];

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

        constructor() {
          this.x = p.random(p.width); // NOSONAR
          this.y = p.random(p.height); // NOSONAR
          this.maxR = p.random(80, 200); // NOSONAR
          this.r = p.random(40, this.maxR); // NOSONAR
          this.speed = p.random(0.3, 1.2); // NOSONAR
          this.vx = p.random(-1.5, 1.5); // NOSONAR
          this.vy = p.random(-1.5, 1.5); // NOSONAR
          // emerald (150), blue (210), purple (270)
          this.hue = p.random([150, 210, 270]); // NOSONAR
          this.growing = p.random([true, false]); // NOSONAR
        }

        update() {
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

        display() {
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

      p.setup = () => {
        p.createCanvas(containerRef.current!.offsetWidth, containerRef.current!.offsetHeight);
        p.colorMode(p.HSB, 360, 100, 100, 1);
        p.frameRate(15); // Optimize performance via low framerate
        
        for (let i = 0; i < 4; i++) {
          orbs.push(new Orb());
        }
      };

      p.draw = () => {
        p.clear(0, 0, 0, 0);
        for (let orb of orbs) {
          orb.update();
          orb.display();
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
