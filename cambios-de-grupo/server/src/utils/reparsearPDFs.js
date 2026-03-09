import { initializeDatabase, runQuery, closeDatabase } from '../models/database.js';
import HorariosParser from './HorariosParser.js';
import { join } from 'path';

/**
 * Script para re-parsear todos los PDFs y actualizar la base de datos
 */
async function reparsearPDFs() {
  try {
    await initializeDatabase();

    console.log('\n🔄 Re-parseando PDFs de horarios...\n');

    // Limpiar la tabla de horarios
    await runQuery('DELETE FROM horarios WHERE semestre = ?', ['2026-1']);
    console.log('✓ Tabla horarios limpiada\n');

    const parser = new HorariosParser();
    
    // Lista de PDFs
    const pdfPaths = [
      'c:\\Users\\Usuario\\Documents\\Aplicativo\\Horarios\\horarios_20261_Facultad_Ingenieria.pdf',
      'c:\\Users\\Usuario\\Documents\\Aplicativo\\Horarios\\horarios_20261_Facultad_Tecnologica.pdf',
      'c:\\Users\\Usuario\\Documents\\Aplicativo\\Horarios\\horarios_20261_Facultad_Ciencias_y_Ed.pdf',
      'c:\\Users\\Usuario\\Documents\\Aplicativo\\Horarios\\horarios_20261_Facultad_Ciencias_Mat_y_Nat.pdf',
      'c:\\Users\\Usuario\\Documents\\Aplicativo\\Horarios\\horarios_20261_Facultad_Medio_Ambiente.pdf',
      'c:\\Users\\Usuario\\Documents\\Aplicativo\\Horarios\\horarios_20261_Facultad_Ciencias_Salud.pdf',
      'c:\\Users\\Usuario\\Documents\\Aplicativo\\Horarios\\horarios_20261_Facultad_Artes.pdf',
      'c:\\Users\\Usuario\\Documents\\Aplicativo\\Horarios\\horarios_20261_Segunda_Lengua_IPAZUD.pdf'
    ];

    let totalGuardados = 0;

    for (const pdfPath of pdfPaths) {
      try {
        const guardados = await parser.procesarYGuardarHorarios(pdfPath, '2026-1');
        totalGuardados += guardados;
      } catch (error) {
        console.error(`❌ Error en ${pdfPath}:`, error.message);
      }
    }

    console.log(`\n✅ Total de horarios guardados: ${totalGuardados}`);
    console.log('════════════════════════════════════\n');

    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

reparsearPDFs();
