import React from 'react'
import { render } from '@testing-library/react'
import { CircuitBoardBg } from '@/shared/ui/CircuitBoardBg'

describe('CircuitBoardBg', () => {
  it('renders correctly', () => {
    const { container } = render(<CircuitBoardBg />)
    expect(container).toBeDefined()
  })
})
