import express from 'express';
import { v4 as uuid } from 'uuid';
import { readDB, writeDB } from '../store/db.js';

const RATE = 0.05;
export const router = express.Router();

router.get('/commission', (req,res)=>{
  const db = readDB();
  const map = {};
  for(const s of db.sales){ map[s.agent]=(map[s.agent]||0)+Number(s.amountUSD)*RATE; }
  res.json({ rate: RATE, totals: Object.entries(map).map(([agent, commissionUSD])=>({agent,commissionUSD})) });
});

router.post('/agent',(req,res)=>{
  const { name } = req.body || {};
  if(!name) return res.status(400).json({ error:'invalid_request' });
  const db = readDB();
  const a = { id: uuid(), name };
  db.agents.unshift(a); writeDB(db); res.json(a);
});

router.post('/sale',(req,res)=>{
  const { client, agent, amountUSD } = req.body || {};
  if(!client || !agent || !amountUSD) return res.status(400).json({ error:'invalid_request' });
  const db = readDB();
  const s = { id: uuid(), client, agent, amountUSD: Number(amountUSD) };
  db.sales.unshift(s); writeDB(db);
  res.json({ sale: s, commissionUSD: Number(amountUSD)*RATE });
});
