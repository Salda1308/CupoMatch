import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase, closeDatabase } from './models/database.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json({ charset: 'utf-8' }));
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});
app.use(cors({
  origin: (origin, callback) => {
    // Permitir localhost, 127.0.0.1 y variaciones locales
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001'
    ];
    
    // Permitir sin origin (requests desde misma máquina o sin Origin header)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

// Rutas
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Iniciar servidor
async function startServer() {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`\n╔═══════════════════════════════════════╗`);
      console.log(`║ 🚀 Servidor API ejecutándose en:    ║`);
      console.log(`║   http://localhost:${PORT}              ║`);
      console.log(`║ 🗄️  Base de datos: database.db       ║`);
      console.log(`╚═══════════════════════════════════════╝\n`);
    });

    process.on('SIGINT', async () => {
      console.log('\n\nCerrando servidor...');
      await closeDatabase();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

startServer();

export default app;
