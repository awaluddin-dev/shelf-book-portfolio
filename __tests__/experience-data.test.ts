/* eslint-disable */
import { experiencesList } from '@/entities/experience/model/experience-data';

describe('experience-data.ts', () => {
  it('exports a list of experiences', () => {
    expect(Array.isArray(experiencesList)).toBe(true);
    expect(experiencesList.length).toBeGreaterThan(0);
    expect(experiencesList[0]).toHaveProperty('company');
    expect(experiencesList[0]).toHaveProperty('role');
    expect(experiencesList[0]).toHaveProperty('years');
  });
});
