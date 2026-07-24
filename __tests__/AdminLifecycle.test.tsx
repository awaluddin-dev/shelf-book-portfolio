import { render, screen, waitFor, cleanup } from '@testing-library/react';
import AdminLifecycle from '@/views/admin-lifecycle/ui/AdminLifecycle';
import { useRouter } from 'next/navigation';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockImplementation(() => ({ push: mockPush }))
}));

jest.mock('@/shared/ui/admin/AdminSidebar', () => ({
  AdminSidebar: () => <div data-testid="admin-sidebar" />
}));

describe('AdminLifecycle.tsx', () => {
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
      if (url === '/api/lifecycle') {
        return { json: () => Promise.resolve({ data: [{ id: '1', projectId: 'p1', stage: 'Planning', date: '2023', title: 'Plan', description: 'desc', evidentUrl: '', order: 1 }] }) };
      }
    });

    render(<AdminLifecycle />);

    await waitFor(() => {
      expect(screen.getByText('Planning')).toBeInTheDocument();
    });
  });
});
