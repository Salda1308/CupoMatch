import express from 'express';
import { allQuery, getQuery } from '../models/database.js';

const router = express.Router();

// GET /api/semestres - Obtener semestres disponibles
router.get('/semestres', async (req, res) => {
  try {
    const result = await allQuery(`
      SELECT DISTINCT semestre
      FROM horarios
      ORDER BY semestre DESC
    `);
    
    const semestres = result.map(r => r.semestre);
    res.json(semestres);
  } catch (error) {
    console.error('Error obteniendo semestres:', error);
    res.status(500).json({ error: 'Error obteniendo semestres' });
  }
});

// GET /api/carreras - Obtener carreras disponibles
router.get('/carreras', async (req, res) => {
  try {
    const { semestre } = req.query;
    
    let query = 'SELECT DISTINCT carrera FROM horarios';
    let params = [];
    
    if (semestre) {
      query += ' WHERE semestre = ?';
      params = [semestre];
    }
    
    query += ' ORDER BY carrera';
    
    const result = await allQuery(query, params);
    const carreras = result.map(r => r.carrera);
    
    res.json(carreras);
  } catch (error) {
    console.error('Error obteniendo carreras:', error);
    res.status(500).json({ error: 'Error obteniendo carreras' });
  }
});

// GET /api/materias - Buscar materias
router.get('/materias', async (req, res) => {
  try {
    const { carrera, semestre, buscar } = req.query;
    
    if (!carrera || !semestre) {
      return res.status(400).json({ 
        error: 'Se requieren parámetros carrera y semestre' 
      });
    }

    let query = `
      SELECT DISTINCT
        codigo_materia as codigo,
        nombre_materia as nombre
      FROM horarios
      WHERE carrera = ? AND semestre = ?
    `;
    let params = [carrera, semestre];

    if (buscar) {
      query += ` AND (nombre_materia LIKE ? OR codigo_materia LIKE ?)`;
      const searchTerm = `%${buscar}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY nombre_materia';

    const materias = await allQuery(query, params);
    res.json(materias);
  } catch (error) {
    console.error('Error obteniendo materias:', error);
    res.status(500).json({ error: 'Error obteniendo materias' });
  }
});

// GET /api/grupos - Obtener grupos de una materia
router.get('/grupos', async (req, res) => {
  try {
    const { codigo_materia, semestre } = req.query;

    if (!codigo_materia || !semestre) {
      return res.status(400).json({ 
        error: 'Se requieren parámetros codigo_materia y semestre' 
      });
    }

    const grupos = await allQuery(`
      SELECT
        id,
        grupo,
        docente,
        dia,
        hora_inicio,
        hora_fin,
        sala,
        edificio,
        sede,
        inscritos,
        max_inscritos
      FROM horarios
      WHERE codigo_materia = ? AND semestre = ?
      ORDER BY grupo, dia, hora_inicio
    `, [codigo_materia, semestre]);

    res.json(grupos);
  } catch (error) {
    console.error('Error obteniendo grupos:', error);
    res.status(500).json({ error: 'Error obteniendo grupos' });
  }
});

// GET /api/sedes - Obtener sedes
router.get('/sedes', async (req, res) => {
  try {
    const { semestre } = req.query;
    
    let query = 'SELECT DISTINCT sede FROM horarios';
    let params = [];
    
    if (semestre) {
      query += ' WHERE semestre = ?';
      params = [semestre];
    }
    
    query += ' ORDER BY sede';
    
    const result = await allQuery(query, params);
    const sedes = result.map(r => r.sede);
    
    res.json(sedes);
  } catch (error) {
    console.error('Error obteniendo sedes:', error);
    res.status(500).json({ error: 'Error obteniendo sedes' });
  }
});

// GET /api/horario-materia - Detalles completos de una materia para un grupo
router.get('/horario-materia', async (req, res) => {
  try {
    const { codigo_materia, grupo, semestre } = req.query;

    if (!codigo_materia || !grupo || !semestre) {
      return res.status(400).json({ 
        error: 'Se requieren parámetros codigo_materia, grupo y semestre' 
      });
    }

    const resultado = await allQuery(`
      SELECT
        id,
        codigo_materia,
        nombre_materia,
        grupo,
        docente,
        dia,
        hora_inicio,
        hora_fin,
        sala,
        edificio,
        sede,
        inscritos,
        max_inscritos
      FROM horarios
      WHERE codigo_materia = ? AND grupo = ? AND semestre = ?
      ORDER BY dia, hora_inicio
    `, [codigo_materia, grupo, semestre]);

    res.json(resultado);
  } catch (error) {
    console.error('Error obteniendo horario:', error);
    res.status(500).json({ error: 'Error obteniendo horario' });
  }
});

export default router;
