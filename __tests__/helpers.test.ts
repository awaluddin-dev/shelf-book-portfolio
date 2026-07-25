import { getTagProjectCount, getRelatedProjects, legendLevels, TECHNICAL_IMAGERY } from '@/shared/lib/helpers'
import { Project } from '@/shared/types'

describe('helpers', () => {
  const mockProjects: Project[] = [
    {
      id: '1',
      title: 'Project 1',
      description: 'Desc 1',
      date: '2022',
      tags: ['React', 'TypeScript', 'Node.js'],
      metrics: [],
      gallery: []
    },
    {
      id: '2',
      title: 'Project 2',
      description: 'Desc 2',
      date: '2023',
      tags: ['React', 'Tailwind', 'Node.js'],
      metrics: [],
      gallery: []
    },
    {
      id: '3',
      title: 'Project 3',
      description: 'Desc 3',
      date: '2024',
      tags: ['Vue', 'JavaScript', 'CSS'],
      metrics: [],
      gallery: []
    },
  ]

  describe('legendLevels', () => {
    it('contains the correct number of levels', () => {
      expect(legendLevels).toHaveLength(5)
      expect(legendLevels[0].level).toBe(0)
      expect(legendLevels[4].level).toBe(4)
    })
  })

  describe('TECHNICAL_IMAGERY', () => {
    it('contains imagery for known projects', () => {
      expect(TECHNICAL_IMAGERY['auraflow-ai']).toBeDefined()
      expect(TECHNICAL_IMAGERY['sera-migration']).toBeDefined()
      expect(TECHNICAL_IMAGERY['ledgerflow']).toBeDefined()
    })
  })

  describe('getTagProjectCount', () => {
    it('returns the correct count of projects containing a tag, case-insensitive', () => {
      expect(getTagProjectCount('React', mockProjects)).toBe(2)
      expect(getTagProjectCount('react', mockProjects)).toBe(2)
      expect(getTagProjectCount('Node.js', mockProjects)).toBe(2)
      expect(getTagProjectCount('Vue', mockProjects)).toBe(1)
      expect(getTagProjectCount('Angular', mockProjects)).toBe(0)
    })
  })

  describe('getRelatedProjects', () => {
    it('returns up to 2 related projects sorted by tag overlap', () => {
      const currentProj = mockProjects[0] // Tags: React, TypeScript, Node.js
      
      const related = getRelatedProjects(currentProj, mockProjects)
      
      expect(related).toHaveLength(2) // It returns top 2 regardless of overlap being 0
      expect(related[0].id).toBe('2') // Higher overlap comes first
      expect(related[1].id).toBe('3')
    })

    it('excludes the current project from the results', () => {
      const currentProj = mockProjects[0]
      const related = getRelatedProjects(currentProj, mockProjects)
      
      expect(related.find(p => p.id === '1')).toBeUndefined()
    })

    it('sorts projects by overlap count and returns max 2', () => {
      const extendedMockProjects: Project[] = [
        ...mockProjects,
        {
          id: '4',
          title: 'Project 4',
          description: 'Desc 4',
          date: '2024',
          tags: ['React', 'TypeScript', 'Node.js', 'Jest'], // High overlap with 1
          metrics: [],
          gallery: []
        },
        {
          id: '5',
          title: 'Project 5',
          description: 'Desc 5',
          date: '2024',
          tags: ['React'], // Low overlap with 1
          metrics: [],
          gallery: []
        },
      ]
      
      const currentProj = extendedMockProjects[0] // id: 1
      const related = getRelatedProjects(currentProj, extendedMockProjects)
      
      expect(related).toHaveLength(2)
      // Project 4 has 3 overlapping tags, Project 2 has 2 overlapping tags, Project 5 has 1
      expect(related[0].id).toBe('4')
      expect(related[1].id).toBe('2')
    })
  })
})
