import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';

interface StaffRecord {
  staff_pass_id: string;
  team_name: string;
  created_at: string; 
}

export function readCsvFile(filePath: string): Promise<StaffRecord[]> {
  return new Promise((resolve, reject) => {
    const records: StaffRecord[] = [];
    fs.createReadStream(path.resolve(__dirname, '../../', filePath))
      .pipe(parse({
        columns: true,
        skip_empty_lines: true,
      }))
      .on('data', (record) => records.push(record))
      .on('end', () => resolve(records))
      .on('error', (error) => reject(error));
  });
}

