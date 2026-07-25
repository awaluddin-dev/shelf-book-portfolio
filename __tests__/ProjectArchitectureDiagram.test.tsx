/* eslint-disable */
import { render, screen, waitFor } from '@testing-library/react';
import ProjectArchitectureDiagram from '@/entities/project/ui/ProjectArchitectureDiagram';

jest.mock('react-zoom-pan-pinch', () => ({
  TransformWrapper: ({ children }: any) => <div data-testid="transform-wrapper">{children}</div>,
  TransformComponent: ({ children }: any) => <div data-testid="transform-component">{children}</div>,
  useControls: () => ({ zoomIn: jest.fn(), zoomOut: jest.fn(), resetTransform: jest.fn() })
}));

describe('ProjectArchitectureDiagram.tsx', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders loading initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); 
    render(<ProjectArchitectureDiagram project={{ id: '1' }} isDark={false} />);
    expect(screen.getByText('Loading Architecture...')).toBeInTheDocument();
  });

  it('renders image view if architectureImage is provided', async () => {
    render(<ProjectArchitectureDiagram project={{ id: '1', architectureImage: 'http://example.com/image.png' }} isDark={false} />);
    
    await waitFor(() => {
      expect(screen.getByText('System Architecture')).toBeInTheDocument();
    });

    const img = screen.getByAltText('Architecture Diagram');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'http://example.com/image.png');
  });

  it('renders node view if no image is provided', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ data: [
        { id: '1', projectId: '1', name: 'Node 1', title: 'Title 1', description: 'Desc 1', order: 1 }
      ]})
    });

    render(<ProjectArchitectureDiagram project={{ id: '1' }} isDark={false} />);
    
    await waitFor(() => {
      expect(screen.getByText('System Architecture')).toBeInTheDocument();
    });

    expect(screen.getByText('Node 1')).toBeInTheDocument();
    expect(screen.getByText('Title 1')).toBeInTheDocument();
  });

  it('renders empty state if no nodes and no image', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ data: [] })
    });

    render(<ProjectArchitectureDiagram project={{ id: '1' }} isDark={false} />);
    
    await waitFor(() => {
      expect(screen.getByText('System Architecture')).toBeInTheDocument();
    });

    expect(screen.getByText(/No architecture diagram defined for this project/i)).toBeInTheDocument();
  });
});
