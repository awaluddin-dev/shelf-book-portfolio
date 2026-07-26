import { cn } from '@/shared/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('merges tailwind classes correctly', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4') // tailwind-merge in action
      expect(cn('text-sm', { 'text-lg': true, 'font-bold': false })).toBe('text-lg')
    })
  })
})
