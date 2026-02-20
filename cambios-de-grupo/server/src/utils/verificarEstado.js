import { initializeDatabase, allQuery, closeDatabase } from '../models/database.js';

async function verificarEstado() {
  try {
    await initializeDatabase();

    const estudiantes = await allQuery('SELECT COUNT(*) as count FROM estudiantes');
    const solicitudes = await allQuery('SELECT COUNT(*) as count FROM solicitudes_cambio');
    const horarios = await allQuery('SELECT COUNT(*) as count FROM horarios');

    console.log('\n📊 Estado de la base de datos:\n');
    console.log(`  Estudiantes: ${estudiantes[0].count} registros`);
    console.log(`  Solicitudes: ${solicitudes[0].count} registros`);
    console.log(`  Horarios: ${horarios[0].count} registros\n`);

    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

verificarEstado();
