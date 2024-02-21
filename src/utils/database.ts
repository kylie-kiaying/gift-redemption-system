import sqlite3, { Database } from 'sqlite3';
import { RedemptionRecord } from '../models/RedemptionRecord';

const DB_PATH = './data/redemptionService.db';

export class SQLiteDB {
    private db: Database;

    constructor() {
        this.db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error opening database', err.message);
            } else {
                console.log('Connected to the SQLite database.');
                this.initializeTables();
            }
        });
    }

    private initializeTables(): void {
        const sql = `
            CREATE TABLE IF NOT EXISTS redemption_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                team_name TEXT NOT NULL,
                redeemed_at INTEGER NOT NULL
            )
        `;
        this.db.run(sql, (err) => {
            if (err) {
                console.error('Error creating table', err.message);
            } else {
                console.log('Table created or already exists.');
            }
        });
    }

    // Query and print all records from the redemption_records table
    public showTable(): void {
      const sql = `SELECT * FROM redemption_records`;

      this.db.all(sql, [], (err, rows: RedemptionRecord[]) => { 
          if (err) {
              console.error('Error fetching data', err.message);
              return;
          }
          console.log('Redemption Records:');
          rows.forEach((row) => {
              console.log(`${row.id}: Team ${row.team_name} redeemed at ${new Date(row.redeemed_at).toLocaleString()}`);
          });
      });
    }

    public getDB(): Database {
        return this.db;
    }
}

const dbInstance = new SQLiteDB();
export const db = dbInstance.getDB();

// Uncomment the following line to print all records in the redemption_records table
// dbInstance.showTable();