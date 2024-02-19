import express from 'express';
import { StaffService } from './services/StaffService';

const app = express();
const port = 3000;

const staffService = new StaffService('data/test-staff-id-to-team.csv');

app.get('/test/:staffId', async (req: Request, res: Response) => {
  const staffId = req.params.staffId;
  const teamName = await staffService.getTeamNameByStaffId(staffId);

  if (teamName) {
    res.send(`Team Name: ${teamName}`);
  } else {
    res.status(404).send('Staff ID not found.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
