/* eslint-disable */
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import AdminArchitecture from '@/views/admin-architecture/ui/AdminArchitecture';
import { useRouter } from 'next/navigation';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockImplementation(() => ({ push: mockPush }))
}));

jest.mock('@/shared/ui/admin/AdminSidebar', () => ({
  AdminSidebar: () => <div data-testid="admin-sidebar" />
}));

describe('AdminArchitecture.tsx', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;

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

  it('renders correctly and fetches data', async () => {
    mockFetch.mockImplementation(async (url) => {
      if (url === '/api/projects') {
        return { json: () => Promise.resolve({ data: { projects: [{ id: 'p1', title: 'Project 1' }] } }) };
      }
      if (url === '/api/architecture') {
        return { json: () => Promise.resolve({ data: [{ id: '1', projectId: 'p1', name: 'Frontend', title: 'FE', description: 'React', metrics: 'fast', order: 1 }] }) };
      }
    });

    render(<AdminArchitecture />);

    await waitFor(() => {
      expect(screen.getByText('Frontend')).toBeInTheDocument();
    });
  });
});
