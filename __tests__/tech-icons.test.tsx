/* eslint-disable */
import { getTechIconAndColor } from '@/shared/lib/tech-icons';
import { render } from '@testing-library/react';

describe('tech-icons.tsx', () => {
  it('returns correctly for Node.js', () => {
    const { color, icon } = getTechIconAndColor('Node.js');
    expect(color).toBe('text-[#68a063]');
    expect(icon).toBeDefined();
  });

  it('returns correctly for Python', () => {
    const { color } = getTechIconAndColor('Python');
    expect(color).toBe('text-[#3776AB]');
  });

  it('returns correctly for Redis', () => {
    const { color } = getTechIconAndColor('Redis');
    expect(color).toBe('text-[#DC382D]');
  });

  it('returns correctly for PostgreSQL', () => {
    const { color } = getTechIconAndColor('PostgreSQL');
    expect(color).toBe('text-[#4169E1]');
  });

  it('returns correctly for NestJS', () => {
    const { color } = getTechIconAndColor('NestJS');
    expect(color).toBe('text-[#E0234E]');
  });

  it('returns correctly for Kubernetes', () => {
    const { color } = getTechIconAndColor('Kubernetes');
    expect(color).toBe('text-[#326CE5]');
  });

  it('returns correctly for MongoDB', () => {
    const { color } = getTechIconAndColor('MongoDB');
    expect(color).toBe('text-[#47A248]');
  });

  it('returns correctly for Golang', () => {
    const { color } = getTechIconAndColor('Golang');
    expect(color).toBe('text-[#00ADD8]');
  });

  it('returns correctly for Azure', () => {
    const { color } = getTechIconAndColor('Azure');
    expect(color).toBe('text-[#0089D6]');
  });

  it('returns correctly for Laravel', () => {
    const { color } = getTechIconAndColor('Laravel');
    expect(color).toBe('text-[#FF2D20]');
  });

  it('returns correctly for Concurrency', () => {
    const { color } = getTechIconAndColor('Concurrency');
    expect(color).toBe('text-[#FFA500]');
  });

  it('returns correctly for Microservices', () => {
    const { color } = getTechIconAndColor('Microservices');
    expect(color).toBe('text-sky-400');
  });

  it('returns correctly for SQL', () => {
    const { color } = getTechIconAndColor('SQL');
    expect(color).toBe('text-indigo-400');
  });

  it('returns correctly for IoT', () => {
    const { color } = getTechIconAndColor('IoT');
    expect(color).toBe('text-teal-400');
  });

  it('returns correctly for Compliance', () => {
    const { color } = getTechIconAndColor('Compliance');
    expect(color).toBe('text-emerald-400');
  });

  it('returns fallback for unknown tag', () => {
    const { color } = getTechIconAndColor('UnknownTag');
    expect(color).toBe('text-white/80');
  });
});
