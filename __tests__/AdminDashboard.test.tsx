import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react';
import AdminDashboard from '@/views/admin-dashboard/ui/AdminDashboard';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockImplementation(() => ({ push: mockPush }))
}));

jest.mock('next-themes', () => ({
  useTheme: jest.fn().mockImplementation(() => ({ resolvedTheme: 'dark' }))
}));

jest.mock('@/shared/ui/admin/AdminSidebar', () => ({
  AdminSidebar: () => <div data-testid="admin-sidebar" />
}));

describe('AdminDashboard.tsx', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    
    (useTheme as jest.Mock).mockReturnValue({ resolvedTheme: 'dark' });

    // Mock localStorage
    const mockLocalStorage: any = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key) => mockLocalStorage[key]),
        setItem: jest.fn((key, val) => { mockLocalStorage[key] = val; }),
        removeItem: jest.fn((key) => { delete mockLocalStorage[key]; }),
      },
      writable: true
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('redirects if not logged in', () => {
    render(<AdminDashboard />);
    expect(mockPush).toHaveBeenCalledWith('/admin/login');
  });

  it('redirects if token is expired', () => {
    const expiredPayload = btoa(JSON.stringify({ exp: (Date.now() / 1000) - 1000 }));
    window.localStorage.setItem('token', `header.${expiredPayload}.sig`);
    
    render(<AdminDashboard />);
    
    expect(mockPush).toHaveBeenCalledWith('/admin/login');
  });

  it('renders dashboard content if logged in', async () => {
    const validPayload = btoa(JSON.stringify({ exp: (Date.now() / 1000) + 1000 }));
    window.localStorage.setItem('token', `header.${validPayload}.sig`);
    window.localStorage.setItem('isAdmin', 'true');

    mockFetch.mockImplementation((url) => {
      if (url === '/api/status') return Promise.resolve({ json: () => Promise.resolve({}) });
      if (url === '/api/testimonials?all=true') return Promise.resolve({ json: () => Promise.resolve({ data: { testimonials: [{ id: '1', status: 'pending' }] } }) });
      if (url === '/api/hero') return Promise.resolve({ json: () => Promise.resolve({ data: { heroConfig: { name: 'John Doe', role: 'Dev', openForWork: true }, metrics: [] } }) });
      return Promise.reject();
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByText('1 pending review')).toBeInTheDocument();
    expect(screen.getByText('Open to Opportunities')).toBeInTheDocument();
  });

  it('allows saving hero config', async () => {
    const validPayload = btoa(JSON.stringify({ exp: (Date.now() / 1000) + 1000 }));
    window.localStorage.setItem('token', `header.${validPayload}.sig`);
    window.localStorage.setItem('isAdmin', 'true');

    mockFetch.mockImplementation((url, init) => {
      if (init?.method === 'PATCH') {
        return Promise.resolve({ ok: true });
      }
      return Promise.resolve({ json: () => Promise.resolve({ data: {} }) });
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
    });

    const saveBtn = screen.getByText('Save Changes');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText('Hero Section updated successfully')).toBeInTheDocument();
    });
  });
});
