/* eslint-disable */
import { getTagProjectCount, getRelatedProjects } from '@/entities/project/model/projects-data';
import { projects } from '@/entities/testimonial/model/data';

jest.mock('@/entities/testimonial/model/data', () => ({
  projects: [
    { id: '1', name: 'Project 1', tags: ['React', 'Node'] },
    { id: '2', name: 'Project 2', tags: ['React', 'TypeScript'] },
    { id: '3', name: 'Project 3', tags: ['Node', 'PostgreSQL'] },
  ]
}));

describe('projects-data.ts', () => {
  it('getTagProjectCount returns correct count', () => {
    expect(getTagProjectCount('React')).toBe(2);
    expect(getTagProjectCount('Node')).toBe(2);
    expect(getTagProjectCount('TypeScript')).toBe(1);
    expect(getTagProjectCount('Unknown')).toBe(0);
  });

  it('getRelatedProjects returns most related projects', () => {
    const current = { id: '1', name: 'Project 1', tags: ['React', 'Node'] } as any;
    const related = getRelatedProjects(current);
    
    // Both Project 2 (React) and Project 3 (Node) share 1 tag with Project 1.
    expect(related.length).toBe(2);
    expect(related[0].id).not.toBe('1');
    expect(related[1].id).not.toBe('1');
  });
});
