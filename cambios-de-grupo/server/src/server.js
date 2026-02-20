import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase, closeDatabase } from './models/database.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

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
