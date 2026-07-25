/* eslint-disable */
import { render, screen, waitFor, fireEvent, cleanup, within } from '@testing-library/react';
import AdminTestimoni from '@/views/admin-testimoni/ui/AdminTestimoni';
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

describe('AdminTestimoni.tsx', () => {
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
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders correctly and fetches data', async () => {
    mockFetch.mockImplementation(async (url) => {
      if (url === '/api/status') return { json: () => Promise.resolve({ data: { status: {} } }) };
      return { json: () => Promise.resolve({ data: { testimonials: [{ id: '1', name: 'John Doe', role: 'CEO', company: 'Acme', status: 'pending', testimonial: 'Great!' }] } }) };
    });

    render(<AdminTestimoni />);

    await waitFor(() => {
      expect(screen.getByText('Testimonials Management')).toBeInTheDocument();
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('can accept a pending testimonial', async () => {
    mockFetch.mockImplementation(async (url, init) => {
      if (url === '/api/status') return { json: () => Promise.resolve({ data: { status: {} } }) };
      if (init && init.method === 'PATCH') return { ok: true };
      return { json: () => Promise.resolve({ data: { testimonials: [{ id: '1', name: 'John Doe', role: 'CEO', company: 'Acme', status: 'pending', testimonial: 'Great!' }] } }) };
    });

    render(<AdminTestimoni />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const row = screen.getByText('John Doe').closest('tr');
    // Accept is the first button for pending
    const acceptBtn = within(row!).getAllByRole('button')[0];
    
    fireEvent.click(acceptBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/testimonials/1', expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ status: 'accepted' }) }));
    });
  });

  it('can reject a pending testimonial from modal', async () => {
    mockFetch.mockImplementation(async (url, init) => {
      if (url === '/api/status') return { json: () => Promise.resolve({ data: { status: {} } }) };
      if (init && init.method === 'PATCH') return { ok: true };
      return { json: () => Promise.resolve({ data: { testimonials: [{ id: '1', name: 'Jane Doe', role: 'CTO', company: 'Tech', status: 'pending', testimonial: 'Awesome!' }] } }) };
    });

    render(<AdminTestimoni />);

    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    // click the row to open modal
    const row = screen.getByText('Jane Doe').closest('tr');
    fireEvent.click(row!);

    // check modal is open
    expect(screen.getByText('"Awesome!"')).toBeInTheDocument();

    const rejectBtn = screen.getAllByRole('button', { name: /Reject/i })[1];
    fireEvent.click(rejectBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/testimonials/1', expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ status: 'rejected' }) }));
    });
  });
});
