/* eslint-disable */
import { render, screen, act, waitFor } from '@testing-library/react';
import MermaidDiagram from '@/shared/ui/MermaidDiagram';

// Mock mermaid
jest.mock('mermaid', () => {
  const m = {
    initialize: jest.fn(),
    render: jest.fn().mockResolvedValue({ svg: '<svg data-testid="mock-svg"></svg>' }),
  };
  return {
    __esModule: true,
    default: m,
  };
}, { virtual: true });

describe('MermaidDiagram.tsx', () => {
  it('renders loading state initially and then svg', async () => {
    let resolveMermaid: any;
    
    // We can just rely on the mock above which returns immediately.
    const { container } = render(<MermaidDiagram chart="graph TD; A-->B;" />);

    // Check if the title exists
    expect(screen.getByText('Mermaid Diagram')).toBeInTheDocument();

    // wait for async render to finish
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // The SVG should be injected
    expect(container.innerHTML).toContain('<svg data-testid="mock-svg"');
  });

  it('renders error state if chart is invalid', async () => {
    // We can't easily re-mock in jest while maintaining the component import
    // But we can just use the already required mock.
    const mermaid = require('mermaid').default;
    mermaid.render.mockRejectedValueOnce(new Error('Parse error'));

    let container: any;
    await act(async () => {
      container = render(<MermaidDiagram chart="invalid chart" />);
      // await internal microtasks
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(screen.getByText('Mermaid Error:')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Parse error')).toBeInTheDocument();
  });
});
