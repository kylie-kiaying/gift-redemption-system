import { RedemptionService } from '../src/services/RedemptionService';

describe('RedemptionService', () => {
  let redemptionService: RedemptionService;

  beforeEach(() => {
    redemptionService = new RedemptionService();
    redemptionService.clearRedemptions();
  });

  it('should allow a team to redeem a gift if they have not already', async () => {
    const teamName = 'TeamA';
    expect(await redemptionService.canRedeem(teamName)).toBe(true);
    
    // Simulate redeeming a gift
    await redemptionService.redeemGift(teamName);
    expect(await redemptionService.canRedeem(teamName)).toBe(false);
  });

  it('should not allow a team to redeem a gift if they have already done so', async () => {
    const teamName = 'TeamA';
    // Simulate an initial redemption
    await redemptionService.redeemGift(teamName);
    // Attempting another redemption should fail
    expect(await redemptionService.canRedeem(teamName)).toBe(false);
  });
});
