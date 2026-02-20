import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '../../database.db');

let db = null;

export function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('✓ Base de datos conectada');
        createTables();
        resolve(db);
      }
    });
  });
}

function createTables() {
  db.serialize(() => {
    // Tabla de materias y grupos
    db.run(`
      CREATE TABLE IF NOT EXISTS horarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo_materia TEXT NOT NULL,
        nombre_materia TEXT NOT NULL,
        grupo TEXT NOT NULL,
        carrera TEXT NOT NULL,
        docente TEXT NOT NULL,
        dia TEXT NOT NULL,
        hora_inicio INTEGER NOT NULL,
        hora_fin INTEGER NOT NULL,
        sala TEXT NOT NULL,
        edificio TEXT NOT NULL,
        sede TEXT NOT NULL,
        inscritos INTEGER DEFAULT 0,
        max_inscritos INTEGER DEFAULT 999,
        semestre TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(codigo_materia, grupo, dia, hora_inicio, semestre)
      );
    `);

    // Tabla de estudiantes autenticados
    db.run(`
      CREATE TABLE IF NOT EXISTS estudiantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo_estudiante TEXT NOT NULL UNIQUE,
        nombre TEXT,
        telefono TEXT,
        email TEXT,
        carrera TEXT,
        semestre TEXT,
        auth_key TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de solicitudes de cambio
    db.run(`
      CREATE TABLE IF NOT EXISTS solicitudes_cambio (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        estudiante_id INTEGER NOT NULL,
        codigo_materia TEXT NOT NULL,
        grupo_que_ofrece TEXT NOT NULL,
        grupo_que_solicita TEXT NOT NULL,
        estado TEXT DEFAULT 'activa',
        descripcion TEXT,
        contacto_nombre TEXT,
        contacto_telefono TEXT,
        contacto_email TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE
      );
    `);

    // Tabla de respuestas/contactos
    db.run(`
      CREATE TABLE IF NOT EXISTS contactos_interesados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        solicitud_id INTEGER NOT NULL,
        estudiante_interesado_id INTEGER NOT NULL,
        nombre_interesado TEXT NOT NULL,
        telefono_interesado TEXT NOT NULL,
        email_interesado TEXT,
        mensaje TEXT,
        estado TEXT DEFAULT 'no_contactado',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (solicitud_id) REFERENCES solicitudes_cambio(id) ON DELETE CASCADE
      );
    `);

    // Índices para búsquedas rápidas
    db.run('CREATE INDEX IF NOT EXISTS idx_horarios_materia ON horarios(codigo_materia)');
    db.run('CREATE INDEX IF NOT EXISTS idx_horarios_grupo ON horarios(grupo)');
    db.run('CREATE INDEX IF NOT EXISTS idx_horarios_semestre ON horarios(semestre)');
    db.run('CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_cambio(estado)');
    db.run('CREATE INDEX IF NOT EXISTS idx_contactos_solicitud ON contactos_interesados(solicitud_id)');
  });
}

export function getDatabase() {
  return db;
}

export function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

export function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function allQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

export function closeDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    } else {
      resolve();
    }
  });
}
