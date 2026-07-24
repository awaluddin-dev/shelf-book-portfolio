import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SkillTree from '@/entities/skill/ui/SkillTree';

jest.mock('@/shared/ui/P5Background', () => () => <div data-testid="p5-background-mock" />);

describe('SkillTree.tsx', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders loading state initially if isLoading prop is true', () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));
    render(<SkillTree isDark={false} isLoading={true} />);
    expect(screen.queryByText('Interactive Skill Tree')).not.toBeInTheDocument();
  });

  it('renders the skill tree and nodes correctly', async () => {
    const mockSkills = [
      { id: 'nodejs', title: 'Node.js Backend', category: 'Core Backend', level: 'Expert', x: 0, y: 0, details: 'Details for Node', connections: ['redis'] },
      { id: 'redis', title: 'Redis Cache', category: 'Infrastructure', level: 'Advanced', x: 10, y: 10, details: 'Details for Redis', connections: [] },
    ];

    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ data: { skills: mockSkills } })
    });

    render(<SkillTree isDark={false} isLoading={false} />);

    await waitFor(() => {
      expect(screen.getByText('Node.js')).toBeInTheDocument();
    });

    // Check if short titles are rendered (e.g. Node.js instead of Node.js Backend)
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('Redis')).toBeInTheDocument();

    // Hover over node.js
    const nodeText = screen.getByText('Node.js');
    const nodeGroup = nodeText.parentElement!;
    
    fireEvent.mouseEnter(nodeGroup);
    
    // Proficiency details should appear
    expect(screen.getByText('Node.js Backend')).toBeInTheDocument();
    expect(screen.getByText('Details for Node')).toBeInTheDocument();

    fireEvent.mouseLeave(nodeGroup);
    
    await waitFor(() => {
      expect(screen.queryByText('Details for Node')).not.toBeInTheDocument();
    });
  });
});
