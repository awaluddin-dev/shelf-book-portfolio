import { getTechIconAndColor } from '@/shared/lib/tech-icons';

describe('tech-icons', () => {
  it('should return correct icon for node', () => {
    const { color } = getTechIconAndColor('Node.js');
    expect(color).toBe('text-[#68a063]');
  });
  it('should return correct icon for python', () => {
    const { color } = getTechIconAndColor('Python');
    expect(color).toBe('text-[#3776AB]');
  });
  it('should return correct icon for redis', () => {
    const { color } = getTechIconAndColor('Redis');
    expect(color).toBe('text-[#DC382D]');
  });
  it('should return correct icon for postgresql', () => {
    const { color } = getTechIconAndColor('PostgreSQL');
    expect(color).toBe('text-[#4169E1]');
  });
  it('should return correct icon for nestjs', () => {
    const { color } = getTechIconAndColor('NestJS');
    expect(color).toBe('text-[#E0234E]');
  });
  it('should return correct icon for kubernetes', () => {
    const { color } = getTechIconAndColor('Kubernetes');
    expect(color).toBe('text-[#326CE5]');
  });
  it('should return correct icon for mongodb', () => {
    const { color } = getTechIconAndColor('MongoDB');
    expect(color).toBe('text-[#47A248]');
  });
  it('should return correct icon for golang', () => {
    const { color } = getTechIconAndColor('Golang');
    expect(color).toBe('text-[#00ADD8]');
  });
  it('should return correct icon for azure', () => {
    const { color } = getTechIconAndColor('Azure');
    expect(color).toBe('text-[#0089D6]');
  });
  it('should return correct icon for laravel', () => {
    const { color } = getTechIconAndColor('Laravel');
    expect(color).toBe('text-[#FF2D20]');
  });
  it('should return correct icon for concurrency', () => {
    const { color } = getTechIconAndColor('Concurrency');
    expect(color).toBe('text-[#FFA500]');
  });
  it('should return correct icon for microservices', () => {
    const { color } = getTechIconAndColor('Microservices');
    expect(color).toBe('text-sky-400');
  });
  it('should return correct icon for sql', () => {
    const { color } = getTechIconAndColor('SQL');
    expect(color).toBe('text-indigo-400');
  });
  it('should return correct icon for iot', () => {
    const { color } = getTechIconAndColor('IoT');
    expect(color).toBe('text-teal-400');
  });
  it('should return correct icon for compliance', () => {
    const { color } = getTechIconAndColor('Compliance');
    expect(color).toBe('text-emerald-400');
  });
  it('should return default icon', () => {
    const { color } = getTechIconAndColor('Unknown');
    expect(color).toBe('text-white/80');
  });
});
