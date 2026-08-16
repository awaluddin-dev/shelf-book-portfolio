import { cn } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('conditionally applies classes', () => {
      const isTrue = true;
      const isFalse = false;
      expect(cn('class1', isTrue && 'class2', isFalse && 'class3')).toBe('class1 class2');
    });

    it('should merge tailwind classes properly using tailwind-merge', () => {
      expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
    });
  });
});
