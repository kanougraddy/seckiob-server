import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

export function ensureDB(){
  if (!fs.existsSync(DB_PATH)){
    fs.writeFileSync(DB_PATH, JSON.stringify({
      subscriptions: [], payments: [], agents: [], sales: [], kiosks: [], sectors: []
    }, null, 2));
  }
}
export function readDB(){ ensureDB(); return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')); }
export function writeDB(db){ fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2)); }
