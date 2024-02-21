import { RedemptionRecord } from '../models/RedemptionRecord';

export class RedemptionService {
  private redemptionRecords: RedemptionRecord[] = [];

  // Determine the current year
  private getCurrentYear(): number {
    return new Date().getFullYear();
  }

  // Extract the year from a timestamp
  private getYearFromTimestamp(timestamp: number): number {
    return new Date(timestamp).getFullYear();
  }

  // Check if a team is eligible to redeem a gift this season (year).
  public canRedeem(teamName: string): boolean {
    const lastRedemptionRecord = this.redemptionRecords.find(record => record.team_name === teamName);
    if (!lastRedemptionRecord) return true; // Team has not redeemed before

    const lastRedemptionYear = this.getYearFromTimestamp(lastRedemptionRecord.redeemed_at);
    const currentYear = this.getCurrentYear();
    return lastRedemptionYear < currentYear;
  }

  // Redeem a gift for a team.
  public redeemGift(teamName: string): boolean {
    if (this.canRedeem(teamName)) {
      const redeemedAt = Date.now(); 
      this.redemptionRecords.push({ team_name: teamName, redeemed_at: redeemedAt });
      console.log(`Gift redeemed for team: ${teamName} at ${redeemedAt}`);
      return true;
    } else {
      console.log(`Team ${teamName} has already redeemed their gift for this season.`);
      return false;
    }
  }

  // Method to clear the redemption records - mainly for testing
  public clearRedemptions() {
    this.redemptionRecords = [];
  }
}