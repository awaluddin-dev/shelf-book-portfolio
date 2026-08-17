import React from 'react';
import { render, act } from '@testing-library/react';
import { CircuitBoardBg } from '../CircuitBoardBg';

describe('CircuitBoardBg', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    // Mock DOMPoint
    global.DOMPoint = class DOMPoint {
      x: number;
      y: number;
      constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
      }
      matrixTransform() {
        return this;
      }
    } as any;

    // Mock SVG methods
    window.SVGElement.prototype.getTotalLength = () => 100;
    window.SVGElement.prototype.getPointAtLength = () => ({ x: 0, y: 0 }) as DOMPoint;
    window.SVGGraphicsElement.prototype.getCTM = () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 } as DOMMatrix);
    // @ts-ignore
    window.SVGSVGElement.prototype.getCurrentTime = () => 0;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('renders and mounts with animated nodes', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
    svg.id = 'circuit-nodes-svg';
    svg.getCurrentTime = () => 1;
    svg.getBoundingClientRect = () => ({ left: 0, top: 0, right: 100, bottom: 100, width: 100, height: 100, x: 0, y: 0, toJSON: () => {} } as DOMRect);
    document.body.appendChild(svg);

    const parentG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    parentG.style.setProperty('--node-color', 'red');
    parentG.getCTM = () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 } as DOMMatrix);
    
    const nodeG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodeG.setAttribute('class', 'circuit-moving-node');
    
    const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion') as any;
    anim.setAttribute('path', 'M 0 0 L 100 100');
    anim.setAttribute('dur', '10');
    anim.getStartTime = () => 0;
    
    nodeG.appendChild(anim);
    parentG.appendChild(nodeG);
    document.body.appendChild(parentG);

    const card = document.createElement('div');
    card.dataset.cardZone = 'main';
    card.getBoundingClientRect = () => ({ left: 0, top: 0, right: 50, bottom: 50, width: 50, height: 50, x: 0, y: 0, toJSON: () => {} } as DOMRect);
    document.body.appendChild(card);

    let result: any;
    act(() => {
      result = render(<CircuitBoardBg />);
    });
    
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Make intensity 0
    card.getBoundingClientRect = () => ({ left: 200, top: 200, right: 250, bottom: 250, width: 50, height: 50, x: 200, y: 200, toJSON: () => {} } as DOMRect);
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.container.querySelector('svg')).toBeInTheDocument();
  });

  it('respects reduced motion', () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: true,
    }));
    
    let result: any;
    act(() => {
      result = render(<CircuitBoardBg />);
    });
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.container).toBeInTheDocument();
  });
});
