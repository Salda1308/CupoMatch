# 📡 Referencia API

## Base URL

```
http://localhost:3001/api
```

## Autenticación

Todos los endpoints con `(autenticado)` requieren:

```
Authorization: Bearer <token>
```

Obtener token en `/auth/login`.

---

## 🔐 Auth Endpoints

### POST `/auth/login`

Autenticación sin contraseña.

**Request:**
```json
{
  "codigo": "2023001",
  "numeroMateria": "1",
  "telefono": "+57 123 456 7890",
  "nombre": "Juan Pérez"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "estudiante": {
    "id": 1,
    "codigo": "2023001",
    "telefono": "+57 123 456 7890",
    "nombre": "Juan Pérez"
  }
}
```

**Errores:**
- `400` - Faltan campos requeridos
- `400` - Formato de teléfono inválido
- `500` - Error interno del servidor

---

## 📅 Horarios Endpoints

### GET `/horarios`

Obtener horarios disponibles.

**Query Parameters:**
- `materia` (optional) - Código o nombre de materia
- `grupo` (optional) - Número de grupo
- `carrera` (optional) - Nombre de carrera
- `semestre` (optional) - Semestre (default: 2026-1)

**Examples:**
```
GET /horarios
GET /horarios?materia=1
GET /horarios?grupo=025-61&semestre=2026-1
GET /horarios?carrera=INGENIERIA
```

**Response (200 OK):**
```json
[
  {
    "codigo": "1",
    "nombre": "CALCULO DIFERENCIAL",
    "grupo": "025-61",
    "carrera": "INGENIERIA CATASTRAL Y GEODESIA",
    "docente": "NELSON JORGE",
    "horarios": [
      {
        "dia": "MARTES",
        "hora": "6-7",
        "sala": "AULA 809",
        "edificio": "EDIFICIO CRISANTO LUQUE",
        "sede": "EDIFICIO"
      },
      {
        "dia": "JUEVES",
        "hora": "6-7",
        "sala": "AULA DE CLASE 904",
        "edificio": "EDIFICIO CRISANTO LUQUE",
        "sede": "EDIFICIO"
      }
    ]
  }
]
```

---

## 📋 Solicitudes Endpoints

### POST `/solicitudes` (autenticado)

Crear solicitud de cambio de grupo.

**Request:**
```json
{
  "codigoMateria": "1",
  "grupoQueTengo": "025-61",
  "grupoQueSolicito": "025-62",
  "descripcion": "Conflicto con otra clase"
}
```

**Response (201 Created):**
```json
{
  "id": 5,
  "mensaje": "Solicitud creada exitosamente"
}
```

**Errores:**
- `400` - Faltan campos requeridos
- `401` - No autorizado
- `500` - Error interno

### GET `/solicitudes`

Obtener todas las solicitudes activas.

**Query Parameters:**
- `materia` (optional) - Filtrar por materia
- `grupo` (optional) - Filtrar por grupo
- `estado` (optional) - activa (default), cerrada, completada

**Examples:**
```
GET /solicitudes
GET /solicitudes?materia=1
GET /solicitudes?estado=activa&grupo=025-62
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "codigo_materia": "1",
    "grupo_que_ofrece": "025-61",
    "grupo_que_solicita": "025-62",
    "nombre_materia": "CALCULO DIFERENCIAL",
    "nombre": "Juan Pérez",
    "telefono": "+57 123 456 7890",
    "descripcion": "Conflicto horario",
    "estado": "activa",
    "created_at": "2026-02-19T15:30:00.000Z"
  }
]
```

### GET `/solicitudes/:id`

Obtener detalles de una solicitud específica con contactos.

**Parameters:**
- `id` - ID de la solicitud

**Response (200 OK):**
```json
{
  "id": 1,
  "codigo_materia": "1",
  "grupo_que_ofrece": "025-61",
  "grupo_que_solicita": "025-62",
  "nombre_materia": "CALCULO DIFERENCIAL",
  "nombre": "Juan Pérez",
  "telefono": "+57 123 456 7890",
  "email": "juan@example.com",
  "descripcion": "Conflicto horario",
  "estado": "activa",
  "contactos": [
    {
      "id": 5,
      "nombre_interesado": "María García",
      "telefono_interesado": "+57 987 654 3210",
      "email_interesado": "maria@example.com",
      "mensaje": "¡Yo tengo ese grupo!",
      "estado": "no_contactado",
      "created_at": "2026-02-19T15:45:00.000Z"
    }
  ],
  "created_at": "2026-02-19T15:30:00.000Z"
}
```

**Errores:**
- `404` - Solicitud no encontrada

### POST `/solicitudes/:id/contactar`

Registrarse como interesado en una solicitud.

**Parameters:**
- `id` - ID de la solicitud

