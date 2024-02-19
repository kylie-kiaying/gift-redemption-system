import { StaffRecord } from '../models/StaffRecord';
import { readCsvFile } from '../utils/csvReader';

export class StaffService {
  private staffRecords: StaffRecord[] = [];

  constructor(private filePath: string) {
    this.loadStaffRecords();
  }

  private async loadStaffRecords() {
    this.staffRecords = await readCsvFile(this.filePath);
  }

  public getTeamNameByStaffId(staffId: string): string | null {
    const record = this.staffRecords.find(record => record.staff_pass_id === staffId);
    return record ? record.team_name : null;
  }
}
