import sqlite3 from 'sqlite3';
import { RedemptionService } from '../src/services/RedemptionService';

function initializeDatabaseSchema(db: sqlite3.Database): Promise<void> {
  return new Promise((resolve, reject) => {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS redemption_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_name TEXT NOT NULL,
        redeemed_at INTEGER NOT NULL
      );
    `;

    db.run(createTableSQL, (error) => {
      if (error) {
        console.error('Error creating tables', error);
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

describe('RedemptionService', () => {
  let redemptionService: RedemptionService;
  let db: sqlite3.Database;

  beforeEach(async () => {
    db = new sqlite3.Database(':memory:', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
    await initializeDatabaseSchema(db);
    redemptionService = new RedemptionService(db);
  });

  afterEach(() => {
    db.close();
  });

  it('should allow a team to redeem a gift if they have not already', (done) => {
    const teamName = 'TeamA';

    redemptionService.canRedeem(teamName, (eligibleBefore) => {
      // Check if team is eligible before redemption
      expect(eligibleBefore).toBe(true);

      redemptionService.redeemGift(teamName, (success) => {
        // Check if redemption is successful
        expect(success).toBe(true);

        redemptionService.canRedeem(teamName, (eligibleAfter) => {
          // Check if team is no longer eligible after redemption
          expect(eligibleAfter).toBe(false);
          done();
        });
      });
    });
  });

  it('should not allow a team to redeem a gift if they have already redeemed one this year', (done) => {
    const teamName = 'TeamB';

    redemptionService.redeemGift(teamName, (success) => {
      // Check if redemption is successful
      expect(success).toBe(true);

      redemptionService.canRedeem(teamName, (eligible) => {
        // Check if team is not eligible to redeem again
        expect(eligible).toBe(false);
        done();
      });
    });
  });

  
});
