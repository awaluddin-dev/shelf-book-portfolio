import React from 'react';
import { render } from '@testing-library/react';
import { MascotSvg } from '../MascotSvg';

jest.mock('motion/react', () => {
  const React = require('react');
  const G = React.forwardRef(({ children, ...props }: any, ref: any) => React.createElement('g', { ...props, ref }, children));
  G.displayName = 'motion.g';
  const Path = React.forwardRef(({ children, ...props }: any, ref: any) => React.createElement('path', { ...props, ref }, children));
  Path.displayName = 'motion.path';
  return {
    __esModule: true,
    motion: {
      g: G,
      path: Path,
    }
  };
});

describe('MascotSvg', () => {
  it('renders correctly in light mode', () => {
    const { container } = render(<MascotSvg isDark={false} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders correctly in dark mode', () => {
    const { container } = render(<MascotSvg isDark={true} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
