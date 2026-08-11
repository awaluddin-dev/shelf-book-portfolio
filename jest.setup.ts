import React from 'react';
import '@testing-library/jest-dom'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock('motion/react', () => {
  const actual = jest.requireActual('motion/react')
  return {
    ...actual,
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useSpring: () => ({ get: () => 0 }),
    useAnimation: () => ({ start: jest.fn(), stop: jest.fn() }),
    useTransform: () => 0,
    motion: new Proxy({}, {
      get: (_, key) => {
        return ({ children, className, ...props }: any) => {
          const Tag = key as any;
          // Strip motion specific props to avoid React warnings
          const { 
            initial, animate, exit, variants, transition, 
            whileHover, whileTap, whileInView, viewport, 
            style, onUpdate, onAnimationStart, onAnimationComplete,
            layoutId, layout, drag, dragConstraints, dragElastic,
            ...safeProps 
          } = props;
          return React.createElement(Tag, { className, 'data-testid': `motion-${key as string}`, ...safeProps }, children);
        };
      }
    }),
    AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children)
  }
});
