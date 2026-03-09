import { initializeDatabase, runQuery, closeDatabase } from '../models/database.js';

/**
 * Script para limpiar datos de prueba (estudiantes y solicitudes)
 * Mantiene los horarios intactos
 */
async function limpiarDatosPrueba() {
  try {
    await initializeDatabase();

    console.log('\n🧹 Limpiando datos de prueba...\n');

    // Eliminar contactos interesados
    await runQuery('DELETE FROM contactos_interesados');
    console.log('✓ Contactos interesados eliminados');

    // Eliminar solicitudes de cambio
    await runQuery('DELETE FROM solicitudes_cambio');
    console.log('✓ Solicitudes de cambio eliminadas');

    // Eliminar estudiantes
    await runQuery('DELETE FROM estudiantes');
    console.log('✓ Estudiantes eliminados');

    console.log('\n✅ Datos de prueba eliminados correctamente');
    console.log('Los horarios se mantienen intactos\n');
    console.log('════════════════════════════════════\n');

    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

limpiarDatosPrueba();
