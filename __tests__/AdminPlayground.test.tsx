import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import AdminPlayground from '@/views/admin-playground/ui/AdminPlayground';
import { useRouter } from 'next/navigation';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockImplementation(() => ({ push: mockPush }))
}));

jest.mock('@/shared/ui/admin/AdminSidebar', () => ({
  AdminSidebar: () => <div data-testid="admin-sidebar" />
}));

const mockSetTheme = jest.fn();
jest.mock('next-themes', () => ({
  useTheme: jest.fn().mockImplementation(() => ({ resolvedTheme: 'dark', setTheme: mockSetTheme }))
}));

describe('AdminPlayground.tsx', () => {
  let mockWriteText: jest.Mock;

  beforeEach(() => {
    mockWriteText = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    const mockLocalStorage: any = { isAdmin: 'true', token: 'fake-token' };
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key) => mockLocalStorage[key]),
      },
      writable: true
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders correctly', () => {
    render(<AdminPlayground />);
    expect(screen.getByText('Theme Playground')).toBeInTheDocument();
  });

  it('toggles theme', () => {
    render(<AdminPlayground />);
    const themeBtn = screen.getAllByRole('button')[0]; // first button is theme toggle
    fireEvent.click(themeBtn);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('exports css to clipboard', async () => {
    render(<AdminPlayground />);
    const exportBtn = screen.getByText('Export CSS');
    fireEvent.click(exportBtn);

    expect(mockWriteText).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText('CSS Copied to clipboard!')).toBeInTheDocument();
    });
  });
});
