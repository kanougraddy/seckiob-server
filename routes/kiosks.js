import express from 'express';
import { v4 as uuid } from 'uuid';
import { readDB, writeDB } from '../store/db.js';

export const router = express.Router();

router.get('/', (req,res)=> res.json(readDB().kiosks));

router.post('/', (req,res)=>{
  const { name, lat, lng } = req.body || {};
  if(!name) return res.status(400).json({ error:'invalid_request' });
  const k = { id: uuid(), name, lat: Number(lat)||0, lng: Number(lng)||0, active: true };
  const db = readDB();
  db.kiosks.unshift(k); writeDB(db); res.json(k);
});

router.post('/:id/toggle', (req,res)=>{
  const db = readDB();
  const k = db.kiosks.find(x=>x.id===req.params.id);
  if(!k) return res.status(404).json({ error:'not_found' });
  k.active = !k.active; writeDB(db); res.json(k);
});
