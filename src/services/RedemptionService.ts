import { db } from '../utils/database';
import { RedemptionRecord } from '../models/RedemptionRecord';

export class RedemptionService {
  // Determine the current year
  private getCurrentYear(): number {
    return new Date().getFullYear();
  }

  // Extract the year from a timestamp
  private getYearFromTimestamp(timestamp: number): number {
    return new Date(timestamp).getFullYear();
  }

  // Check if a team is eligible to redeem a gift this season (year).
  public canRedeem(teamName: string, callback: (eligible: boolean) => void): void {
    const sql = `SELECT redeemed_at FROM redemption_records WHERE team_name = ? ORDER BY redeemed_at DESC LIMIT 1`;
    
    db.get(sql, [teamName], (err, row: RedemptionRecord) => {
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

  // Redeem a gift for a team.
  public redeemGift(teamName: string, callback: (success: boolean) => void): void {
    this.canRedeem(teamName, (eligible) => {
      if (!eligible) {
        console.log(`Team ${teamName} has already redeemed their gift for this season.`);
        callback(false);
        return;
      }

      const redeemedAt = Date.now();
      const sql = `INSERT INTO redemption_records (team_name, redeemed_at) VALUES (?, ?)`;
      
      db.run(sql, [teamName, redeemedAt], function(err) {
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