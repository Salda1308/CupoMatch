# 🎓 Sistema de Cambios de Grupo - Backend

API REST para gestionar solicitudes de cambios de grupo entre estudiantes, con extracción automática de horarios desde PDFs.

## 🚀 Características

- ✅ Autenticación sin contraseña: `código + materia + teléfono`
- ✅ Parser automático de PDFs de horarios
- ✅ Sistema de solicitudes de cambio de grupo
- ✅ Registro de interesados sin crear usuario
- ✅ API REST completa
- ✅ Base de datos SQLite

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- Python 3.7+ (para procesamiento de PDFs)
- pdfplumber (instalado automáticamente en BD)

## 🔧 Instalación

```bash
cd server
npm install
```

## 📖 Configuración

Crear archivo `.env`:

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
JWT_SECRET=tu-secreto-super-seguro
```

## 🏃 Ejecución

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm start
```

### Cargar Horarios desde PDFs

```bash
npm run parse-horarios
# O con parámetros personalizados:
# node src/utils/parseHorarios.js ../../../Horarios 2026-1
```

## 📡 API Endpoints

### Autenticación

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "codigo": "2023001",
  "numeroMateria": "1",
  "telefono": "+34 123 456 789",
  "nombre": "Juan Pérez"
}
```

**Respuesta:**
```json
{
  "token": "eyJ...",
  "estudiante": {
    "id": 1,
    "codigo": "2023001",
    "telefono": "+34 123 456 789",
    "nombre": "Juan Pérez"
  }
}
```

### Horarios

#### Obtener Horarios

```http
GET /api/horarios?materia=CALCULO&grupo=025&semestre=2026-1
```

**Respuesta:**
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
      }
    ]
  }
]
```

### Solicitudes de Cambio

#### Crear Solicitud

```http
POST /api/solicitudes
Authorization: Bearer <token>
Content-Type: application/json

{
  "codigoMateria": "1",
  "grupoQueTengo": "025-61",
  "grupoQueSolicito": "025-62",
  "descripcion": "Conflicto de horarios con otra materia"
}
```

#### Listar Solicitudes Activas

```http
GET /api/solicitudes?materia=1&estado=activa
```

#### Obtener Solicitud Específica

```http
GET /api/solicitudes/1
```

**Respuesta con Contactos Interesados:**
```json
{
  "id": 1,
  "codigo_materia": "1",
  "grupo_que_ofrece": "025-61",
  "grupo_que_solicita": "025-62",
  "nombre_materia": "CALCULO DIFERENCIAL",
  "nombre": "Juan Pérez",  
  "telefono": "+34 123 456 789",
  "contactos": [
    {
      "id": 5,
      "nombre_interesado": "María García",
      "telefono_interesado": "+34 987 654 321",
      "email_interesado": "maria@example.com",
      "mensaje": "¡Yo estoy interesado!",
      "estado": "no_contactado",
      "created_at": "2026-02-19..."
    }
  ],
  "estado": "activa"
}
```

#### Registrarse como Interesado

```http
POST /api/solicitudes/1/contactar
Content-Type: application/json

{
  "nombre": "María García",
  "telefono": "+34 987 654 321",
  "email": "maria@example.com",
  "mensaje": "Yo tengo el grupo 025-62 y quiero tu grupo 025-61"
}
```

#### Actualizar Estado de Solicitud

```http
PUT /api/solicitudes/1/estado
Authorization: Bearer <token>
Content-Type: application/json

{
  "estado": "cerrada"
}
```

Estados válidos: `activa`, `cerrada`, `completada`

### Mi Perfil

#### Obtener Mis Solicitudes

```http
GET /api/mis-solicitudes
Authorization: Bearer <token>
```

#### Obtener Mi Perfil

```http
GET /api/mi-perfil
Authorization: Bearer <token>
```

## 🗄️ Estructura de Base de Datos

### horarios
```sql
- id, codigo_materia, nombre_materia, grupo
- carrera, docente, dia, hora_inicio, hora_fin
- sala, edificio, sede, inscritos, max_inscritos
- semestre, created_at
```

### estudiantes
```sql
- id, codigo_estudiante, nombre, telefono, email
- carrera, semestre, auth_key, created_at
```

### solicitudes_cambio
```sql
- id, estudiante_id, codigo_materia
- grupo_que_ofrece, grupo_que_solicita
- estado, descripcion, contacto_*, created_at
```

### contactos_interesados
```sql
- id, solicitud_id, estudiante_interesado_id
- nombre_interesado, telefono_interesado, email_interesado
- mensaje, estado, created_at
```

## 🔐 Autenticación

### Clave Única Determinística

La autenticación funciona sin contraseñas usando una clave única:

```
SHA256(`${codigoEstudiante}:${numeroMateria}:${telefono}`)
```

Esta clave es determinística, por lo que siempre genera el mismo token para los mismos datos.

### JWT Simple

Los tokens contienen:
- ID del estudiante
- Código del estudiante
- Auth key
- Expiración (24 horas)

## 📊 Formato de PDFs Soportado

El parser detecta automáticamente el formato de los PDFs. Soporta:

```
Formato Estándar (Detectado en PDFs de horarios):
- PROYECTO CURRICULAR: Carrera
- ESPACIO ACADEMICO: Nombre de la materia
- GRP. XXX-XX: Grupo
- Filas con: Código | Materia | Día | Hora | Sede | Edificio | Salón | Docente
```

Para nuevos formatos, modificar `HorariosParser.js` en `src/utils/`.

## 🔄 Flujo de Cambio de Grupo

1. **Estudiante 1** crea solicitud: "Tengo grupo 025-61, quiero 025-62"
2. **Estudiante 2** ve la solicitud y se interesa
3. **Estudiante 2** hace clic en "Contactar" dejando su información
4. **Estudiante 1** recibe notificación con datos de Estudiante 2
5. **Estudiante 1** contacta directamente a Estudiante 2 por teléfono
6. Si acuerdan, **Estudiante 1** cambia estado a "completada"

## 🛠️ Troubleshooting

### Error: "Cannot find pdfplumber"
```bash
pip install pdfplumber
```

### Error: "Port already in use"
```bash
# Cambiar en .env o terminal:
PORT=3002 npm run dev
```

### Base de datos corrupta
```bash
rm database.db
npm run parse-horarios
```

## 📝 Notas

- Las contraseñas NO se almacenan
- Los datos de teléfono NO se pueden cambiar (es parte de la clave única)
- Un mismo estudiante puede tener múltiples solicitudes
- Los contactos interesados NO crean usuario automáticamente

## 📄 Licencia

MIT
