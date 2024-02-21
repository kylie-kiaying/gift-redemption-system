import { Database } from 'sqlite3';
import { db as defaultDb } from '../utils/database';
import { RedemptionRecord } from '../models/RedemptionRecord';

export class RedemptionService {
  private db: Database;

  constructor(db: Database = defaultDb) {
    this.db = db;
  }

  private getCurrentYear(): number {
    return new Date().getFullYear();
  }

  private getYearFromTimestamp(timestamp: number): number {
    return new Date(timestamp).getFullYear();
  }

  public canRedeem(teamName: string, callback: (eligible: boolean) => void): void {
    const sql = `SELECT redeemed_at FROM redemption_records WHERE team_name = ? ORDER BY redeemed_at DESC LIMIT 1`;
    
    this.db.get(sql, [teamName], (err, row: RedemptionRecord | undefined) => {
      if (err) {
        console.error('Error querying database', err.message);
        callback(false);
        return;
      }
      if (!row) {
        callback(true); // Team has not redeemed before
        return;
      }

      const lastRedemptionYear = this.getYearFromTimestamp(row.redeemed_at);
      const currentYear = this.getCurrentYear();
      callback(lastRedemptionYear < currentYear);
    });
  }

  public redeemGift(teamName: string, callback: (success: boolean) => void): void {
    this.canRedeem(teamName, (eligible) => {
      if (!eligible) {
        console.log(`Team ${teamName} has already redeemed their gift for this season.`);
        callback(false);
        return;
      }

      const redeemedAt = Date.now();
      const sql = `INSERT INTO redemption_records (team_name, redeemed_at) VALUES (?, ?)`;
      
      this.db.run(sql, [teamName, redeemedAt], function(err) {
        if (err) {
          console.error('Error inserting redemption record', err.message);
          callback(false);
          return;
        }
        console.log(`Gift redeemed for team: ${teamName} at ${redeemedAt}`);
        callback(true);
      });
    });
  }
}
