import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Modules internes
import ensureDB from './store/db.js';
import paymentsRouter from './routes/payments.js';
import subsRouter from './routes/subscriptions.js';
import agentsRouter from './routes/agents.js';
import kiosksRouter from './routes/kiosks.js';

const app = express();

// Middlewares
app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: process.env.ALLOWED_ORIGIN?.split(',') || true }));
app.use(morgan('dev'));

// DB (si besoin, sinon garde sans effet)
ensureDB?.();

// Healthcheck (Render vérifie souvent cette route)
app.get('/health', (req, res) => res.json({ ok: true }));

// Routes API
app.use('/api/payments', paymentsRouter);
app.use('/api/subscriptions', subsRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/kiosks', kiosksRouter);

// 404 simple
app.use((req, res) => res.status(404).json({ error: 'Route non trouvée' }));

// Démarrage compatible Render
const PORT = process.env.PORT || 4000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`✅ Seckiob server listening on http://${HOST}:${PORT}`);
});
