import { RedemptionRecord } from '../models/RedemptionRecord';

export class RedemptionService {
  private redemptionRecords: RedemptionRecord[] = [];
  
  // Check if a team has already redeemed their gift.
  public canRedeem(teamName: string): boolean {
    return !this.redemptionRecords.some(record => record.team_name === teamName);
  }

  // Redeem a gift for a team.
  public redeemGift(teamName: string): void {
    if (this.canRedeem(teamName)) {
      const redeemedAt = Date.now(); 
      this.redemptionRecords.push({ team_name: teamName, redeemed_at: redeemedAt });
      console.log(`Gift redeemed for team: ${teamName} at ${redeemedAt}`);
    } else {
      console.log(`Team ${teamName} has already redeemed their gift.`);
    }
  }
}