# 🎓 Constructor de Horarios

**Aplicación moderna e intuitiva para diseñar tu horario perfecto**

Un constructor de horarios sin autenticación, 100% enfocado en la experiencia del usuario. Busca materias, visualiza los profesores y salones disponibles, y construye tu horario ideal de forma interactiva.

## ✨ Características

- ✅ **Sin autenticación** - Accede directamente sin login
- ✅ **Búsqueda inteligente** - Filtra materias por nombre o código
- ✅ **Visualización en calendario** - Horario semanal interactivo
- ✅ **Información completa** - Profesor, salón, sede y horario
- ✅ **Detección de conflictos** - Aviso si hay solapamiento de clases
- ✅ **Interfaz moderna** - Diseño limpio, responsivo y atractivo
- ✅ **Exportar horario** - Descarga tu horario en archivo de texto
- ✅ **Totalmente offline** - Funciona con tu base de datos existente

## 🏗️ Arquitectura

```
constructor-horarios/
├── server/
│   ├── src/
│   │   ├── server.js           # Servidor Express
│   │   ├── models/
│   │   │   └── database.js     # Conexión SQLite
│   │   └── routes/
│   │       └── api.js          # Endpoints REST
│   ├── package.json
│   └── README.md
└── client/
    └── index.html              # Aplicación completa (HTML + CSS + JS)
```

## 🚀 Inicio Rápido

### Requisitos
- Node.js 16+ 
- Base de datos `database.db` (usa la del proyecto `cambios-de-grupo`)

### 1️⃣ Instalación

```bash
# Navega a la carpeta del servidor
cd constructor-horarios/server

# Instala dependencias
npm install
```

### 2️⃣ Configuración de BD

Para usar la base de datos existente:
```bash
# Copia la base de datos del proyecto principal (si uses en otro lugar)
cp ../cambios-de-grupo/server/database.db ./database.db
```

O si quieres usar la misma BD del proyecto cambios-de-grupo:
```bash
# Desde constructor-horarios/server
rm -f database.db
ln -s ../../cambios-de-grupo/server/database.db database.db
# En Windows:
# mklink database.db ..\..\cambios-de-grupo\server\database.db
```

### 3️⃣ Inicia el servidor

```bash
npm start
```

Deberías ver:
```
╔════════════════════════════════════════╗
║   Constructor de Horarios - API       ║
║   Server running on port 3001         ║
╚════════════════════════════════════════╝
```

### 4️⃣ Abre en el navegador

```text
http://localhost:3001/client/index.html
http://localhost:3001/

O directamente el archivo:
file:///home/salda/Downloads/CupoMatch-Test/constructor-horarios/client/index.html
```

**Nota:** Si abres como archivo local (file://), algunos navegadores pueden bloquear las peticiones CORS.

## 📖 Cómo usar

### 🔍 Buscar Materias
1. Selecciona un **Semestre**
2. Elige tu **Carrera**
3. Busca las materias que quieres

### 📚 Agregar Materias
1. Haz clic en una materia
2. Elige el **grupo** que prefieres
3. Se agregará automáticamente a tu horario

### 👀 Ver tu Horario
- **Calendario visual** a la izquierda con vista semanal
- **Panel derecho** con detalles de cada clase
- **Detecta conflictos** automáticamente

### 📥 Exportar
- Usa el botón "Exportar" para descargar tu horario

### 🗑️ Limpiar
- Borra todo tu horario con un clic

## 🎨 Diseño

- **Dark Mode** por defecto (moderno y cómodo)
- **Colores vibrantes** para cada materia
- **Responsive** - Funciona en desktop, tablet y móvil
- **Animaciones suaves** y transiciones fluidas
- **Accesibilidad** - Íconos y labels claros

## 📡 API Endpoints

```
GET  /api/semestres              - Obtener semestres disponibles
GET  /api/carreras?semestre=X    - Obtener carreras
GET  /api/materias?carrera=X&semestre=Y&buscar=Z  - Buscar materias
GET  /api/grupos?codigo_materia=X&semestre=Y      - Obtener grupos
GET  /api/sedes?semestre=X       - Obtener sedes
GET  /api/horario-materia?codigo=X&grupo=Y&semestre=Z - Detalles
GET  /health                     - Estado del servidor
```

## 🔧 Tecnologías

**Backend:**
- Node.js + Express
- SQLite3
- CORS

**Frontend:**
- HTML5
- CSS3 (Flexbox, Grid, Animaciones)
- Vanilla JavaScript (sin dependencias)
- APIs rest nativas

## 🎯 Próximas Mejoras

- [ ] Guardar horarios en navegador (localStorage)
- [ ] Compartir horarios por QR/Link
- [ ] Imprimir horario optimizado
- [ ] Sugerencias de horarios automáticas
- [ ] Notificaciones de cambios en materias
- [ ] Integración con Google Calendar
- [ ] Modo claro/oscuro selector
- [ ] Múltiples idiomas

## ❓ Troubleshooting

### Port 3001 en uso
```bash
# Cambiar puerto
PORT=3002 npm start
```

### CORS error en navegador
- Abre la página desde `http://localhost:3001/client/index.html` (no file://)
- O configura CORS según tus necesidades en `server.js`

### BD no encontrada
- Asegúrate que `database.db` esté en `constructor-horarios/server/`
- O copia desde `cambios-de-grupo/server/database.db`

## 📝 Licencia

Mismo que el proyecto principal

## 👨‍💻 Autor

Generado como extensión del proyecto CupoMatch-Test

---

**¡Disfruta construyendo tu horario! 🎓📅**
