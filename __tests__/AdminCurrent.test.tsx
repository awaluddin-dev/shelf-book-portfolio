import { render, _screen, waitFor, _fireEvent, cleanup, _within } from '@testing-library/react';
import AdminCurrent from '@/views/admin-current/ui/AdminCurrent';
import { _useRouter } from 'next/navigation';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  _useRouter: jest.fn().mockImplementation(() => ({ push: mockPush }))
}));

jest.mock('@/shared/ui/admin/AdminSidebar', () => ({
  AdminSidebar: () => <div data-testid="admin-sidebar" />
}));

describe('AdminCurrent.tsx', () => {
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
      json: () => Promise.resolve({ data: { current: [{ id: '1', title: 'Building Shelf', description: 'desc', icon: 'Code', date: '2023', link: '' }] } })
    });

    render(<AdminCurrent />);

    await waitFor(() => {
      expect(_screen.getByText('Right Now Focus')).toBeInTheDocument();
    });

    expect(_screen.getByText('Building Shelf')).toBeInTheDocument();
  });

  it('can open add modal, fill form, and submit', async () => {
    mockFetch.mockImplementation(async (url, init) => {
      if (init && init.method === 'POST') {
        return { ok: true };
      }
      return { json: () => Promise.resolve({ data: { current: [] } }) };
    });

    render(<AdminCurrent />);

    await waitFor(() => {
      expect(_screen.getByText('Right Now Focus')).toBeInTheDocument();
    });

    _fireEvent.click(_screen.getByText('Add Focus'));
    expect(_screen.getAllByText('Add Focus').length).toBeGreaterThan(0);

    const titleInput = _screen.getAllByRole('textbox')[0];
    _fireEvent.change(titleInput, { target: { value: 'New Focus' } });

    _fireEvent.submit(_screen.getByText('Create Focus Item').closest('form')!);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/current', expect.objectContaining({ method: 'POST' }));
    });
  });

  it('can open edit modal and save', async () => {
    mockFetch.mockImplementation(async (url, init) => {
      if (init && init.method === 'PATCH') {
        return { ok: true };
      }
      return { json: () => Promise.resolve({ data: { current: [{ id: '1', title: 'Old Focus', description: 'desc', icon: 'Code', date: '2023', link: '' }] } }) };
    });

    render(<AdminCurrent />);

    await waitFor(() => {
      expect(_screen.getByText('Old Focus')).toBeInTheDocument();
    });

    const row = _screen.getByText('Old Focus').closest('tr');
    // buttons: Edit, Delete
    const editBtn = _within(row!).getAllByRole('button')[0];
    _fireEvent.click(editBtn);

    expect(_screen.getByText('Edit Focus')).toBeInTheDocument();

    _fireEvent.submit(_screen.getByText('Save Changes').closest('form')!);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/current/1', expect.objectContaining({ method: 'PATCH' }));
    });
  });

  it('can delete an item', async () => {
    mockFetch.mockImplementation(async (url, init) => {
      if (init && init.method === 'DELETE') {
        return { ok: true };
      }
      return { json: () => Promise.resolve({ data: { current: [{ id: '1', title: 'Delete Me', description: 'desc', icon: 'Code', date: '2023', link: '' }] } }) };
    });

    render(<AdminCurrent />);

    await waitFor(() => {
      expect(_screen.getByText('Delete Me')).toBeInTheDocument();
    });

    const row = _screen.getByText('Delete Me').closest('tr');
    const deleteBtn = _within(row!).getAllByRole('button')[1];

    _fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/current/1', expect.objectContaining({ method: 'DELETE' }));
    });
  });
});
