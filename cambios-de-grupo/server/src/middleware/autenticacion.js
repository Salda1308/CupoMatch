import crypto from 'crypto';
import { getQuery, runQuery } from '../models/database.js';

/**
 * Generar clave única basada en: código + número de materia + teléfono
 * Esto permite "login" sin crear usuarios, es determinístico
 */
export function generarClaveUnica(codigoEstudiante, numeroMateria, telefono) {
  const datos = `${codigoEstudiante}:${numeroMateria}:${telefono}`;
  return crypto.createHash('sha256').update(datos).digest('hex');
}

/**
 * Verificar la clave de un estudiante
 */
export async function verificarClaveEstudiante(codigoEstudiante, numeroMateria, telefono) {
  const authKey = generarClaveUnica(codigoEstudiante, numeroMateria, telefono);
  
  let estudiante = await getQuery(
    'SELECT * FROM estudiantes WHERE auth_key = ?',
    [authKey]
  );

  // Si no existe, crearlo
  if (!estudiante) {
    await runQuery(
      `INSERT INTO estudiantes 
      (codigo_estudiante, telefono, auth_key)
      VALUES (?, ?, ?)`,
      [codigoEstudiante, telefono, authKey]
    );
    
    estudiante = await getQuery(
      'SELECT * FROM estudiantes WHERE auth_key = ?',
      [authKey]
    );
  }

  return { estudiante, authKey };
}

/**
 * Generar token JWT simple (sin librería externa)
 * Contiene: id, codigo, authKey, iat, exp, firma
 */
export function generarToken(estudiante, authKey) {
  const ahora = Math.floor(Date.now() / 1000);
  const payload = {
    id: estudiante.id,
    codigo: estudiante.codigo_estudiante,
    authKey: authKey,
    iat: ahora,
    exp: ahora + (24 * 60 * 60) // 24 horas desde ahora
  };

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64');
  const firma = crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'secreto-cambios-grupo-2026')
    .update(`${header}.${body}`)
    .digest('base64');

  return `${header}.${body}.${firma}`;
}

/**
 * Verificar token JWT
 */
export function verificarToken(token) {
  try {
    if (!token) return null;

    const [header, body, firma] = token.split('.');
    const secret = process.env.JWT_SECRET || 'secreto-cambios-grupo-2026';
    
    const firmaCalculada = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${body}`)
      .digest('base64');

    if (firma !== firmaCalculada) return null;

    const payload = JSON.parse(Buffer.from(body, 'base64').toString());
    
    // Verificar expiración
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (e) {
    console.error('Error verificando token:', e);
    return null;
  }
}

/**
 * Middleware para verificar autenticación
 */
export function middleware_autenticacion(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  const payload = verificarToken(token);

  if (!payload) {
    return res.status(401).json({ 
      error: 'No autorizado',
      mensaje: 'Token inválido o expirado'
    });
  }

  req.usuario = payload;
  next();
}
