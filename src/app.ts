import express, { Request, Response } from 'express';
import { StaffService } from './services/StaffService';
import { RedemptionService } from './services/RedemptionService';

const app = express();
const port = process.env.PORT || 3000;

// Update the path to the CSV file
const staffService = new StaffService('data/test-staff-id-to-team.csv');
const redemptionService = new RedemptionService();

async function startServer() {
  console.log("Server starting...");
  await staffService.init(); 
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
