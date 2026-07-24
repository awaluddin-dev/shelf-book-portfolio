import { render, screen } from '@testing-library/react';
import { Loader } from '@/shared/ui/Loader';

describe('Loader.tsx', () => {
  it('renders correctly', () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<Loader text="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders in full screen mode', () => {
    const { container } = render(<Loader fullScreen />);
    const div = container.querySelector('.fixed');
    expect(div).toBeInTheDocument();
  });
});
