import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectExplainer } from '@/widgets/project-explainer/ui/ProjectExplainer';
import { useProjectExplainer } from '@/hooks/useProjectExplainer';

// Mock dependencies
jest.mock('react-markdown', () => ({ children }: { children: React.ReactNode }) => (
  <div data-testid="markdown">{children}</div>
));

jest.mock('@/hooks/useProjectExplainer');

const mockUseProjectExplainer = useProjectExplainer as jest.MockedFunction<typeof useProjectExplainer>;

describe('ProjectExplainer', () => {
  const defaultProject = { id: 'p1', name: 'Project 1' } as any;
  const mockExplain = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProjectExplainer.mockReturnValue({
      text: '',
      status: 'idle',
      error: null,
      explain: mockExplain,
      reset: mockReset,
    });
  });

  it('renders explain button when idle', () => {
    render(<ProjectExplainer project={defaultProject} />);
    expect(screen.getByRole('button', { name: /explain this project/i })).toBeInTheDocument();
  });

  it('calls explain when button is clicked', () => {
    render(<ProjectExplainer project={defaultProject} />);
    fireEvent.click(screen.getByRole('button', { name: /explain this project/i }));
    expect(mockExplain).toHaveBeenCalledWith(defaultProject);
  });

  it('auto-explains when autoExplain is true', () => {
    render(<ProjectExplainer project={defaultProject} autoExplain={true} />);
    expect(mockExplain).toHaveBeenCalledWith(defaultProject);
  });

  it('resets on unmount', () => {
    const { unmount } = render(<ProjectExplainer project={defaultProject} />);
    unmount();
    expect(mockReset).toHaveBeenCalled();
  });

  it('shows loading state correctly', () => {
    mockUseProjectExplainer.mockReturnValue({
      text: '',
      status: 'loading',
      error: null,
      explain: mockExplain,
      reset: mockReset,
    });
    render(<ProjectExplainer project={defaultProject} />);
    expect(screen.getByText(/thinking/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /explain this project/i })).not.toBeInTheDocument();
  });

  it('shows streaming text', () => {
    mockUseProjectExplainer.mockReturnValue({
      text: 'Streaming content...',
      status: 'streaming',
      error: null,
      explain: mockExplain,
      reset: mockReset,
    });
    render(<ProjectExplainer project={defaultProject} />);
    const markdown = screen.getByTestId('markdown');
    expect(markdown).toHaveTextContent('Streaming content...');
  });

  it('shows done text', () => {
    mockUseProjectExplainer.mockReturnValue({
      text: 'Done content.',
      status: 'done',
      error: null,
      explain: mockExplain,
      reset: mockReset,
    });
    render(<ProjectExplainer project={defaultProject} />);
    const markdown = screen.getByTestId('markdown');
    expect(markdown).toHaveTextContent('Done content.');
  });

  it('shows error state and retry button', () => {
    mockUseProjectExplainer.mockReturnValue({
      text: '',
      status: 'error',
      error: 'Network error',
      explain: mockExplain,
      reset: mockReset,
    });
    render(<ProjectExplainer project={defaultProject} />);
    expect(screen.getByText('Network error')).toBeInTheDocument();
    
    const retryBtn = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryBtn);
    expect(mockExplain).toHaveBeenCalledWith(defaultProject);
  });

  it('shows default error message if error is null', () => {
    mockUseProjectExplainer.mockReturnValue({
      text: '',
      status: 'error',
      error: null,
      explain: mockExplain,
      reset: mockReset,
    });
    render(<ProjectExplainer project={defaultProject} />);
    expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
  });

  it('closes explanation when close button is clicked', () => {
    mockUseProjectExplainer.mockReturnValue({
      text: 'Done content.',
      status: 'done',
      error: null,
      explain: mockExplain,
      reset: mockReset,
    });
    render(<ProjectExplainer project={defaultProject} />);
    const closeBtn = screen.getByLabelText(/close explanation/i);
    fireEvent.click(closeBtn);
    expect(mockReset).toHaveBeenCalled();
  });

  it('disables close button when loading or streaming', () => {
    mockUseProjectExplainer.mockReturnValue({
      text: '',
      status: 'loading',
      error: null,
      explain: mockExplain,
      reset: mockReset,
    });
    const { rerender } = render(<ProjectExplainer project={defaultProject} />);
    let closeBtn = screen.getByLabelText(/close explanation/i);
    expect(closeBtn).toBeDisabled();

    mockUseProjectExplainer.mockReturnValue({
      text: 'Streaming...',
      status: 'streaming',
      error: null,
      explain: mockExplain,
      reset: mockReset,
    });
    rerender(<ProjectExplainer project={defaultProject} />);
    closeBtn = screen.getByLabelText(/close explanation/i);
    expect(closeBtn).toBeDisabled();
  });
});
