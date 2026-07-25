/* eslint-disable */
import fs from 'fs';
import { getDb, saveDb } from '@/shared/lib/db';

jest.mock('fs');

describe('db.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('getDb should create a default db file if it does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ status: 'available', testimonials: [] }));

    const data = getDb();

    expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('data.json'));
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('data.json'),
      expect.stringContaining('"status":"available"')
    );
    expect(data.status).toBe('available');
  });

  it('getDb should return data if file exists', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({ status: 'busy', testimonials: [] }));

    const data = getDb();

    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(data.status).toBe('busy');
  });

  it('saveDb should write data to the db file', () => {
    const mockData = { status: 'available', testimonials: [{ id: 1 }] };
    saveDb(mockData);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('data.json'),
      JSON.stringify(mockData, null, 2)
    );
  });
});
