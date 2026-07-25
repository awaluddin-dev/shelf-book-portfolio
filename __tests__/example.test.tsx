/* eslint-disable */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Example Test', () => {
  it('renders a heading', () => {
    render(<h1>Hello World</h1>);
    
    const heading = screen.getByRole('heading', { name: /hello world/i });
    expect(heading).toBeInTheDocument();
  });
});
