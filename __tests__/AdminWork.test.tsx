import { render, screen, waitFor, fireEvent, cleanup, within } from '@testing-library/react';
import AdminWork from '@/views/admin-work/ui/AdminWork';
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

describe('AdminWork.tsx', () => {
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
      json: () => Promise.resolve({ data: { workExperience: [{ id: '1', role: 'Dev', company: 'Tech', years: '2023', duration: '1 yr', stack: '', teaser: '', fullImpact: '', bullets: [] }] } })
    });

    render(<AdminWork />);

    await waitFor(() => {
      expect(screen.getByText('Work Experience Management')).toBeInTheDocument();
    });

    expect(screen.getByText('Dev')).toBeInTheDocument();
  });

  it('can open add modal, fill form, and submit', async () => {
    mockFetch.mockImplementation(async (url, init) => {
      if (init && init.method === 'POST') {
        return { ok: true };
      }
      return { json: () => Promise.resolve({ data: { workExperience: [] } }) };
    });

    render(<AdminWork />);

    await waitFor(() => {
      expect(screen.getByText('Work Experience Management')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add New'));
    expect(screen.getByText('Add New Experience')).toBeInTheDocument();

    const roleInput = screen.getByPlaceholderText('e.g. Software Engineer');
    fireEvent.change(roleInput, { target: { value: 'New Role' } });

    fireEvent.submit(screen.getByText('Create Experience').closest('form')!);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/work', expect.objectContaining({ method: 'POST' }));
    });
  });

  it('can open edit modal and save', async () => {
    mockFetch.mockImplementation(async (url, init) => {
      if (init && init.method === 'PATCH') {
        return { ok: true };
      }
      return { json: () => Promise.resolve({ data: { workExperience: [{ id: '1', role: 'Old Role', company: 'Tech', years: '2023', duration: '1 yr', stack: '', teaser: '', fullImpact: '', bullets: [] }] } }) };
    });

    render(<AdminWork />);

    await waitFor(() => {
      expect(screen.getByText('Old Role')).toBeInTheDocument();
    });

    const row = screen.getByText('Old Role').closest('tr');
    // buttons: View, Edit, Delete
    const editBtn = within(row!).getAllByRole('button')[1];
    fireEvent.click(editBtn);

    expect(screen.getByText('Edit Experience')).toBeInTheDocument();

    fireEvent.submit(screen.getByText('Save Changes').closest('form')!);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/work/1', expect.objectContaining({ method: 'PATCH' }));
    });
  });

  it('can delete an item', async () => {
    mockFetch.mockImplementation(async (url, init) => {
      if (init && init.method === 'DELETE') {
        return { ok: true };
      }
      return { json: () => Promise.resolve({ data: { workExperience: [{ id: '1', role: 'Delete Me', company: 'Tech', years: '2023', duration: '1 yr', stack: '', teaser: '', fullImpact: '', bullets: [] }] } }) };
    });

    render(<AdminWork />);

    await waitFor(() => {
      expect(screen.getByText('Delete Me')).toBeInTheDocument();
    });

    const row = screen.getByText('Delete Me').closest('tr');
    const deleteBtn = within(row!).getAllByRole('button')[2];

    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/work/1', expect.objectContaining({ method: 'DELETE' }));
    });
  });
});
