import express, { Request, Response } from 'express';
import { StaffService } from './services/StaffService';
import { RedemptionService } from './services/RedemptionService';

const app = express();
const port = 3000;

const staffService = new StaffService('data/test-staff-id-to-team.csv');
const redemptionService = new RedemptionService();

async function startServer() {
  await staffService.init(); 
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

app.get('/redeem/:staffId', async (req: Request, res: Response) => {
  const staffId = req.params.staffId;
  const teamName = staffService.getTeamNameByStaffId(staffId); 

  if (!teamName) {
    return res.status(404).send('Staff ID not found.');
  }

  if (redemptionService.canRedeem(teamName)) {
    redemptionService.redeemGift(teamName);
    res.send(`Gift redeemed for team ${teamName}.`);
  } else {
    res.send(`Team ${teamName} has already redeemed their gift.`);
  }
});

startServer().catch(console.error);
