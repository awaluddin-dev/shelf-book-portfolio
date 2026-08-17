import React from 'react';
import { render } from '@testing-library/react';
import P5Background from '../P5Background';

const mockRemove = jest.fn();

jest.mock('p5', () => {
  return jest.fn().mockImplementation((sketch, node) => {
    const p = {
      random: jest.fn().mockReturnValue(1),
      width: 100,
      height: 100,
      createCanvas: jest.fn(),
      colorMode: jest.fn(),
      frameRate: jest.fn(),
      clear: jest.fn(),
      noStroke: jest.fn(),
      map: jest.fn().mockReturnValue(0.5),
      fill: jest.fn(),
      circle: jest.fn(),
      resizeCanvas: jest.fn(),
      HSB: 'HSB',
    };
    sketch(p);
    if (p.setup) p.setup();
    if (p.draw) p.draw();
    if (p.windowResized) p.windowResized();
    return {
      remove: mockRemove,
    };
  });
});

describe('P5Background', () => {
  it('renders correctly and initializes p5 in light mode', () => {
    const { container, unmount } = render(<P5Background isDark={false} />);
    expect(container).toBeInTheDocument();
    unmount();
    expect(mockRemove).toHaveBeenCalled();
  });

  it('renders correctly and initializes p5 in dark mode', () => {
    const { container, unmount } = render(<P5Background isDark={true} />);
    expect(container).toBeInTheDocument();
    unmount();
    expect(mockRemove).toHaveBeenCalled();
  });
});
