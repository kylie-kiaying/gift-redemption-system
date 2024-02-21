import express, { Request, Response } from 'express';
import { StaffService } from './services/StaffService';
import { RedemptionService } from './services/RedemptionService';

const app = express();
const port = 3000;

const staffService = new StaffService('data/test-staff-id-to-team.csv');
const redemptionService = new RedemptionService();

// Assuming StaffService.init and getTeamNameByStaffId are synchronous or have been updated accordingly
async function startServer() {
  console.log("Server starting...");
  await staffService.init(); // Ensure StaffService is properly initialized (if async)
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

app.get('/redeem/:staffId', (req: Request, res: Response) => {
  const staffId = req.params.staffId;
  const teamName = staffService.getTeamNameByStaffId(staffId);

  if (!teamName) {
    return res.status(404).send('Staff ID not found.');
  }

  redemptionService.canRedeem(teamName, (eligible) => {
    if (eligible) {
      redemptionService.redeemGift(teamName, (success) => {
        if (success) {
          res.send(`Gift redeemed for team ${teamName}.`);
        } else {
          res.status(500).send('Error redeeming gift.');
        }
      });
    } else {
      res.send(`Team ${teamName} has already redeemed their gift.`);
    }
  });
});

startServer().catch(console.error);