**Request:**
```json
{
  "nombre": "María García",
  "telefono": "+57 987 654 3210",
  "email": "maria@example.com",
  "mensaje": "¡Yo tengo ese grupo!"
}
```

**Response (201 Created):**
```json
{
  "id": 5,
  "mensaje": "Te has registrado como interesado. El dueño de la solicitud se pondrá en contacto..."
}
```

**Errores:**
- `400` - Faltan campos requeridos (nombre, telefono)
- `404` - Solicitud no encontrada

### PUT `/solicitudes/:id/estado` (autenticado)

Actualizar estado de una solicitud.

**Parameters:**
- `id` - ID de la solicitud

**Request:**
```json
{
  "estado": "cerrada"
}
```

**Estados válidos:**
- `activa` - Visible para todos
- `cerrada` - No visible para nuevos interesados
- `completada` - Cambio realizado

**Response (200 OK):**
```json
{
  "mensaje": "Estado actualizado"
}
```

**Errores:**
- `400` - Estado inválido
- `403` - No puedes modificar esta solicitud
- `404` - Solicitud no encontrada

---

## 👤 Perfil Endpoints

### GET `/mi-perfil` (autenticado)

Obtener información del usuario autenticado.

**Response (200 OK):**
```json
{
  "id": 1,
  "codigo": "2023001",
  "nombre": "Juan Pérez",
  "telefono": "+57 123 456 7890",
  "email": "juan@example.com",
  "carrera": null,
  "semestre": null
}
```

### GET `/mis-solicitudes` (autenticado)

Obtener todas mis solicitudes.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "codigo_materia": "1",
    "grupo_que_ofrece": "025-61",
    "grupo_que_solicita": "025-62",
    "nombre_materia": "CALCULO DIFERENCIAL",
    "descripcion": "Conflicto horario",
    "estado": "activa",
    "total_interesados": 3,
    "created_at": "2026-02-19T15:30:00.000Z"
  }
]
```

---

## 🏥 Health Check

### GET `/health`

Verificar estado del servidor.

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-02-19T16:00:00.000Z"
}
```

---

## 📊 Códigos HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Autenticación requerida |
| 403 | Forbidden - No tienes permiso |
| 404 | Not Found - Recurso no existe |
| 500 | Server Error - Error interno |

---

## 🔑 Autenticación JWT

El token retornado en `/auth/login` contiene:

### Payload
```json
{
  "id": 1,
  "codigo": "2023001",
  "authKey": "abc123...",
  "iat": 1645271400
}
```

### Características
- Válido por 24 horas
- HMAC-SHA256 firmado
- Incluye ID del estudiante
- Incluye código de estudiante

### Uso
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29kaWdvIjoiMjAyMzAwMSIsImF1dGhLZXkiOiJhYmMxMjMuLi4iLCJpYXQiOjE2NDUyNzE0MDB9.firma...
```

---

## 🔄 Workflow Típico

### 1. Estudiante A quiere cambiar

```
POST /auth/login
  ↓
POST /solicitudes
  ↓
(publicada)
```

### 2. Estudiante B ve oferta

```
GET /solicitudes
  ↓
GET /solicitudes/:id
  ↓
POST /solicitudes/:id/contactar
```

### 3. Estudiante A ve interés

```
GET /mis-solicitudes
  ↓
GET /solicitudes/:id
  ↓
(ve contactos interesados)
```

### 4. Cierre

```
PUT /solicitudes/:id/estado
  ↓
(estado: completada)
```

---

## 📈 Rate Limiting

No implementado actualmente. En producción, considerar:

```
- 100 solicitudes por minuto por IP
- 10 solicitudes nuevas por hora por usuario
- 5 intentos de login por minuto
```

---

## 💾 Limpieza de Datos

### Borrar solicitud antigua

```sql
DELETE FROM solicitudes_cambio WHERE id = 1;
```

### Borrar estudiante

```sql
DELETE FROM estudiantes WHERE id = 1;
-- (borra automáticamente sus solicitudes)
```

---

## 🚀 Ejemplos con cURL

### Iniciar sesión

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "2023001",
    "numeroMateria": "1",
    "telefono": "+57 123 456 7890",
    "nombre": "Juan Pérez"
  }'
```

### Obtener horarios

```bash
curl http://localhost:3001/api/horarios?materia=1
```

### Crear solicitud

```bash
curl -X POST http://localhost:3001/api/solicitudes \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "codigoMateria": "1",
    "grupoQueTengo": "025-61",
    "grupoQueSolicito": "025-62",
    "descripcion": "Conflicto"
  }'
```

### Ver solicitudes

```bash
curl http://localhost:3001/api/solicitudes?estado=activa
```

---

## 📝 Notas

- Todos los timestamps en formato ISO 8601 (UTC)
- IDs son auto-incrementales
- No se puede cambiar teléfono después de registrarse (es parte de la auth)
- Los contactos interesados se borran cuando se borra la solicitud
