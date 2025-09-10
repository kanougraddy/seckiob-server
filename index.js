import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { ensureDB } from './store/db.js';
import { router as paymentsRouter } from './routes/payments.js';
import { router as subsRouter } from './routes/subscriptions.js';
import { router as agentsRouter } from './routes/agents.js';
import { router as kiosksRouter } from './routes/kiosks.js';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(cors({ origin: process.env.ALLOWED_ORIGIN?.split(',') || true }));

ensureDB();

app.get('/health', (_, res) => res.json({ ok: true }));
app.get('/success', (req, res) => res.send('<h1>Payment success</h1>'));
app.get('/cancel', (req, res) => res.send('<h1>Payment canceled</h1>'));

app.use('/api/payments', paymentsRouter);
app.use('/api/subscriptions', subsRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/kiosks', kiosksRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'server_error', message: err?.message || String(err) });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Seckiob server listening on :${port}`));
