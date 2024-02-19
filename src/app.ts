import { readCsvFile } from './utils/csvReader';

const filePath = 'data/staff-id-to-team-mapping.csv';

readCsvFile(filePath).then((records) => {
  console.log(records);
}).catch((error) => {
  console.error('Error reading CSV file:', error);
});
