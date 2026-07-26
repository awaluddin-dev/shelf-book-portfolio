import { render } from '@testing-library/react'
import { AdminPageSkeleton } from '@/shared/ui/admin/AdminPageSkeleton'

describe('AdminPageSkeleton', () => {
  it('renders correctly', () => {
    const { container } = render(<AdminPageSkeleton />)
    
    // Check if the main container is present
    const mainContainer = container.firstChild as HTMLElement
    expect(mainContainer).toBeInTheDocument()
    expect(mainContainer).toHaveClass('animate-pulse')
    
    // Check if it renders the skeleton items (4 divs)
    expect(mainContainer.children).toHaveLength(4)
    
    // Verify some classes on the children
    const firstChild = mainContainer.children[0] as HTMLElement
    expect(firstChild).toHaveClass('h-10')
    
    const secondChild = mainContainer.children[1] as HTMLElement
    expect(secondChild).toHaveClass('h-20')
  })
})
