import express from 'express';
import { 
  verificarClaveEstudiante, 
  generarToken, 
  middleware_autenticacion 
} from '../middleware/autenticacion.js';
import { allQuery, runQuery, getQuery } from '../models/database.js';

const router = express.Router();

/**
 * POST /auth/login
 * Login simplificado: código de estudiante + teléfono
 * Retorna token de autenticación
 */
router.post('/auth/login', async (req, res) => {
  try {
    const { codigo, telefono, nombre } = req.body;

    if (!codigo || !telefono) {
      return res.status(400).json({ 
        error: 'Faltan datos requeridos',
        campos: ['codigo', 'telefono']
      });
    }

    // Validar teléfono - aceptar más formatos
    if (!/[\d\s\-\(\)\+]{10,}/.test(telefono.replace(/\s/g, ''))) {
      return res.status(400).json({ 
        error: 'Formato de teléfono inválido. Usa al menos 10 dígitos.',
        ejemplo: '+57 123 456 7890 o 3101234567'
      });
    }

    // Usar codigo como base para clave única
    // Numéricamente usar primeros 5 dígitos del teléfono
    const telefonoDigitos = telefono.replace(/\D/g, '');
    const numeroMateria = telefonoDigitos.slice(0, 1); // Usar primer dígito del teléfono

    const { estudiante, authKey } = await verificarClaveEstudiante(
      codigo,
      numeroMateria,
      telefono
    );

    // Actualizar nombre si se proporciona
    if (nombre && !estudiante.nombre) {
      await runQuery(
        'UPDATE estudiantes SET nombre = ? WHERE id = ?',
        [nombre, estudiante.id]
      );
    }

    const token = generarToken(estudiante, authKey);

    res.json({
      token,
      estudiante: {
        id: estudiante.id,
        codigo: estudiante.codigo_estudiante,
        telefono: estudiante.telefono,
        nombre: estudiante.nombre || nombre
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en autenticación', details: error.message });
  }
});

/**
 * GET /facultades
 * Obtener lista de facultades únicas
 */
router.get('/facultades', async (req, res) => {
  try {
    const { semestre = '2026-1' } = req.query;

    const facultades = await allQuery(`
      SELECT DISTINCT carrera as nombre
      FROM horarios
      WHERE semestre = ?
      ORDER BY nombre
    `, [semestre]);

    res.json(facultades.map(f => f.nombre));
  } catch (error) {
    console.error('Error obteniendo facultades:', error);
    res.status(500).json({ error: 'Error obteniendo facultades' });
  }
});

/**
 * GET /carreras
 * Obtener carreras por facultad
 * Query params: ?facultad=INGENIERIA&semestre=2026-1
 */
router.get('/carreras', async (req, res) => {
  try {
    const { facultad, semestre = '2026-1' } = req.query;

    if (!facultad) {
      return res.status(400).json({ error: 'Parámetro facultad requerido' });
    }

    const carreras = await allQuery(`
      SELECT DISTINCT carrera as nombre
      FROM horarios
      WHERE carrera LIKE ? AND semestre = ?
      ORDER BY nombre
    `, [`%${facultad}%`, semestre]);

    res.json(carreras.map(c => c.nombre));
  } catch (error) {
    console.error('Error obteniendo carreras:', error);
    res.status(500).json({ error: 'Error obteniendo carreras' });
  }
});

/**
 * GET /materias-carrera
 * Obtener materias de una carrera específica
 * Query params: ?carrera=INGENIERIA_CATASTRAL&semestre=2026-1
 */
router.get('/materias-carrera', async (req, res) => {
  try {
    const { carrera, semestre = '2026-1' } = req.query;

    if (!carrera) {
      return res.status(400).json({ error: 'Parámetro carrera requerido' });
    }

    const materias = await allQuery(`
      SELECT DISTINCT
        codigo_materia as codigo,
        nombre_materia as nombre,
        (SELECT COUNT(DISTINCT grupo) FROM horarios h2 
         WHERE h2.codigo_materia = h1.codigo_materia 
         AND h2.semestre = h1.semestre) as total_grupos
      FROM horarios h1
      WHERE carrera = ? AND semestre = ?
      ORDER BY nombre_materia
    `, [carrera, semestre]);

    res.json(materias);
  } catch (error) {
    console.error('Error obteniendo materias:', error);
    res.status(500).json({ error: 'Error obteniendo materias' });
  }
});

/**
 * GET /horarios
 * Obtener horarios de una materia o todos
 * Query params: ?materia=XXX&grupo=XXX&semestre=2026-1
 */
router.get('/horarios', async (req, res) => {
  try {
    const { materia, grupo, semestre = '2026-1', carrera } = req.query;

    let query = 'SELECT * FROM horarios WHERE semestre = ?';
    const params = [semestre];

    if (materia) {
      query += ' AND codigo_materia LIKE ?';
      params.push(`%${materia}%`);
    }

    if (grupo) {
      query += ' AND grupo LIKE ?';
      params.push(`%${grupo}%`);
    }

    if (carrera) {
      query += ' AND carrera LIKE ?';
      params.push(`%${carrera}%`);
    }

    query += ' ORDER BY nombre_materia, grupo, dia';

    const horarios = await allQuery(query, params);

    // Agrupar por materia y grupo
    const agrupados = {};
    horarios.forEach(h => {
      const key = `${h.codigo_materia}-${h.grupo}`;
      if (!agrupados[key]) {
        agrupados[key] = {
          codigo: h.codigo_materia,
          nombre: h.nombre_materia,
          grupo: h.grupo,
          carrera: h.carrera,
          docente: h.docente,
          horarios: []
        };
      }
      agrupados[key].horarios.push({
        dia: h.dia,
        hora: `${h.hora_inicio}-${h.hora_fin}`,
        sala: h.sala,
        edificio: h.edificio,
        sede: h.sede
      });
    });

    res.json(Object.values(agrupados));
  } catch (error) {
    console.error('Error obteniendo horarios:', error);
    res.status(500).json({ error: 'Error obteniendo horarios' });
  }
});

/**
 * GET /materias
 * Búsqueda de materias por nombre o facultad
 * Query params: ?buscar=CALCULO&facultad=INGENIERIA&semestre=2026-1
 */
router.get('/materias', async (req, res) => {
  try {
    const { buscar = '', facultad = '', semestre = '2026-1' } = req.query;

    let query = `
      SELECT DISTINCT 
        codigo_materia as codigo,
        nombre_materia as nombre,
        carrera as facultad,
        (SELECT COUNT(DISTINCT grupo) FROM horarios h2 
         WHERE h2.codigo_materia = h1.codigo_materia 
         AND h2.semestre = h1.semestre) as total_grupos
      FROM horarios h1
      WHERE semestre = ?
    `;
    
    const params = [semestre];

    if (buscar.trim()) {
      query += ' AND (nombre_materia LIKE ? OR codigo_materia LIKE ?)';
      params.push(`%${buscar}%`, `%${buscar}%`);
    }

    if (facultad.trim()) {
      query += ' AND carrera LIKE ?';
      params.push(`%${facultad}%`);
    }

    query += ' ORDER BY nombre_materia LIMIT 50';

    const materias = await allQuery(query, params);

    res.json(materias);
  } catch (error) {
    console.error('Error buscando materias:', error);
    res.status(500).json({ error: 'Error buscando materias' });
  }
});

/**
 * GET /materias/:codigo/grupos
 * Obtener grupos disponibles para una materia
 */
router.get('/materias/:codigo/grupos', async (req, res) => {
  try {
    const { codigo } = req.params;
    const { semestre = '2026-1' } = req.query;

    const grupos = await allQuery(`
      SELECT DISTINCT
        grupo,
        docente,
        carrera,
        GROUP_CONCAT(DISTINCT dia || ' ' || hora_inicio || '-' || hora_fin) as horarios
      FROM horarios
      WHERE codigo_materia = ? AND semestre = ?
      GROUP BY grupo
      ORDER BY grupo
    `, [codigo, semestre]);

    res.json(grupos);
  } catch (error) {
    console.error('Error obteniendo grupos:', error);
    res.status(500).json({ error: 'Error obteniendo grupos' });
  }
});

/**
 * POST /solicitudes
 * Crear solicitud de cambio de grupo (requiere autenticación)
 */
router.post('/solicitudes', middleware_autenticacion, async (req, res) => {
  try {
    const { codigoMateria, grupoQueTengo, grupoQueSolicito, descripcion } = req.body;
    const estudianteId = req.usuario.id;

    if (!codigoMateria || !grupoQueTengo || !grupoQueSolicito) {
      return res.status(400).json({ 
        error: 'Faltan datos: codigoMateria, grupoQueTengo, grupoQueSolicito'
      });
    }

    const result = await runQuery(
      `INSERT INTO solicitudes_cambio 
      (estudiante_id, codigo_materia, grupo_que_ofrece, grupo_que_solicita, descripcion)
      VALUES (?, ?, ?, ?, ?)`,
      [estudianteId, codigoMateria, grupoQueTengo, grupoQueSolicito, descripcion || '']
    );

    res.status(201).json({
      id: result.id,
      mensaje: 'Solicitud creada exitosamente'
    });
  } catch (error) {
    console.error('Error creando solicitud:', error);
    res.status(500).json({ error: 'Error creando solicitud' });
  }
});

/**
 * GET /solicitudes
 * Obtener solicitudes activas (filterable)
 * Query params: ?materia=XXX&estado=activa
 */
router.get('/solicitudes', async (req, res) => {
  try {
    const { materia, grupo, estado = 'activa' } = req.query;

    let query = `
      SELECT DISTINCT
        s.id,
        s.estudiante_id,
        s.codigo_materia,
        s.grupo_que_ofrece,
        s.grupo_que_solicita,
        s.descripcion,
        s.estado,
        s.created_at,
        e.nombre,
        e.telefono,
        (SELECT nombre_materia FROM horarios WHERE codigo_materia = s.codigo_materia LIMIT 1) as nombre_materia,
        (SELECT docente FROM horarios WHERE codigo_materia = s.codigo_materia AND grupo = s.grupo_que_ofrece LIMIT 1) as docente_ofrece,
        (SELECT docente FROM horarios WHERE codigo_materia = s.codigo_materia AND grupo = s.grupo_que_solicita LIMIT 1) as docente_solicita
      FROM solicitudes_cambio s
      JOIN estudiantes e ON s.estudiante_id = e.id
      WHERE s.estado = ?
    `;
    
    const params = [estado];

    if (materia) {
      query += ' AND s.codigo_materia = ?';
      params.push(materia);
    }

    if (grupo) {
      query += ' AND (s.grupo_que_ofrece LIKE ? OR s.grupo_que_solicita LIKE ?)';
      params.push(`%${grupo}%`, `%${grupo}%`);
    }

    query += ' ORDER BY s.created_at DESC LIMIT 100';

    const solicitudes = await allQuery(query, params);

    res.json(solicitudes);
  } catch (error) {
    console.error('Error obteniendo solicitudes:', error);
    res.status(500).json({ error: 'Error obteniendo solicitudes' });
  }
});

/**
 * GET /solicitudes/:id
 * Obtener detalle de una solicitud específica
 */
router.get('/solicitudes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const solicitud = await getQuery(`
      SELECT 
        s.*,
        e.nombre,
        e.telefono,
        e.email,
        h.nombre_materia
      FROM solicitudes_cambio s
      JOIN estudiantes e ON s.estudiante_id = e.id
      LEFT JOIN horarios h ON s.codigo_materia = h.codigo_materia
      WHERE s.id = ?
    `, [id]);

    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    // Obtener contactos interesados
    const contactos = await allQuery(
      'SELECT * FROM contactos_interesados WHERE solicitud_id = ? ORDER BY created_at DESC',
      [id]
    );

    res.json({ ...solicitud, contactos });
  } catch (error) {
    console.error('Error obteniendo solicitud:', error);
    res.status(500).json({ error: 'Error obteniendo solicitud' });
  }
});

/**
 * POST /solicitudes/:id/contactar
 * Registrarse como interesado en una solicitud (requiere autenticación)
 */
router.post('/solicitudes/:id/contactar', middleware_autenticacion, async (req, res) => {
  try {
    const { id } = req.params;
    const { mensaje } = req.body;
    const estudianteId = req.usuario.id;

    // Obtener datos del usuario autenticado
    const usuario = await getQuery(
      'SELECT id, nombre, telefono, email FROM estudiantes WHERE id = ?',
      [estudianteId]
    );

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Verificar que la solicitud existe
    const solicitud = await getQuery(
      'SELECT * FROM solicitudes_cambio WHERE id = ?',
      [id]
    );

    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    // Verificar que no sea su propia solicitud
    if (solicitud.estudiante_id === estudianteId) {
      return res.status(400).json({ error: 'No puedes registrarte como interesado en tu propia solicitud' });
    }

    // Verificar que no esté registrado ya
    const yaRegistrado = await getQuery(
      `SELECT id FROM contactos_interesados 
       WHERE solicitud_id = ? AND telefono_interesado = ?`,
      [id, usuario.telefono]
    );

    if (yaRegistrado) {
      return res.status(400).json({ error: 'Ya te registraste como interesado en esta solicitud' });
    }

    const result = await runQuery(
      `INSERT INTO contactos_interesados 
      (solicitud_id, nombre_interesado, telefono_interesado, email_interesado, mensaje)
      VALUES (?, ?, ?, ?, ?)`,
      [id, usuario.nombre || usuario.codigo, usuario.telefono, usuario.email || '', mensaje || '']
    );

    res.status(201).json({
      id: result.id,
      mensaje: 'Te has registrado como interesado. El dueño de la solicitud se pondrá en contacto a través del teléfono que registraste: ' + usuario.telefono
    });
  } catch (error) {
    console.error('Error contactando:', error);
    res.status(500).json({ error: 'Error registrando interés', details: error.message });
  }
});

/**
 * PUT /solicitudes/:id/estado
 * Actualizar estado de una solicitud (requiere autenticación)
 */
router.put('/solicitudes/:id/estado', middleware_autenticacion, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const estudianteId = req.usuario.id;

    if (!estado || !['activa', 'cerrada', 'completada'].includes(estado)) {
      return res.status(400).json({ 
        error: 'Estado inválido. Valores permitidos: activa, cerrada, completada'
      });
    }

    // Verificar que pertenece al estudiante
    const solicitud = await getQuery(
      'SELECT * FROM solicitudes_cambio WHERE id = ? AND estudiante_id = ?',
      [id, estudianteId]
    );

    if (!solicitud) {
      return res.status(403).json({ error: 'No puedes modificar esta solicitud' });
    }

    await runQuery(
      'UPDATE solicitudes_cambio SET estado = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [estado, id]
    );

    res.json({ mensaje: 'Estado actualizado' });
  } catch (error) {
    console.error('Error actualizando estado:', error);
    res.status(500).json({ error: 'Error actualizando solicitud' });
  }
});

/**
 * GET /mis-solicitudes
 * Obtener solicitudes del usuario autenticado
 */
router.get('/mis-solicitudes', middleware_autenticacion, async (req, res) => {
  try {
    const estudianteId = req.usuario.id;

    const solicitudes = await allQuery(`
      SELECT DISTINCT
        s.id,
        s.estudiante_id,
        s.codigo_materia,
        s.grupo_que_ofrece,
        s.grupo_que_solicita,
        s.descripcion,
        s.estado,
        s.created_at,
        (SELECT nombre_materia FROM horarios WHERE codigo_materia = s.codigo_materia LIMIT 1) as nombre_materia,
        (SELECT docente FROM horarios WHERE codigo_materia = s.codigo_materia AND grupo = s.grupo_que_ofrece LIMIT 1) as docente_ofrece,
        (SELECT docente FROM horarios WHERE codigo_materia = s.codigo_materia AND grupo = s.grupo_que_solicita LIMIT 1) as docente_solicita,
        (SELECT COUNT(*) FROM contactos_interesados WHERE solicitud_id = s.id) as total_interesados
      FROM solicitudes_cambio s
      WHERE s.estudiante_id = ?
      ORDER BY s.created_at DESC
    `, [estudianteId]);

    res.json(solicitudes);
  } catch (error) {
    console.error('Error obteniendo solicitudes:', error);
    res.status(500).json({ error: 'Error obteniendo solicitudes' });
  }
});

/**
 * GET /mi-perfil
 * Obtener información del usuario autenticado
 */
router.get('/mi-perfil', middleware_autenticacion, async (req, res) => {
  try {
    const estudiante = await getQuery(
      'SELECT id, codigo_estudiante as codigo, nombre, telefono, email, carrera, semestre FROM estudiantes WHERE id = ?',
      [req.usuario.id]
    );

    res.json(estudiante);
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ error: 'Error obteniendo perfil' });
  }
});

export default router;
