import { render, _screen, waitFor, _fireEvent, cleanup, _within } from '@testing-library/react';
import AdminSkill from '@/views/admin-skill/ui/AdminSkill';
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

describe('AdminSkill.tsx', () => {
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
      json: () => Promise.resolve({ data: { skills: [{ id: '1', title: 'React', category: 'Frontend', level: 'Pro', details: '', x: 0, y: 0, connections: [] }] } })
    });

    render(<AdminSkill />);

    await waitFor(() => {
      expect(_screen.getByText('Interactive Skill Tree')).toBeInTheDocument();
    });

    expect(_screen.getByText('React')).toBeInTheDocument();
  });

  it('can open add modal, fill form, and submit', async () => {
    mockFetch.mockImplementation(async (url, init) => {
      if (init && init.method === 'POST') {
        return { ok: true };
      }
      return { json: () => Promise.resolve({ data: { skills: [] } }) };
    });

    render(<AdminSkill />);

    await waitFor(() => {
      expect(_screen.getByText('Interactive Skill Tree')).toBeInTheDocument();
    });

    _fireEvent.click(_screen.getByText('Add Node'));
    expect(_screen.getAllByText('Add Node').length).toBeGreaterThan(0);

    const titleInput = _screen.getByPlaceholderText('Node.js');
    _fireEvent.change(titleInput, { target: { value: 'New Skill' } });

    _fireEvent.submit(_screen.getByText('Create Node').closest('form')!);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/skills', expect.objectContaining({ method: 'POST' }));
    });
  });

  it('can open edit modal and save', async () => {
    mockFetch.mockImplementation(async (url, init) => {
      if (init && init.method === 'PATCH') {
        return { ok: true };
      }
      return { json: () => Promise.resolve({ data: { skills: [{ id: '1', title: 'Old Skill', category: 'Backend', level: 'Pro', details: '', x: 0, y: 0, connections: [] }] } }) };
    });

    render(<AdminSkill />);

    await waitFor(() => {
      expect(_screen.getByText('Old Skill')).toBeInTheDocument();
    });

    const row = _screen.getByText('Old Skill').closest('tr');
    // buttons: Edit, Delete
    const editBtn = _within(row!).getAllByRole('button')[0];
    _fireEvent.click(editBtn);

    expect(_screen.getByText('Edit Node')).toBeInTheDocument();

    _fireEvent.submit(_screen.getByText('Save Changes').closest('form')!);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/skills/1', expect.objectContaining({ method: 'PATCH' }));
    });
  });

  it('can delete an item', async () => {
    mockFetch.mockImplementation(async (url, init) => {
      if (init && init.method === 'DELETE') {
        return { ok: true };
      }
      return { json: () => Promise.resolve({ data: { skills: [{ id: '1', title: 'Delete Me', category: 'Backend', level: 'Pro', details: '', x: 0, y: 0, connections: [] }] } }) };
    });

    render(<AdminSkill />);

    await waitFor(() => {
      expect(_screen.getByText('Delete Me')).toBeInTheDocument();
    });

    const row = _screen.getByText('Delete Me').closest('tr');
    const deleteBtn = _within(row!).getAllByRole('button')[1];

    _fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/skills/1', expect.objectContaining({ method: 'DELETE' }));
    });
  });
});
