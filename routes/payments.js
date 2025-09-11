import express from 'express';
import { v4 as uuid } from 'uuid';
import { readDB, writeDB } from '../store/db.js';
import { processMobileMoney } from '../providers/mobilemoney.js';
import { createStripeCheckout } from '../providers/stripe.js';

export const router = express.Router();

router.post('/initiate', async (req, res, next) => {
  try{
    const { client, plan, provider } = req.body || {};
    if(!client || !plan) return res.status(400).json({ error:'invalid_request' });
    const amount = plan === 'PRO' ? 30 : 15;
    const db = readDB();
    const id = uuid();
    const payment = { id, client, amountUSD: amount, provider: provider || 'mock', status: 'pending', ref: null };
    db.payments.unshift(payment);
    writeDB(db);

    if ((provider || 'mock').toLowerCase()==='stripe'){
      const result = await createStripeCheckout({ client, amountUSD: amount });
      if (!result.ok) return res.json({ ok:false, message: result.message });
      payment.status = 'initiated';
      payment.ref = result.id;
      writeDB(db);
      return res.json({ ok:true, payment, checkoutUrl: result.url });
    }

    const result = await processMobileMoney(payment);
    payment.status = result.ok ? 'initiated' : 'failed';
    payment.ref = result.ref || null;
    writeDB(db);
    res.json({ ok: result.ok, payment });
  }catch(e){ next(e) }
});
