# 🎓 Sistema de Cambios de Grupo

Aplicativo web completo para que estudiantes soliciten y coordinen cambios de grupo de forma autónoma, sin necesidad de intermediarios.

## 📋 Características

### Backend (Node.js/Express)
- ✅ API REST completa
- ✅ Autenticación sin contraseña (`código + materia + teléfono`)
- ✅ Parser automático de PDFs de horarios
- ✅ Detección automática de formato (adaptable a nuevos semesters)
- ✅ Base de datos SQLite
- ✅ CORS habilitado

### Frontend (HTML5/Vanilla JS)
- ✅ Interfaz moderna y responsive
- ✅ Cero dependencias
- ✅ Login intuitivo
- ✅ Publicar solicitudes
- ✅ Ver ofertas de otros
- ✅ Registrarse como interesado
- ✅ Gestionar mis solicitudes
- ✅ Ver horarios disponibles

## 🏗️ Arquitectura

```
cambios-de-grupo/
├── server/                    # Backend Node.js
│   ├── src/
│   │   ├── server.js         # Servidor principal
│   │   ├── routes/
│   │   │   └── api.js        # Rutas API
│   │   ├── middleware/
│   │   │   └── autenticacion.js  # JWT y auth
│   │   ├── models/
│   │   │   └── database.js   # SQLite
│   │   └── utils/
│   │       ├── HorariosParser.js  # Parser PDF
│   │       └── parseHorarios.js   # CLI para cargar PDFs
│   ├── package.json
│   ├── README.md
│   └── .env.example
│
└── client/                    # Frontend HTML/JS
    ├── index.html            # Aplicación web
    └── README.md
```

## 🚀 Inicio Rápido

### 1. Preparar Backend

```bash
cd server
cp .env.example .env
npm install
```

### 2. Cargar Horarios desde PDFs

```bash
npm run parse-horarios
```

Esto cargará automáticamente todos los PDFs de la carpeta `../../Horarios`.

### 3. Iniciar Servidor

```bash
npm run dev
```

El servidor corre en `http://localhost:3001`

### 4. Abrir Frontend

```bash
cd ../client
python -m http.server 3000
# O: npx serve -p 3000
```

Abre http://localhost:3000 en tu navegador.

## 🔐 Autenticación

### Sin Contraseña

No hay contraseñas. Se usa una clave **determinística y única**:

```
SHA256(`${codigoEstudiante}:${numeroMateria}:${telefono}`)
```

### Ventajas

✅ No olvidar contraseñas  
✅ Imposible phishing de contraseñas  
✅ Cada estudiante puede acceder desde cualquier dispositivo  
✅ No es necesario crear "usuarios"

### Cómo funciona

1. Estudiante ingresa: código (2023001) + materia (1) + teléfono (+57 123 456 7890)
2. Sistema genera la clave única
3. Si no existe, crea automáticamente el "usuario"
4. Si existe, autentica
5. Retorna token JWT válido por 24 horas

## 📡 API Endpoints

### POST /api/auth/login
Autenticación. Retorna token JWT.

### GET /api/horarios
Obtener horarios por materia, grupo o semestre.

### POST /api/solicitudes
Crear solicitud de cambio (requiere token).

### GET /api/solicitudes
Listar solicitudes activas.

### GET /api/solicitudes/:id
Obtener detalles de una solicitud.

### POST /api/solicitudes/:id/contactar
Registrarse como interesado.

### PUT /api/solicitudes/:id/estado
Cambiar estado (activa/cerrada/completada).

Ver documentación completa en [server/README.md](server/README.md)

## 📊 Datos de Ejemplo

### Login
```json
{
  "codigo": "2023001",
  "numeroMateria": "1",
  "telefono": "+57 123 456 7890",
  "nombre": "Juan Pérez"
}
```

### Solicitud
```json
{
  "codigoMateria": "1",
  "grupoQueTengo": "025-61",
  "grupoQueSolicito": "025-62",
  "descripcion": "Conflicto con otra materia"
}
```

### Contactar
```json
{
  "nombre": "María García",
  "telefono": "+57 987 654 3210",
  "email": "maria@example.com",
  "mensaje": "Yo tengo el grupo 025-62!"
}
```

