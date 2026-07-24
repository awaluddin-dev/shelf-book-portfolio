import { render, _screen, waitFor, _fireEvent, cleanup, _within } from '@testing-library/react';
import AdminLearning from '@/views/admin-learning/ui/AdminLearning';
import { _useRouter } from 'next/navigation';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  _useRouter: jest.fn().mockImplementation(() => ({ push: mockPush }))
}));

jest.mock('@/shared/ui/admin/AdminSidebar', () => ({
  AdminSidebar: () => <div data-testid="admin-sidebar" />
}));

describe('AdminLearning.tsx', () => {
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
      json: () => Promise.resolve({ data: { roadmap: [{ id: '1', tech: 'GraphQL', quarter: 'Q1', status: 'Learning' }] } })
    });

    render(<AdminLearning />);

    await waitFor(() => {
      expect(_screen.getByText('Upcoming Tech & Roadmap')).toBeInTheDocument();
    });

    expect(_screen.getByText('GraphQL')).toBeInTheDocument();
  });

  it('can open add modal, fill form, and submit', async () => {
    mockFetch.mockImplementation(async (url, init) => {
      if (init && init.method === 'POST') {
        return { ok: true };
      }
      return { json: () => Promise.resolve({ data: { roadmap: [] } }) };
    });

    render(<AdminLearning />);

    await waitFor(() => {
      expect(_screen.getByText('Upcoming Tech & Roadmap')).toBeInTheDocument();
    });

    _fireEvent.click(_screen.getByText('Add Tech'));
    expect(_screen.getAllByText('Add Tech').length).toBeGreaterThan(0);

    const techInput = _screen.getAllByRole('textbox')[0];
    _fireEvent.change(techInput, { target: { value: 'New Tech' } });

    _fireEvent.submit(_screen.getByText('Create Tech Goal').closest('form')!);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/learning', expect.objectContaining({ method: 'POST' }));
    });
  });

  it('can open edit modal and save', async () => {
    mockFetch.mockImplementation(async (url, init) => {
      if (init && init.method === 'PATCH') {
        return { ok: true };
      }
      return { json: () => Promise.resolve({ data: { roadmap: [{ id: '1', tech: 'Old Tech', quarter: 'Q1', status: 'Learning' }] } }) };
    });

    render(<AdminLearning />);

    await waitFor(() => {
      expect(_screen.getByText('Old Tech')).toBeInTheDocument();
    });

    const row = _screen.getByText('Old Tech').closest('tr');
    // buttons: Edit, Delete
    const editBtn = _within(row!).getAllByRole('button')[0];
    _fireEvent.click(editBtn);

    expect(_screen.getByText('Edit Tech')).toBeInTheDocument();

    _fireEvent.submit(_screen.getByText('Save Changes').closest('form')!);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/learning/1', expect.objectContaining({ method: 'PATCH' }));
    });
  });

  it('can delete an item', async () => {
    mockFetch.mockImplementation(async (url, init) => {
      if (init && init.method === 'DELETE') {
        return { ok: true };
      }
      return { json: () => Promise.resolve({ data: { roadmap: [{ id: '1', tech: 'Delete Me', quarter: 'Q1', status: 'Learning' }] } }) };
    });

    render(<AdminLearning />);

    await waitFor(() => {
      expect(_screen.getByText('Delete Me')).toBeInTheDocument();
    });

    const row = _screen.getByText('Delete Me').closest('tr');
    const deleteBtn = _within(row!).getAllByRole('button')[1];

    _fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/learning/1', expect.objectContaining({ method: 'DELETE' }));
    });
  });
});
