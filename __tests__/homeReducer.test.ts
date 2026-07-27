import { homeReducer, initialHomeState, HomeAction } from '@/pages/home/model/homeReducer'

describe('homeReducer', () => {
  it('should return the initial state', () => {
    // Reducers should return state unchanged for unknown actions (or TS should block it, but just in case)
    const action = { type: 'UNKNOWN_ACTION' } as unknown as HomeAction
    expect(homeReducer(initialHomeState, action)).toEqual(initialHomeState)
  })

  it('should handle SET_STATE and update state correctly', () => {
    const action: HomeAction = {
      type: 'SET_STATE',
      payload: {
        searchQuery: 'Test Query',
        isLoading: false,
      },
    }

    const nextState = homeReducer(initialHomeState, action)

    // Verify changed properties
    expect(nextState.searchQuery).toBe('Test Query')
    expect(nextState.isLoading).toBe(false)
    
    // Verify unchanged properties
    expect(nextState.activeSection).toBe('hero')
    expect(nextState.portfolioStatus).toBe('available')
  })

  it('should merge multiple properties in a single SET_STATE', () => {
    const action: HomeAction = {
      type: 'SET_STATE',
      payload: {
        isFilterModalOpen: true,
        sortBy: 'oldest',
        chartType: 'repository',
        loadTime: 500,
      },
    }

    const nextState = homeReducer(initialHomeState, action)
    expect(nextState.isFilterModalOpen).toBe(true)
    expect(nextState.sortBy).toBe('oldest')
    expect(nextState.chartType).toBe('repository')
    expect(nextState.loadTime).toBe(500)
    
    // The rest remains initial
    expect(nextState.mounted).toBe(false)
  })
})
