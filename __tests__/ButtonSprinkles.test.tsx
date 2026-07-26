import { render, fireEvent } from '@testing-library/react'
import { ButtonSprinkles } from '@/shared/ui/ButtonSprinkles'

describe('ButtonSprinkles', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    
    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 100,
      height: 40,
      top: 0,
      left: 0,
      bottom: 40,
      right: 100,
      x: 0,
      y: 0,
      toJSON: () => {}
    }))
    
    // Mock crypto for getSecureRandom
    Object.defineProperty(window, 'crypto', {
      value: {
        getRandomValues: (arr: Uint32Array) => {
          arr[0] = Math.floor(// eslint-disable-next-line sonarjs/pseudo-random
      Math.random() * (0xFFFFFFFF + 1))
          return arr
        }
      }
    })
    
    // Mock HTMLElement.prototype.animate
    Element.prototype.animate = jest.fn()
  })
  
  afterEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
    document.body.innerHTML = ''
  })

  it('renders nothing but adds click listener', () => {
    const { container } = render(<ButtonSprinkles />)
    expect(container.firstChild).toBeNull()
  })

  it('creates sprinkles when a button is clicked', () => {
    render(
      <>
        <ButtonSprinkles />
        <button id="test-btn">Click Me</button>
      </>
    )

    const button = document.getElementById('test-btn') as HTMLButtonElement
    fireEvent.click(button)

    // It should create 20 sprinkles appended to document.body
    const sprinkles = document.body.querySelectorAll('div[style*="position: fixed"]')
    expect(sprinkles).toHaveLength(20)

    // Fast-forward to cleanup
    jest.runAllTimers()

    // Sprinkles should be removed
    const sprinklesAfter = document.body.querySelectorAll('div[style*="position: fixed"]')
    expect(sprinklesAfter).toHaveLength(0)
  })

  it('creates sprinkles when a role="button" element is clicked', () => {
    render(
      <>
        <ButtonSprinkles />
        <div id="test-btn" role="button">Click Me</div>
      </>
    )

    const button = document.getElementById('test-btn') as HTMLDivElement
    fireEvent.click(button)

    const sprinkles = document.body.querySelectorAll('div[style*="position: fixed"]')
    expect(sprinkles).toHaveLength(20)
  })

  it('does not create sprinkles for non-button elements', () => {
    render(
      <>
        <ButtonSprinkles />
        <div id="test-div">Just a div</div>
      </>
    )

    const div = document.getElementById('test-div') as HTMLDivElement
    fireEvent.click(div)

    const sprinkles = document.body.querySelectorAll('div[style*="position: fixed"]')
    expect(sprinkles).toHaveLength(0)
  })
})
