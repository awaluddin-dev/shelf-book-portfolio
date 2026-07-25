/* eslint-disable */
import { render, screen, waitFor, fireEvent, cleanup, within } from '@testing-library/react';
import AdminProficiency from '@/views/admin-proficiency/ui/AdminProficiency';
import { useRouter } from 'next/navigation';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockImplementation(() => ({ push: mockPush }))
}));

jest.mock('@/shared/ui/admin/AdminSidebar', () => ({
  AdminSidebar: () => <div data-testid="admin-sidebar" />
}));

jest.mock('next-themes', () => ({
  useTheme: jest.fn().mockImplementation(() => ({ resolvedTheme: 'dark' }))
}));

describe('AdminProficiency.tsx', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    const mockLocalStorage: any = { isAdmin: 'true', token: 'fake-token' };
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key) => mockLocalStorage[key]),
        setItem: jest.fn((key, val) => { mockLocalStorage[key] = val; }),
        removeItem: jest.fn((key) => { delete mockLocalStorage[key]; }),
      },
      writable: true
    });
    
    window.confirm = jest.fn(() => true);
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders correctly and fetches data', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ data: { proficiency: [{ id: '1', title: 'Frontend', level: 90, subSkills: [] }] } })
    });

    render(<AdminProficiency />);

    await waitFor(() => {
      expect(screen.getByText('Technical Proficiency')).toBeInTheDocument();
    });

    expect(screen.getByText('Frontend')).toBeInTheDocument();
  });
});
