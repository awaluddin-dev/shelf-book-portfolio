import React from 'react'
import { render } from '@testing-library/react'
import P5Background from '@/shared/ui/P5Background'

jest.mock('p5', () => {
  return jest.fn().mockImplementation((sketch, container) => {
    return {
      remove: jest.fn()
    }
  })
})

describe('P5Background', () => {
  it('renders correctly', () => {
    const { container, unmount } = render(<P5Background isDark={true} />)
    expect(container).toBeDefined()
    unmount()
  })
})
