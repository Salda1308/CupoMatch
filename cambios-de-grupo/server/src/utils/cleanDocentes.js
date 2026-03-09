import { initializeDatabase, runQuery, closeDatabase } from '../models/database.js';

/**
 * Script para limpiar nombres aleatorios y dejar solo PROFESOR SIN ASIGNAR
 */
async function cleanDocentes() {
  try {
    await initializeDatabase();

    console.log('\n🧹 Limpiando profesores aleatorios...\n');

    // Actualizar todos los profesores que no sean del seed original
    await runQuery(`
      UPDATE horarios 
      SET docente = 'PROFESOR SIN ASIGNAR' 
      WHERE docente NOT IN (
        'Dr. García López', 
        'Ing. María Rodríguez', 
        'Dra. Carmen Silva', 
        'PhD. Roberto Martínez', 
        'Mg. Ana Torres', 
        'Dr. Luis Hernández', 
        'Ing. Patricia Morales', 
        'Dra. Isabel Ramírez', 
        'PhD. Miguel Castro', 
        'Dr. Sofia Jiménez', 
        'Ing. Jorge Vargas'
      )
    `);

    console.log(`✅ Profesores aleatorios reemplazados por "PROFESOR SIN ASIGNAR"\n`);
    console.log('════════════════════════════════════\n');

    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanDocentes();
