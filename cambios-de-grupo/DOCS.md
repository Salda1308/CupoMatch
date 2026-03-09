# 📚 Documentación Completa

## Archivos de Referencia Rápida

### Para Usuarios
- **[INSTALL.md](INSTALL.md)** - Cómo instalar (paso a paso)
- **[GUIDE.md](GUIDE.md)** - Cómo usar el sistema
- **[README.md](README.md)** - Descripción general

### Para Desarrolladores
- **[API.md](API.md)** - Referencia de endpoints
- **[server/README.md](server/README.md)** - Documentación backend
- **[client/README.md](client/README.md)** - Documentación frontend

---

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────┐
│                    NAVEGADOR (Frontend)                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │  📱 index.html - Interfaz HTML/CSS/JavaScript    │   │
│  │  - Login sin contraseña                          │   │
│  │  - Ver y crear solicitudes                       │   │
│  │  - Ver horarios                                  │   │
│  │  - Gestionar interesados                         │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────┬──────────────────────────────────┘
                      │ HTTP/REST
                      │ (API calls)
                      ↓
┌──────────────────────────────────────────────────────────┐
│                  SERVIDOR (Backend)                      │
│  Node.js + Express + SQLite                             │
│                                                          │
│  ┌────────────────────────────────────────────────┐     │
│  │ 🔐 Auth Middleware - JWT                       │     │
│  │  - Verificar token                             │     │
│  │  - Generar claves únicas                       │     │
│  └────────────────────────────────────────────────┘     │
│                      ↕                                   │
│  ┌────────────────────────────────────────────────┐     │
│  │ 📡 API Routes (/api/*)                        │     │
│  │  - /auth/login - Autenticación               │     │
│  │  - /horarios - Consultar horarios             │     │
│  │  - /solicitudes - CRUD cambios               │     │
│  │  - /mi-perfil - Datos de usuario              │     │
│  └────────────────────────────────────────────────┘     │
│                      ↕                                   │
│  ┌────────────────────────────────────────────────┐     │
│  │ 💾 Database Layer (SQLite)                    │     │
│  │  - estudiantes                                 │     │
│  │  - horarios                                    │     │
│  │  - solicitudes_cambio                          │     │
│  │  - contactos_interesados                       │     │
│  └────────────────────────────────────────────────┘     │
│                      ↕                                   │
│  ┌────────────────────────────────────────────────┐     │
│  │ 📄 Parser de PDFs (Python)                    │     │
│  │  - Lee PDFs de horarios                        │     │
│  │  - Detecta formato automáticamente             │     │
│  │  - Inserta en BD                               │     │
│  └────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────┘
                      ↑
                      │ CLI: npm run parse-horarios
                      │
┌──────────────────────────────────────────────────────────┐
│          📂 Carpeta Horarios (PDFs)                      │
│  - horarios_20261_Facultad_Ingenieria.pdf              │
│  - horarios_20261_Facultad_Artes.pdf                   │
│  - ... (más PDFs)                                       │
└──────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos

### 1️⃣ Carga Inicial (Una vez por semestre)

```
PDFs en ../Horarios/
       ↓
npm run parse-horarios
       ↓
Parser detecta formato automáticamente
       ↓
Extrae: materia, grupo, horario, docente, sala, edificio
       ↓
Inserta en tabla "horarios" (2847+ registros)
       ↓
✅ Listo para usar
```

### 2️⃣ Login de Estudiante

```
Formulario de login
  ├─ Código: 2023001
  ├─ Materia: 1
  ├─ Teléfono: +57 123 456 7890
  └─ Nombre: Juan Pérez
       ↓
Backend.POST /auth/login
       ↓
Generar SHA256 de (código:materia:teléfono)
       ↓
Buscar/Crear estudiante en BD
       ↓
Generar JWT (válido 24h)
       ↓
Retorna token + datos
       ↓
Frontend guarda en localStorage
```

### 3️⃣ Ver Solicitudes

```
GET /solicitudes?materia=1
       ↓
Backend consulta tabla solicitudes_cambio
       ↓
JOIN con estudiantes para nombre/teléfono
       ↓
JOIN con contactos_interesados para contar
       ↓
Retorna JSON
       ↓
Frontend renderiza tarjetas
```

### 4️⃣ Crear Solicitud

```
Formulario "Nueva Solicitud"
  ├─ Materia: 1
  ├─ Tengo: 025-61
  ├─ Solicito: 025-62
  └─ Descripción: ...
       ↓
POST /solicitudes (con JWT)
       ↓
Backend inserta en solicitudes_cambio
       ↓
Usuario_id = ID del token
       ↓
Estado = "activa"
       ↓
Retorna ID
       ↓
Frontend actualiza lista
```

### 5️⃣ Registrarse como Interesado

```
Botón "Interesado" en solicitud id=1
       ↓
Formulario "Registrarse como interesado"
  ├─ Nombre: María García
  ├─ Teléfono: +57 987 654 3210
  ├─ Email: maria@...
  └─ Mensaje: ¡Yo tengo ese grupo!
       ↓
POST /solicitudes/1/contactar
       ↓
Backend inserta en contactos_interesados
       ↓
solicitud_id = 1
       ↓
Retorna confirmación
       ↓
Frontend muestra mensaje
```

### 6️⃣ Ver Interesados

```
"Mis Solicitudes" → "Ver (3 interesados)"
       ↓
GET /solicitudes/1
       ↓
Backend trae solicitud + contactos
       ↓
Retorna JSON con lista de interesados
       ↓
Frontend muestra tarjetas con:
  - Nombre
  - Teléfono
  - Email
  - Mensaje
       ↓
Usuario puede contactarlos por teléfono/WhatsApp
```

---

## 📊 Estructura de Base de Datos

### Tabla: `estudiantes`

```sql
CREATE TABLE estudiantes (
  id INTEGER PRIMARY KEY,           -- Auto-increment
  codigo_estudiante TEXT NOT NULL,  -- 2023001
  nombre TEXT,                      -- Juan Pérez
  telefono TEXT,                    -- +57 123 456 7890
  email TEXT,                       -- juan@...
  carrera TEXT,                     -- INGENIERIA
  semestre TEXT,                    -- 2026-1
  auth_key TEXT UNIQUE NOT NULL,    -- SHA256(código:materia:teléfono)
  created_at TIMESTAMP              -- 2026-02-19...
);
```

### Tabla: `horarios`

```sql
CREATE TABLE horarios (
  id INTEGER PRIMARY KEY,           -- Auto-increment
  codigo_materia TEXT,              -- 1
  nombre_materia TEXT,              -- CALCULO DIFERENCIAL
  grupo TEXT,                       -- 025-61
  carrera TEXT,                     -- INGENIERIA...
  docente TEXT,                     -- NELSON JORGE
  dia TEXT,                         -- MARTES
  hora_inicio INTEGER,              -- 6
  hora_fin INTEGER,                 -- 7
  sala TEXT,                        -- AULA 809
  edificio TEXT,                    -- EDIFICIO CRISANTO...
  sede TEXT,                        -- EDIFICIO
  inscritos INTEGER,                -- 0
  max_inscritos INTEGER,            -- 999
  semestre TEXT,                    -- 2026-1
  created_at TIMESTAMP              -- 2026-02-19...
);
```

### Tabla: `solicitudes_cambio`

```sql
CREATE TABLE solicitudes_cambio (
  id INTEGER PRIMARY KEY,           -- Auto-increment
  estudiante_id INTEGER,            -- FK → estudiantes.id
  codigo_materia TEXT,              -- 1
  grupo_que_ofrece TEXT,            -- 025-61
  grupo_que_solicita TEXT,          -- 025-62
  estado TEXT,                      -- activa|cerrada|completada
  descripcion TEXT,                 -- ...
  contacto_nombre TEXT,             -- (legacy)
  contacto_telefono TEXT,           -- (legacy)
  contacto_email TEXT,              -- (legacy)
  created_at TIMESTAMP,             -- 2026-02-19...
  updated_at TIMESTAMP              -- 2026-02-19...
);
```

### Tabla: `contactos_interesados`

```sql
CREATE TABLE contactos_interesados (
  id INTEGER PRIMARY KEY,           -- Auto-increment
  solicitud_id INTEGER,             -- FK → solicitudes_cambio.id
  estudiante_interesado_id INTEGER, -- (opcional, si se registra)
  nombre_interesado TEXT,           -- María García
  telefono_interesado TEXT,         -- +57 987 654 3210
  email_interesado TEXT,            -- maria@...
  mensaje TEXT,                     -- ¡Yo tengo ese grupo!
  estado TEXT,                      -- no_contactado|contactado
  created_at TIMESTAMP              -- 2026-02-19...
);
```

---

## 🔐 Seguridad

### Autenticación

```
NO contraseña ❌
SÍ clave única ✅

Clave = SHA256(código + materia + teléfono)
  └─ Determinística
  └─ Imposible phishing
  └─ Imposible olvidar
```

### JWT Token

```
Header: { alg: HS256, typ: JWT }
Payload: {
  id: 1,
  codigo: "2023001",
  authKey: "abc123...",
  iat: 1645271400
}
Firma: HMAC-SHA256(header.payload, secreto)
Expiración: 24 horas
```

### SQL Injection Prevention

```javascript
// ✅ SEGURO - Prepared statements
db.run('SELECT * FROM usuarios WHERE id = ?', [id]);

// ❌ INSEGURO - String concatenation
db.run(`SELECT * FROM usuarios WHERE id = ${id}`);
```

### CORS

```javascript
cors({
  origin: 'http://localhost:3000',  // Solo frontend local
  credentials: true
})
```

---

## 📝 Convenciones de Código

### Backend Routes

```javascript
// POST - Crear
router.post('/endpoint', middleware_autenticacion, async (req, res) => {
  ...
})

// GET - Leer
router.get('/endpoint/:id', async (req, res) => {
  ...
})

// PUT - Actualizar
router.put('/endpoint/:id', middleware_autenticacion, async (req, res) => {
  ...
})

// DELETE - Borrar (no implementado)
```

### Frontend Naming

```javascript
handleLogin()        // Event handlers
mostrarSecciones()   // UI updates
cargarSolicitudes()  // Data fetching
const API_URL        // Constants
const token          // State
```

---

## 🔧 Cómo Customizar

### Cambiar Usuario por Defecto para Login

En `API.md`, cambiar datos de ejemplo.

### Agregar Nuevo Campo a Estudiante

1. Agregar columna en `database.js`:
   ```sql
   ALTER TABLE estudiantes ADD COLUMN carrera_secundaria TEXT;
   ```

2. Actualizar endpoint `/mi-perfil` en `api.js`

3. Actualizar formulario en `client/index.html`

### Soportar Nuevo Formato de PDF

1. Analizar PDF con `analizar_horarios.py`
2. Actualizar lógica en `HorariosParser.js`
3. Probar: `npm run parse-horarios`

### Agregar Notificaciones por Email

1. Instalar `nodemailer`:
   ```bash
   npm install nodemailer
   ```

2. Agregar en backend cuando alguien se interese:
   ```javascript
   await enviarEmail(dueno.email, 'Alguien se interesó en tu solicitud');
   ```

---

## 📈 Escalabilidad

### Actual (SQLite)
- ✅ Hasta ~10,000 usuarios
- ✅ Hasta ~100,000 solicitudes
- ✅ Desarrollo/Testing
- ✅ Un solo servidor

### Para Migrar a PostgreSQL

1. Cambiar conexión en `database.js`
2. Usar mejor soporte para concurrencia
3. Deploying en servidor dedicado
4. Backup automático

### Para Migrar a MongoDB

1. Cambiar modelos a Mongoose
2. Remover SQL de `api.js`
3. Mejor escalabilidad horizontal

---

## 🚀 Deployment

### Heroku / Railway

```bash
# 1. Crear Procfile
web: npm run start

# 2. Hacer push
git push heroku main

# 3. Cargar horarios
heroku run npm run parse-horarios
```

### AWS EC2 / DigitalOcean

```bash
# 1. SSH al servidor
ssh ubuntu@ip

# 2. Instalar Node.js y Python
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install nodejs python3 python3-pip

# 3. Clonar repositorio
git clone https://github.com/tuusuario/cambios-grupo

# 4. Setup
cd cambios-grupo/server
npm install
npm run parse-horarios

# 5. Ejecutar con PM2
npm install -g pm2
pm2 start src/server.js
pm2 startup
pm2 save
```

### Netlify (Frontend)

```bash
# 1. Conectar repositorio
git push origin main

# 2. Build command: (empty - es HTML puro)

# 3. Publish directory: client

# 4. Cambiar API_URL en index.html a tu backend
```

---

## 🧪 Testing

### Probar Backend con cURL

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"codigo":"2023001","numeroMateria":"1","telefono":"+57 123","nombre":"Test"}'

# Ver solicitudes
curl http://localhost:3001/api/solicitudes

# Ver horarios
curl http://localhost:3001/api/horarios?materia=1
```

### Probar Frontend

1. http://localhost:3000
2. F12 → Console → Ver logs
3. Crear solicitud
4. Registrarse como interesado
5. Ver detalles completos

---

## 📚 Referencias Externas

- [Node.js docs](https://nodejs.org/docs)
- [Express.js guide](https://expressjs.com)
- [SQLite tutorial](https://www.sqlite.org/lang_select.html)
- [JWT info](https://jwt.io)
- [Fetch API](https://developer.mozilla.org/fetch)

---

## ❓ FAQ

**P: ¿Puedo cambiar la base de datos?**
R: Sí, mirar en server/src/models/database.js y reemplazar con tu BD preferida.

**P: ¿Cómo agrego más campos a estudiante?**
R: 1) Agregar columna en BD, 2) Actualizar rutas, 3) Actualizar frontend.

**P: ¿Qué pasa si se reinicia el servidor?**
R: Los datos persisten en database.db. Las sesiones de usuarios expiran (24h).

**P: ¿Puedo agregar autenticación con contraseña?**
R: Sí, pero va contra la filosofía. Pero es posible si lo necesitas.

**P: ¿Cómo hago backup?**
R: Copiar archivo `server/database.db` a lugar seguro.

**P: ¿Versión de Node.js mínima?**
R: 14, pero recomendado 18+.

**P: ¿Funciona en móvil?**
R: Sí, interfaz responsive. Pero es mejor en desktop.

---

**Última actualización: 19 de febrero, 2026**

Hecho con ❤️ por y para estudiantes.
