import { initializeDatabase, runQuery, allQuery, closeDatabase } from '../models/database.js';

/**
 * Script para actualizar docentes vacíos con "PROFESOR SIN ASIGNAR"
 */
async function updateDocentes() {
  try {
    await initializeDatabase();

    console.log('\n📚 Actualizando docentes...\n');

    // Primero limpiar todos los docentes vacíos
    const resultado = await runQuery(`
      UPDATE horarios 
      SET docente = 'PROFESOR SIN ASIGNAR' 
      WHERE docente IS NULL OR docente = ''
    `);

    console.log(`✅ Actualizados todos los registros vacíos a "PROFESOR SIN ASIGNAR"\n`);
    console.log('════════════════════════════════════\n');

    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateDocentes();
