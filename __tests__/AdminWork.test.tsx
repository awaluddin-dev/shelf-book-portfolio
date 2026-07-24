import { render, _screen, waitFor, _fireEvent, cleanup, _within } from '@testing-library/react';
import AdminWork from '@/views/admin-work/ui/AdminWork';
import { _useRouter } from 'next/navigation';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  _useRouter: jest.fn().mockImplementation(() => ({ push: mockPush }))
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
      expect(_screen.getByText('Work Experience Management')).toBeInTheDocument();
    });

    expect(_screen.getByText('Dev')).toBeInTheDocument();
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
      expect(_screen.getByText('Work Experience Management')).toBeInTheDocument();
    });

    _fireEvent.click(_screen.getByText('Add New'));
    expect(_screen.getByText('Add New Experience')).toBeInTheDocument();

    const roleInput = _screen.getByPlaceholderText('e.g. Software Engineer');
    _fireEvent.change(roleInput, { target: { value: 'New Role' } });

    _fireEvent.submit(_screen.getByText('Create Experience').closest('form')!);

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
      expect(_screen.getByText('Old Role')).toBeInTheDocument();
    });

    const row = _screen.getByText('Old Role').closest('tr');
    // buttons: View, Edit, Delete
    const editBtn = _within(row!).getAllByRole('button')[1];
    _fireEvent.click(editBtn);

    expect(_screen.getByText('Edit Experience')).toBeInTheDocument();

    _fireEvent.submit(_screen.getByText('Save Changes').closest('form')!);

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
      expect(_screen.getByText('Delete Me')).toBeInTheDocument();
    });

    const row = _screen.getByText('Delete Me').closest('tr');
    const deleteBtn = _within(row!).getAllByRole('button')[2];

    _fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/work/1', expect.objectContaining({ method: 'DELETE' }));
    });
  });
});
