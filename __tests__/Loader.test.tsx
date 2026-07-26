import { render, screen } from '@testing-library/react'
import { Loader } from '@/shared/ui/Loader'

describe('Loader', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<Loader />)
    
    // The spinner svg from lucide-react should be present
    expect(container.querySelector('svg')).toBeInTheDocument()
    // It should not be fullscreen
    expect(container.querySelector('.fixed.inset-0')).not.toBeInTheDocument()
  })

  it('renders in full screen mode when fullScreen prop is true', () => {
    const { container } = render(<Loader fullScreen />)
    
    // Container should have the full screen classes
    expect(container.querySelector('.fixed.inset-0.z-50')).toBeInTheDocument()
  })

  it('renders text when text prop is provided', () => {
    const text = 'Loading data...'
    render(<Loader text={text} />)
    
    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const customClass = 'my-custom-loader'
    const { container } = render(<Loader className={customClass} />)
    
    expect(container.querySelector(`.${customClass}`)).toBeInTheDocument()
  })
})
