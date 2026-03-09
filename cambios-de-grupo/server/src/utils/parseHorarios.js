import HorariosParser from './HorariosParser.js';
import { initializeDatabase, closeDatabase, allQuery, runQuery } from '../models/database.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Script para procesar los PDFs de horarios
 * Uso: node parseHorarios.js [ruta_carpeta_pdfs] [semestre]
 * Ejemplo: node parseHorarios.js ../../../Horarios 2026-1
 */

async function main() {
  const pdfFolder = process.argv[2] || '../../../../Horarios';
  const semestre = process.argv[3] || '2026-1';

  const absolutePath = join(__dirname, pdfFolder);

  console.log(`\n📚 Cargador de Horarios desde PDFs`);
  console.log(`════════════════════════════════════`);
  console.log(`Carpeta: ${absolutePath}`);
  console.log(`Semestre: ${semestre}\n`);

  try {
    // Inicializar BD
    await initializeDatabase();

    // Limpiar semestre para recargar con datos actualizados
    await runQuery('DELETE FROM horarios WHERE semestre = ?', [semestre]);

    // Buscar PDFs
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Carpeta no encontrada: ${absolutePath}`);
    }

    const archivos = fs.readdirSync(absolutePath)
      .filter(f => f.toLowerCase().endsWith('.pdf'))
      .map(f => join(absolutePath, f));

    if (archivos.length === 0) {
      throw new Error(`No se encontraron archivos PDF en ${absolutePath}`);
    }

    console.log(`Encontrados ${archivos.length} archivos PDF\n`);

    const parser = new HorariosParser();
    let totalProcesados = 0;

    // Procesar cada PDF
    for (const archivo of archivos) {
      try {
        const guardados = await parser.procesarYGuardarHorarios(archivo, semestre);
        totalProcesados += guardados;
      } catch (error) {
        console.error(`⚠️  Error procesando ${archivo}:`, error.message);
      }
    }

    // Mostrar resumen
    const totalHorarios = await allQuery(
      'SELECT COUNT(*) as total FROM horarios WHERE semestre = ?',
      [semestre]
    );

    const materiasUnicas = await allQuery(
      'SELECT COUNT(DISTINCT codigo_materia) as total FROM horarios WHERE semestre = ?',
      [semestre]
    );

    const gruposUnicos = await allQuery(
      'SELECT COUNT(DISTINCT grupo) as total FROM horarios WHERE semestre = ?',
      [semestre]
    );

    console.log(`\n════════════════════════════════════`);
    console.log(`✅ PROCESO COMPLETADO`);
    console.log(`════════════════════════════════════`);
    console.log(`Total de horarios cargados: ${totalHorarios[0]?.total || 0}`);
    console.log(`Materias únicas: ${materiasUnicas[0]?.total || 0}`);
    console.log(`Grupos únicos: ${gruposUnicos[0]?.total || 0}`);
    console.log(`════════════════════════════════════\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

main();
