import { initializeDatabase, runQuery, allQuery } from '../models/database.js';

/**
 * Script para crear datos de ejemplo en la base de datos
 */
async function seedDatabase() {
  try {
    await initializeDatabase();

    const sampleData = [
      // Facultad de Ingenieria - Carrera: Ingeniería de Sistemas
      {
        codigo_materia: 'IS001',
        nombre_materia: 'Programación I',
        grupo: '01',
        carrera: 'Ingeniería de Sistemas',
        facultad: 'Facultad de Ingeniería',
        dia: 'L',
        hora_inicio: 8,
        hora_fin: 10,
        sala: 'A101',
        edificio: 'Bloque A',
        sede: 'Bogotá',
        docente: 'Dr. García López',
        semestre: '2026-1'
      },
      {
        codigo_materia: 'IS001',
        nombre_materia: 'Programación I',
        grupo: '02',
        carrera: 'Ingeniería de Sistemas',
        facultad: 'Facultad de Ingeniería',
        dia: 'L',
        hora_inicio: 10,
        hora_fin: 12,
        sala: 'A102',
        edificio: 'Bloque A',
        sede: 'Bogotá',
        docente: 'Ing. María Rodríguez',
        semestre: '2026-1'
      },
      {
        codigo_materia: 'IS001',
        nombre_materia: 'Programación I',
        grupo: '03',
        carrera: 'Ingeniería de Sistemas',
        facultad: 'Facultad de Ingeniería',
        dia: 'W',
        hora_inicio: 8,
        hora_fin: 10,
        sala: 'A103',
        edificio: 'Bloque A',
        sede: 'Bogotá',
        docente: 'Ing. Carlos Pérez',
        semestre: '2026-1'
      },
      {
        codigo_materia: 'IS002',
        nombre_materia: 'Estructuras de Datos',
        grupo: '01',
        carrera: 'Ingeniería de Sistemas',
        facultad: 'Facultad de Ingeniería',
        dia: 'M',
        hora_inicio: 10,
        hora_fin: 12,
        sala: 'B201',
        edificio: 'Bloque B',
        sede: 'Bogotá',
        docente: 'PhD. Juan Martínez',
        semestre: '2026-1'
      },
      {
        codigo_materia: 'IS002',
        nombre_materia: 'Estructuras de Datos',
        grupo: '02',
        carrera: 'Ingeniería de Sistemas',
        facultad: 'Facultad de Ingeniería',
        dia: 'J',
        hora_inicio: 14,
        hora_fin: 16,
        sala: 'B202',
        edificio: 'Bloque B',
        sede: 'Bogotá',
        docente: 'Ing. Sandra López',
        semestre: '2026-1'
      },
      // Facultad de Ciencias - Carrera: Matemáticas
      {
        codigo_materia: 'MAT101',
        nombre_materia: 'Cálculo I',
        grupo: '01',
        carrera: 'Matemáticas',
        facultad: 'Facultad de Ciencias',
        dia: 'L',
        hora_inicio: 8,
        hora_fin: 10,
        sala: 'C301',
        edificio: 'Bloque C',
        sede: 'Bogotá',
        docente: 'Dr. Fernando Gómez',
        semestre: '2026-1'
      },
      {
        codigo_materia: 'MAT101',
        nombre_materia: 'Cálculo I',
        grupo: '02',
        carrera: 'Matemáticas',
        facultad: 'Facultad de Ciencias',
        dia: 'M',
        hora_inicio: 10,
        hora_fin: 12,
        sala: 'C302',
        edificio: 'Bloque C',
        sede: 'Bogotá',
        docente: 'Dra. Patricia Sánchez',
        semestre: '2026-1'
      },
      {
        codigo_materia: 'MAT102',
        nombre_materia: 'Álgebra Lineal',
        grupo: '01',
        carrera: 'Matemáticas',
        facultad: 'Facultad de Ciencias',
        dia: 'W',
        hora_inicio: 14,
        hora_fin: 16,
        sala: 'C303',
        edificio: 'Bloque C',
        sede: 'Bogotá',
        docente: 'Dr. Roberto Díaz',
        semestre: '2026-1'
      },
      // Facultad de Administración - Carrera: Administración de Empresas
      {
        codigo_materia: 'ADM001',
        nombre_materia: 'Contabilidad Básica',
        grupo: '01',
        carrera: 'Administración de Empresas',
        facultad: 'Facultad de Administración',
        dia: 'L',
        hora_inicio: 14,
        hora_fin: 16,
        sala: 'D401',
        edificio: 'Bloque D',
        sede: 'Bogotá',
        docente: 'Contador Juan Villa',
        semestre: '2026-1'
      },
      {
        codigo_materia: 'ADM001',
        nombre_materia: 'Contabilidad Básica',
        grupo: '02',
        carrera: 'Administración de Empresas',
        facultad: 'Facultad de Administración',
        dia: 'J',
        hora_inicio: 10,
        hora_fin: 12,
        sala: 'D402',
        edificio: 'Bloque D',
        sede: 'Bogotá',
        docente: 'Contador Laura Acosta',
        semestre: '2026-1'
      },
      {
        codigo_materia: 'ADM002',
        nombre_materia: 'Gestión Empresarial',
        grupo: '01',
        carrera: 'Administración de Empresas',
        facultad: 'Facultad de Administración',
        dia: 'W',
        hora_inicio: 16,
        hora_fin: 18,
        sala: 'D403',
        edificio: 'Bloque D',
        sede: 'Bogotá',
        docente: 'Mg. Paulo Ramírez',
        semestre: '2026-1'
      }
    ];

    console.log('\n📚 Sembrando base de datos con datos de ejemplo...\n');

    let inserados = 0;
    for (const horario of sampleData) {
      try {
        await runQuery(
          `INSERT INTO horarios 
          (codigo_materia, nombre_materia, grupo, carrera, dia, hora_inicio, hora_fin, sala, edificio, sede, docente, semestre)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            horario.codigo_materia,
            horario.nombre_materia,
            horario.grupo,
            horario.carrera,
            horario.dia,
            horario.hora_inicio,
            horario.hora_fin,
            horario.sala,
            horario.edificio,
            horario.sede,
            horario.docente,
            horario.semestre
          ]
        );
        inserados++;
      } catch (e) {
        // Ignorar duplicados
      }
    }

    console.log(`✓ ${inserados} registros insertados\n`);

    // Mostrar estadísticas
    const materias = await allQuery('SELECT DISTINCT nombre_materia, COUNT(*) as grupos FROM horarios WHERE semestre = ? GROUP BY nombre_materia', ['2026-1']);
    const carreras = await allQuery('SELECT DISTINCT carrera FROM horarios WHERE semestre = ?', ['2026-1']);
    const facultades = await allQuery('SELECT DISTINCT carrera FROM horarios WHERE semestre = ? ORDER BY carrera', ['2026-1']);

    console.log('════════════════════════════════════');
    console.log('ESTADÍSTICAS');
    console.log('════════════════════════════════════');
    console.log(`Facultades: ${new Set(carreras.map(c => c.carrera.split('/')[0])).size}`);
    console.log(`Carreras: ${carreras.length}`);
    console.log(`Materias: ${materias.length}`);
    const totalGrupos = materias.reduce((sum, m) => sum + m.grupos, 0);
    console.log(`Grupos totales: ${totalGrupos}`);
    console.log('════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedDatabase();
