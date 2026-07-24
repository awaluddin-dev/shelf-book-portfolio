import { render, screen } from '@testing-library/react';
import EmptyState from '@/shared/ui/EmptyState';

describe('EmptyState.tsx', () => {
  it('renders default message', () => {
    render(<EmptyState />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders custom message', () => {
    render(<EmptyState message="Nothing found" />);
    expect(screen.getByText('Nothing found')).toBeInTheDocument();
  });
});
