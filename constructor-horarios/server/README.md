# Servidor - Constructor de Horarios

Backend simple y ligero para la aplicación de constructor de horarios.

## Características del Backend

- ✅ **API REST** sin autenticación
- ✅ **CORS habilitado** para acceso desde cualquier origen
- ✅ **Lectura desde SQLite** existente
- ✅ **Búsqueda inteligente** de materias
- ✅ **Sin dependencias pesadas** (solo Express + SQLite3 + CORS)

## Instalación

```bash
npm install
```

## Inicio

```bash
# Producción
npm start

# Desarrollo (con auto-reload)
npm run dev
```

El servidor escuchará en `http://localhost:3001`

## Endpoints

### Semestres
```
GET /api/semestres
```
Retorna todos los semestres disponibles.

### Carreras
```
GET /api/carreras?semestre=2026-1
```
Obtiene carreras para un semestre específico.

### Materias
```
GET /api/materias?carrera=INGENIERIA_SISTEMAS&semestre=2026-1&buscar=Base
```
Busca materias con filtros opcionales.

**Params:**
- `carrera` (requerido): Nombre de la carrera
- `semestre` (requerido): Semestre
- `buscar` (opcional): Filtro de nombre o código

### Grupos
```
GET /api/grupos?codigo_materia=IS001&semestre=2026-1
```
Obtiene todos los grupos de una materia.

### Sedes
```
GET /api/sedes?semestre=2026-1
```
Obtiene todas las sedes disponibles.

### Horario Materia
```
GET /api/horario-materia?codigo_materia=IS001&grupo=01&semestre=2026-1
```
Obtiene todos los horarios de una materia en un grupo específico.

### Health Check
```
GET /health
```
Verifica que el servidor está activo.

## Estructura BD

El servidor usa las siguientes tablas de `database.db`:

### Tabla: horarios
```sql
- id (INT)
- codigo_materia (TEXT)
- nombre_materia (TEXT)
- grupo (TEXT)
- carrera (TEXT)
- docente (TEXT)
- dia (TEXT)
- hora_inicio (INT)
- hora_fin (INT)
- sala (TEXT)
- edificio (TEXT)
- sede (TEXT)
- inscritos (INT)
- max_inscritos (INT)
- semestre (TEXT)
- created_at (TIMESTAMP)
```

## Environment Variables

Crear `.env` (opcional):

```
PORT=3001
```

## Troubleshooting

**Error: "database.db not found"**
- Asegúrate de que la BD existe en `./database.db`
- O copia desde `../../cambios-de-grupo/server/database.db`

**Port 3001 already in use**
- Cambia el puerto: `PORT=3002 npm start`

**CORS error**
- El CORS está habilitado por defecto
- Verifica que accedes desde `http://` no `file://`
