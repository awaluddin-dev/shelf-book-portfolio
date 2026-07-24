import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/shared/ui/ThemeProvider';

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    setTheme: jest.fn(),
    resolvedTheme: 'dark',
  }),
  ThemeProvider: ({ children }: any) => <div data-testid="next-themes-provider">{children}</div>,
}));

describe('ThemeProvider.tsx', () => {
  it('provides theme context to children', () => {
    const TestChild = () => {
      const { isDark, toggleTheme } = useTheme();
      return (
        <div>
          <span data-testid="is-dark">{isDark.toString()}</span>
          <button onClick={toggleTheme} data-testid="toggle-btn">Toggle</button>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <TestChild />
      </ThemeProvider>
    );

    // After mounting, it should resolve to dark based on our mock
    expect(screen.getByTestId('is-dark').textContent).toBe('true');
    expect(screen.getByTestId('next-themes-provider')).toBeInTheDocument();
  });
});
