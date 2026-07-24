import { render, _screen, _fireEvent, cleanup, waitFor } from '@testing-library/react';
import AdminPlayground from '@/views/admin-playground/ui/AdminPlayground';
import { _useRouter } from 'next/navigation';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  _useRouter: jest.fn().mockImplementation(() => ({ push: mockPush }))
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
    expect(_screen.getByText('Theme Playground')).toBeInTheDocument();
  });

  it('toggles theme', () => {
    render(<AdminPlayground />);
    const themeBtn = _screen.getAllByRole('button')[0]; // first button is theme toggle
    _fireEvent.click(themeBtn);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('exports css to clipboard', async () => {
    render(<AdminPlayground />);
    const exportBtn = _screen.getByText('Export CSS');
    _fireEvent.click(exportBtn);

    expect(mockWriteText).toHaveBeenCalled();
    await waitFor(() => {
      expect(_screen.getByText('CSS Copied to clipboard!')).toBeInTheDocument();
    });
  });
});
