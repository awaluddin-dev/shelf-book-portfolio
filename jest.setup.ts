import React from 'react';
import '@testing-library/jest-dom';

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
  const actual = jest.requireActual('motion/react');
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
  };
});

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: any) => React.createElement('div', { 'data-testid': 'markdown-content' }, children),
}));

jest.mock('react-zoom-pan-pinch', () => ({
  __esModule: true,
  TransformWrapper: ({ children }: any) => React.createElement('div', null, typeof children === 'function' ? children({}) : children),
  TransformComponent: ({ children }: any) => React.createElement('div', null, children),
  useControls: () => ({ zoomIn: jest.fn(), zoomOut: jest.fn(), resetTransform: jest.fn() }),
}));
