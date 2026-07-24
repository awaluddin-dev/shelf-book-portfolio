import { render, screen, waitFor, fireEvent, cleanup, within } from '@testing-library/react';
import AdminProjects from '@/views/admin-projects/ui/AdminProjects';
import { useRouter } from 'next/navigation';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockImplementation(() => ({ push: mockPush }))
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

  it('renders projects and pagination', async () => {
    const projects = Array.from({ length: 6 }).map((_, i) => ({
      id: `p${i}`, title: `Project ${i}`, subtitle: `Sub ${i}`, category: 'Web', date: '2023', tags: ['React']
    }));

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ data: { projects } })
    });

    render(<AdminProjects />);

    await waitFor(() => {
      expect(screen.getByText('Project 0')).toBeInTheDocument();
    });

    // 5 per page, so Project 5 shouldn't be there yet
    expect(screen.queryByText('Project 5')).not.toBeInTheDocument();

    // The pagination text
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('opens add modal, modifies dynamic fields, and submits', async () => {
    mockFetch.mockImplementation(async (url, init) => {
      if (init && init.method === 'POST') {
        return { ok: true };
      }
      return { json: () => Promise.resolve({ data: { projects: [] } }) };
    });

    render(<AdminProjects />);

    await waitFor(() => {
      expect(screen.getByText('Portfolio Projects')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add Project'));
    
    expect(screen.getByText('New Project')).toBeInTheDocument();

    // Add stat
    fireEvent.click(screen.getByText('Add Stat'));
    const statLabels = screen.getAllByPlaceholderText('Label');
    expect(statLabels).toHaveLength(1);
    
    // Fill title
    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'New Proj' } });

    fireEvent.submit(screen.getByText('Create Project').closest('form')!);
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/projects', expect.objectContaining({
        method: 'POST'
      }));
    });
  });

  it('opens edit modal and saves', async () => {
    mockFetch.mockImplementation(async (url, init) => {
      if (init && init.method === 'PATCH') {
        return { ok: true };
      }
      return { json: () => Promise.resolve({ data: { projects: [{ id: '1', title: 'Old Title', tags: ['a', 'b'], stats: [], phases: [] }] } }) };
    });

    render(<AdminProjects />);

    await waitFor(() => {
      expect(screen.getByText('Old Title')).toBeInTheDocument();
    });

    // We can query the button by looking inside the table row
    const row = screen.getByText('Old Title').closest('tr');
    const editBtn = within(row!).getAllByRole('button')[0]; // Edit is the first button in actions
    
    fireEvent.click(editBtn);

    expect(screen.getByText('Edit Project')).toBeInTheDocument();

    fireEvent.submit(screen.getByText('Save Changes').closest('form')!);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/projects/1', expect.objectContaining({
        method: 'PATCH'
      }));
    });
  });

  it('deletes a project', async () => {
    mockFetch.mockImplementation(async (url, init) => {
      if (init && init.method === 'DELETE') {
        return { ok: true };
      }
      return { json: () => Promise.resolve({ data: { projects: [{ id: '1', title: 'Delete Me', tags: [], stats: [], phases: [] }] } }) };
    });

    render(<AdminProjects />);

    await waitFor(() => {
      expect(screen.getByText('Delete Me')).toBeInTheDocument();
    });

    const row = screen.getByText('Delete Me').closest('tr');
    const deleteBtn = within(row!).getAllByRole('button')[1]; // Delete is the second button

    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/projects/1', expect.objectContaining({
        method: 'DELETE'
      }));
    });
  });
});
