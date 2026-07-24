import { render, _screen, waitFor, _fireEvent, cleanup, _within } from '@testing-library/react';
import AdminProjects from '@/views/admin-_projects/ui/AdminProjects';
import { _useRouter } from 'next/navigation';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  _useRouter: jest.fn().mockImplementation(() => ({ push: mockPush }))
}));

jest.mock('@/shared/ui/admin/AdminSidebar', () => ({
  AdminSidebar: () => <div data-testid="admin-sidebar" />
}));

describe('AdminProjects.tsx', () => {
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
    
    // Mock confirm
    window.confirm = jest.fn(() => true);
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('redirects if not admin', () => {
    window.localStorage.getItem = jest.fn(() => null);
    render(<AdminProjects />);
    expect(mockPush).toHaveBeenCalledWith('/admin/login');
  });

  it('renders _projects and pagination', async () => {
    const _projects = Array.from({ length: 6 }).map((_, i) => ({
      id: `p${i}`, title: `Project ${i}`, subtitle: `Sub ${i}`, category: 'Web', date: '2023', tags: ['React']
    }));

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ data: { _projects } })
    });

    render(<AdminProjects />);

    await waitFor(() => {
      expect(_screen.getByText('Project 0')).toBeInTheDocument();
    });

    // 5 per page, so Project 5 shouldn't be there yet
    expect(_screen.queryByText('Project 5')).not.toBeInTheDocument();

    // The pagination text
    expect(_screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('opens add modal, modifies dynamic fields, and submits', async () => {
    mockFetch.mockImplementation(async (url, init) => {
      if (init && init.method === 'POST') {
        return { ok: true };
      }
      return { json: () => Promise.resolve({ data: { _projects: [] } }) };
    });

    render(<AdminProjects />);

    await waitFor(() => {
      expect(_screen.getByText('Portfolio Projects')).toBeInTheDocument();
    });

    _fireEvent.click(_screen.getByText('Add Project'));
    
    expect(_screen.getByText('New Project')).toBeInTheDocument();

    // Add stat
    _fireEvent.click(_screen.getByText('Add Stat'));
    const statLabels = _screen.getAllByPlaceholderText('Label');
    expect(statLabels).toHaveLength(1);
    
    // Fill title
    _fireEvent.change(_screen.getAllByRole('textbox')[0], { target: { value: 'New Proj' } });

    _fireEvent.submit(_screen.getByText('Create Project').closest('form')!);
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/_projects', expect.objectContaining({
        method: 'POST'
      }));
    });
  });

  it('opens edit modal and saves', async () => {
    mockFetch.mockImplementation(async (url, init) => {
      if (init && init.method === 'PATCH') {
        return { ok: true };
      }
      return { json: () => Promise.resolve({ data: { _projects: [{ id: '1', title: 'Old Title', tags: ['a', 'b'], stats: [], phases: [] }] } }) };
    });

    render(<AdminProjects />);

    await waitFor(() => {
      expect(_screen.getByText('Old Title')).toBeInTheDocument();
    });

    // We can query the button by looking inside the table row
    const row = _screen.getByText('Old Title').closest('tr');
    const editBtn = _within(row!).getAllByRole('button')[0]; // Edit is the first button in actions
    
    _fireEvent.click(editBtn);

    expect(_screen.getByText('Edit Project')).toBeInTheDocument();

    _fireEvent.submit(_screen.getByText('Save Changes').closest('form')!);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/_projects/1', expect.objectContaining({
        method: 'PATCH'
      }));
    });
  });

  it('deletes a project', async () => {
    mockFetch.mockImplementation(async (url, init) => {
      if (init && init.method === 'DELETE') {
        return { ok: true };
      }
      return { json: () => Promise.resolve({ data: { _projects: [{ id: '1', title: 'Delete Me', tags: [], stats: [], phases: [] }] } }) };
    });

    render(<AdminProjects />);

    await waitFor(() => {
      expect(_screen.getByText('Delete Me')).toBeInTheDocument();
    });

    const row = _screen.getByText('Delete Me').closest('tr');
    const deleteBtn = _within(row!).getAllByRole('button')[1]; // Delete is the second button

    _fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/_projects/1', expect.objectContaining({
        method: 'DELETE'
      }));
    });
  });
});
