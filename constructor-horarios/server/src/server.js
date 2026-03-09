import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initializeDatabase } from './models/database.js';
import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = dirname(fileURLToPath(import.meta.url));
const CLIENT_DIR = join(__dirname, '../../client');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/client', express.static(CLIENT_DIR));

app.get('/', (req, res) => {
  res.sendFile(join(CLIENT_DIR, 'index.html'));
});

// Rutas
app.use('/api', apiRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Inicializar base de datos y servidor
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   Constructor de Horarios - API       ║
║   Server running on port ${PORT}      ║
╚════════════════════════════════════════╝
      `);
    });
  })
  .catch(err => {
    console.error('❌ Error iniciando servidor:', err);
    process.exit(1);
  });
