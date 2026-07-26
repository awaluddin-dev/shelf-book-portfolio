import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import MermaidDiagram from '@/shared/ui/MermaidDiagram'

jest.mock('dompurify', () => ({
  sanitize: (str: string) => str
}))

const mockMermaidRender = jest.fn()
jest.mock('mermaid', () => {
  return {
    __esModule: true,
    default: {
      initialize: jest.fn(),
      render: (...args: any[]) => mockMermaidRender(...args)
    }
  }
})

describe('MermaidDiagram', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders successfully', async () => {
    mockMermaidRender.mockResolvedValueOnce({ svg: '<svg data-testid="mock-svg"></svg>' })
    
    render(<MermaidDiagram chart="graph TD; A-->B;" />)
    
    await waitFor(() => {
      expect(mockMermaidRender).toHaveBeenCalled()
    })
    
    // We expect the state to settle and show the diagram eventually
  })
  
  it('handles error', async () => {
    mockMermaidRender.mockRejectedValueOnce(new Error('Test Error'))
    
    render(<MermaidDiagram chart="invalid" />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Error')).toBeInTheDocument()
    })
  })
})
