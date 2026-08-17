import React from 'react';
import { render } from '@testing-library/react';
import { MascotSvg } from '../MascotSvg';

jest.mock('motion/react', () => {
  const React = require('react');
  return {
    __esModule: true,
    motion: {
      g: React.forwardRef(({ children, ...props }: any, ref: any) => React.createElement('g', { ...props, ref }, children)),
      path: React.forwardRef(({ children, ...props }: any, ref: any) => React.createElement('path', { ...props, ref }, children)),
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