## 🔄 Flujo de Uso

### 1️⃣ Estudiante A quiere cambiar de grupo

```
A: Login (código + materia + teléfono)
A: "Ofrezco grupo 025-61, solicito 025-62"
A: Publica solicitud
```

### 2️⃣ Estudiante B está interesado

```
B: Ve solicitud de A
B: "Hago clic en Interesado"
B: Deja su nombre y teléfono
```

### 3️⃣ Estudiante A ve el interés

```
A: Ve "1 interesado" en su solicitud
A: Hace clic para ver detalles
A: Ve teléfono de B
A: Contacta a B directamente
```

### 4️⃣ Se coordinan

```
Llaman por teléfono
Acuerdan el cambio
Ambos hablan con sus respectivos profesores/secretaría
```

### 5️⃣ Cierre

```
A: Cambia estado de solicitud a "Completada"
```

## 🛠️ Desarrollo

### Agregar nuevo endpoint

Editar `server/src/routes/api.js`:

```javascript
router.post('/nuevo-endpoint', middleware_autenticacion, async (req, res) => {
  try {
    // Tu código
    res.json({ resultado: 'ok' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Adaptar parser a nuevo formato PDF

Editar `server/src/utils/HorariosParser.js`, modificar métodos:
- `detectarFormato()`
- `extraerHorariosDePDF()`

### Cambiar puerto del servidor

En `.env`:
```env
PORT=3002
```

### Cambiar URL del backend desde frontend

En `client/index.html`:
```javascript
const API_URL = 'https://tu-servidor.com/api';
```

## 📚 Tecnologías

### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **SQLite3** - Base de datos
- **pdfplumber** - Procesamiento PDFs (Python)
- **CORS** - Manejo de CORS

### Frontend
- **HTML5** - Markup
- **CSS3** - Estilos (Flexbox, Grid)
- **JavaScript** - Lógica (Fetch API, LocalStorage)
- **Cero dependencias** - No necesita build

## 🔒 Seguridad

- ✅ CORS habilitado (configurable)
- ✅ JWT con HMAC-SHA256
- ✅ Tokens expiran en 24 horas
- ✅ No se almacenan contraseñas
- ✅ IDs de BD de solo lectura
- ✅ SQL injection prevention (prepared statements)

## 🌐 Deployment Recomendado

### Backend
- Heroku, Railway, Render
- DigitalOcean, Linode, AWS
- Variables de entorno en .env

### Frontend
- Netlify, Vercel (static)
- GitHub Pages
- Apache/Nginx

### Base de Datos
- SQLite en servidor (embebida)
- O migrar a PostgreSQL

## 📝 Variables de Entorno

```env
# .env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://tu-dominio.com
JWT_SECRET=tu-secreto-muy-largo-y-seguro
```

## 🚨 Errores Comunes

| Error | Solución |
|-------|----------|
| Cannot find pdfplumber | `pip install pdfplumber` |
| CORS error | Configurar FRONTEND_URL correctamente |
| Token expired | Volver a iniciar sesión |
| Port already in use | Cambiar PORT en .env |
| PDF no se carga | Asegurar ruta correcta en parseHorarios.js |

## 📞 Soporte

- 🔍 Revisar console del navegador (F12)
- 📝 Ver logs del servidor
- 📚 Leer READMEs en `server/` y `client/`

## 📄 Licencia

MIT - Libre para usar, modificar y distribuir.

## 🎯 Próximas Características

- [ ] Notificaciones por email
- [ ] Chat integrado entre estudiantes
- [ ] Historial de cambios completados
- [ ] Ratings/reputación
- [ ] Integración con banner del estudiante
- [ ] App móvil (React Native)
- [ ] Calendario visual de conflictos
- [ ] Bot de Telegram

## 👥 Contribuciones

¡Las contribuciones son bienvenidas! 🎉

Hacer fork, crear rama, hacer pull request.

---

**Última actualización:** 19 de febrero de 2026

Hecho con ❤️ para facilitar la vida de los estudiantes.
