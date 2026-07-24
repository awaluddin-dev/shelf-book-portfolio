import { render, screen, waitFor } from '@testing-library/react';
import ProjectLifecycleTracker from '@/entities/project/ui/ProjectLifecycleTracker';

describe('ProjectLifecycleTracker.tsx', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders loading initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<ProjectLifecycleTracker projectId="test-id" spineColor="#000" />);
    expect(screen.getByText('Loading Lifecycle...')).toBeInTheDocument();
  });

  it('renders empty state if no phases match', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ data: [] })
    });
    
    render(<ProjectLifecycleTracker projectId="test-id" spineColor="#000" />);

    await waitFor(() => {
      expect(screen.getByText('No lifecycle phases defined for this project')).toBeInTheDocument();
    });
  });

  it('renders phases correctly when data is fetched', async () => {
    const mockPhases = [
      { id: '1', projectId: 'test-id', stage: 'Planning', order: 1, title: 'Phase 1', description: 'Desc 1', date: 'Jan 2023' },
      { id: '2', projectId: 'test-id', stage: 'Design', order: 2, title: 'Phase 2', description: 'Desc 2', date: 'Feb 2023' },
      { id: '3', projectId: 'test-id', stage: 'Execution', order: 3, title: 'Phase 3', description: 'Desc 3', date: 'Mar 2023', evidentUrl: 'http://example.com' },
      { id: '4', projectId: 'test-id', stage: 'Testing', order: 4, title: 'Phase 4', description: 'Desc 4', date: 'Apr 2023' },
    ];

    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ data: mockPhases })
    });

    render(<ProjectLifecycleTracker projectId="test-id" spineColor="#000" />);

    await waitFor(() => {
      expect(screen.getByText('Project Lifecycle')).toBeInTheDocument();
    });

    expect(screen.getByText('Phase 1')).toBeInTheDocument();
    expect(screen.getByText('Phase 2')).toBeInTheDocument();
    expect(screen.getByText('Phase 3')).toBeInTheDocument();
    expect(screen.getByText('Phase 4')).toBeInTheDocument();
    expect(screen.getByText('View Evidence')).toHaveAttribute('href', 'http://example.com');
  });
});
