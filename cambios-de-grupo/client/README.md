# 🎓 Sistema de Cambios de Grupo - Frontend

Interfaz web moderna para gestionar cambios de grupo entre estudiantes.

## 🚀 Características

- 🔐 Acceso sin contraseña (código + materia + teléfono)
- 📋 Ver todas las solicitudes activas
- ✨ Publicar tus propias solicitudes
- 👥 Registrarse como interesado
- 📅 Consultar horarios disponibles
- 📱 Diseño responsive (mobile-first)
- ⚡ Interfaz intuitiva y rápida

## 🛠️ Setup

### Opción 1: Servir localmente (Simple)

```bash
# Con Python 3
python -m http.server 3000

# O con Node.js
npx serve -p 3000
```

Luego abre: http://localhost:3000

### Opción 2: Servir con servidor

Usar cualquier servidor web (Nginx, Apache, etc.) apuntando a esta carpeta.

## ⚙️ Configuración

El frontend se conecta automáticamente a:
- **Backend**: `http://localhost:3001/api`

Para cambiar, editar en `index.html`:

```javascript
const API_URL = 'http://localhost:3001/api';
```

## 📱 Uso

### 1. Iniciar Sesión

- Ingresa tu código de estudiante
- Ingresa el número de materia
- Ingresa tu teléfono
- Opcionalmente tu nombre

**NO es contraseña**, es para identificarte de forma única.

### 2. Ver Solicitudes

En la pestaña "Ver Solicitudes" ves todas las ofertas activas de otros estudiantes:
- Qué grupo ofrecen
- Qué grupo buscan  
- Quién lo publicó (teléfono)
- Interesados

### 3. Crear una Solicitud

En "Mis Solicitudes" → "+ Nueva Solicitud":
- Código de materia
- Grupo que tengo
- Grupo que quiero
- Descripción opcional

### 4. Interesarse en una Oferta

Si ves una solicitud que te interesa:
- Haz clic en "Interesado"
- Deja:
  - Tu nombre
  - Tu teléfono
  - Tu email (opcional)
  - Un mensaje

El dueño de la solicitud verá tu información y puede contactarte.

### 5. Ver Interesados

En "Mis Solicitudes" haz clic en "Ver Detalles" para ver a quiénes les interesa tu solicitud:
- Nombre, teléfono, email
- Mensaje que dejaron
- Puedes contactarlos directamente

## 🎨 Diseño

- Gradiente morado (`#667eea` a `#764ba2`)
- Interfaz limpia y moderna
- Totalmente responsive
- Sin dependencias externas

## 🔄 Flujo Típico

```
1. Juan publica: "Tengo grupo 025-61, quiero 025-62"
   ↓
2. María ve la solicitud y le interesa
   ↓
3. María hace clic en "Interesado" dejando su teléfono
   ↓
4. Juan ve a María como interesada en su solicitud
   ↓
5. Juan llama a María directamente
   ↓
6. Se coordinan y acuerdan cambiar
   ↓
7. Juan cierra su solicitud en "Mis Solicitudes"
```

## 📊 Datos Almacenados

El frontend solo almacena localmente:
- Token JWT (válido 24 horas)
- Información básica del estudiante

TODO se sincroniza con el backend.

## 🛡️ Privacidad

- El teléfono es visible en las solicitudes (es el punto de contacto)
- El email es opcional
- Los datos NO se usan para publicidad
- Se pueden cerrar solicitudes en cualquier momento

## 📝 Notas

- La sesión expira en 24 horas
- Puedes tener múltiples solicitudes activas
- Los contactos interesados NO crean usuario automáticamente
- El sistema está diseñado para contacto directo entre estudiantes

## 🐛 Troubleshooting

### "No se conecta a la API"
- Verificar que el backend está corriendo en puerto 3001
- Revisar que CORS está habilitado
- Abrir consola (F12) para ver errores

### "Sesión expirada"
- Volver a iniciar sesión
- La sesión dura 24 horas

### "No veo mis solicitudes"
- Hacer clic en "Actualizar"
- Verificar que estás en la pestaña correcta

## 📄 Licencia

MIT
