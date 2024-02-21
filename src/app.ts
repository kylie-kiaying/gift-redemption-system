import express, { Request, Response } from 'express';
import { StaffService } from './services/StaffService';
import { RedemptionService } from './services/RedemptionService';

const app = express();
const port = 3000;

const staffService = new StaffService('data/test-staff-id-to-team.csv');
const redemptionService = new RedemptionService();

// Temporary test code
async function testStaffService() {
  console.log("Testing StaffService...");
  await staffService.init(); 
  const testStaffId = "1"; 
  const teamName = staffService.getTeamNameByStaffId(testStaffId);
  if (teamName) {
    console.log(`Found team name for staff ID ${testStaffId}: ${teamName}`);
  } else {
    console.error(`No team found for staff ID ${testStaffId}`);
  }
}

async function startServer() {
  console.log("Server starting...");
  await testStaffService();
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
