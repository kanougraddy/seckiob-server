import express from 'express';
import { v4 as uuid } from 'uuid';
import { readDB, writeDB } from '../store/db.js';

export const router = express.Router();

router.get('/', (req,res)=> res.json(readDB().subscriptions));

router.post('/', (req, res) => {
  const { client, plan, agent } = req.body || {};
  if(!client || !plan) return res.status(400).json({ error:'invalid_request' });
  const sub = { id: uuid(), client, plan, paid: false, agent: agent || null };
  const db = readDB();
  db.subscriptions.unshift(sub);
  writeDB(db);
  res.json(sub);
});

router.post('/:id/pay', (req,res)=>{
  const { paid } = req.body || {};
  const db = readDB();
  const sub = db.subscriptions.find(s => s.id===req.params.id);
  if(!sub) return res.status(404).json({ error:'not_found' });
  sub.paid = !!paid;
  writeDB(db);
  res.json(sub);
});

router.get('/:id/access', (req,res)=>{
  const db = readDB();
  const sub = db.subscriptions.find(s => s.id===req.params.id);
  if(!sub) return res.status(404).json({ error:'not_found' });
  const map = {
    PRO: ['KIOSKS','BUSINESS','GPS','ACCOUNTING','AGENTS','VOICE_AI','REPORTS','MULTI_COUNTRY','I18N'],
    KIOSKS: ['KIOSKS','ACCOUNTING'],
    BUSINESS: ['BUSINESS']
  };
  const features = sub.paid ? (map[sub.plan] || []) : [];
  res.json({ client: sub.client, plan: sub.plan, paid: sub.paid, features });
});
