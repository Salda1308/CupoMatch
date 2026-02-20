# 🚀 Guía de Inicio Rápido

## Instalación (Primera Vez)

### Windows

1. Descargar [Node.js](https://nodejs.org) y [Python](https://python.org)
2. Hacer doble clic en `setup.bat`
3. Esperar a que termine

### macOS / Linux

1. Descargar [Node.js](https://nodejs.org) y [Python](https://python.org)
2. Ejecutar en terminal:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

## Cargar Horarios from PDFs

La primera vez (o cuando cambien los PDFs):

```bash
cd server
npm run parse-horarios
```

Esto:
- ✅ Lee todos los PDFs de `../Horarios/`
- ✅ Extrae automáticamente la información
- ✅ Guarda en la base de datos (`database.db`)
- ✅ Detecta el formato para adaptarse a nuevos semesters

**Nota**: Solo haz esto UNA sola vez por semestre. El parser aprende el formato.

## Iniciar el Sistema

### Terminal 1: Backend

```bash
cd server
npm run dev
```

Deberías ver:
```
╔═══════════════════════════════════════════╗
║ 🚀 Servidor API ejecutándose en:        ║
║   http://localhost:3001              ║
║ 🗄️  Base de datos: database.db       ║
╚═══════════════════════════════════════════╝
```

### Terminal 2: Frontend

```bash
cd client
python -m http.server 3000
# O: npx serve -p 3000
```

Verás:
```
Serving HTTP on 0.0.0.0 port 3000 ...
```

### Abrir en Navegador

- 🌐 **http://localhost:3000**

## Uso del Sistema

### 1️⃣ Iniciar Sesión

Necesitas tener estos datos del estudiante:
- **Código**: Tu carné (ej: 2023001)
- **Número Materia**: Cualquier código de materia (ej: 1, 2, etc.)
- **Teléfono**: Tu celular (ej: +57 123 456 7890)
- **Nombre** (opcional)

Esto NO es una contraseña, es para identificarte.

### 2️⃣ Ver Solicitudes

Pestaña **"Ver Solicitudes"** muestra:
- Todas las ofertas activas de otros estudiantes
- Qué grupo ofrecen
- Qué grupo buscan
- Teléfono de contacto
- Cuántos interesados hay

### 3️⃣ Crear un Oferta

En **"Mis Solicitudes"** → **"+ Nueva Solicitud"**:

**Ejemplo:**
```
Código Materia: 1
Grupo que Tengo: 025-61
Grupo que Solicito: 025-62
Descripción: Conflicto con otra materia a la misma hora
```

Esto se publica INMEDIATAMENTE y otros ven tu oferta.

### 4️⃣ Interesarse en una Oferta

Si ves una solicitud que te interesa:

1. Haz clic en **"Interesado"**
2. Completa:
   - Tu nombre
   - Tu teléfono (para que te contacten)
   - Email (opcional)
   - Mensaje (ej: "Tengo tu grupo!!")
3. Envía

**Resultado**: El dueño de la solicitud ve tu nombre y teléfono.

### 5️⃣ Ver Mis Interesados

En **"Mis Solicitudes"** haz clic en **"Ver (X interesados)"**:

Ves:
- Nombre de cada interesado
- Teléfono
- Email
- Mensaje que dejaron

**Ahora llama/contacta directamente a esa persona** por teléfono o WhatsApp.

### 6️⃣ Cerrar una Oferta

Cuando ya cambies de grupo:

1. En "Mis Solicitudes" busca la solicitud
2. Haz clic en **"Cerrar"**
3. El estado cambia a **"Cerrada"** y otros no la ven más

## 👥 Ejemplo Completo

### Estudiante A (Juan)

```
1. Login: código 2023001, materia 1, teléfono +57 123 456 7890
2. Pestaña "Mis Solicitudes" → "+ Nueva Solicitud"
3. Rellena:
   - Materia: 1
   - Tengo: 025-61
   - Quiero: 025-62
4. Publica
5. Espera a que alguien se interese
```

### Estudiante B (María)

```
1. Login: código 2024002, materia 1, teléfono +57 987 654 3210
2. Pestaña "Ver Solicitudes"
3. Ve la solicitud de Juan
4. Hizo clic en "Interesado"
5. Completa:
   - Nombre: María García
   - Teléfono: +57 987 654 3210
   - Mensaje: "¡Yo tengo el 025-62!"
6. Envía
```

### De Vuelta en Estudiante A (Juan)

```
7. Pestaña "Mis Solicitudes"
8. Ve su solicitud con "1 interesado"
9. Haz clic en "Ver (1 interesado)"
10. Lee:
    - María García
    - +57 987 654 3210
    - "¡Yo tengo el 025-62!"
11. Llama/WhatsApp a María
12. Dialogan y deciden cambiar
13. Se coordinan con sus profesores
14. Vuelve a "Mis Solicitudes" → "Cerrar" la solicitud
```

## 🔍 Ver Horarios

En la sección de la derecha **"Horarios Disponibles"**:

- Busca por materia o grupo
- Ve quién enseña
- Mira días y horas
- Mira dónde es la clase

Esto es para planificar mejor qué grupo buscar.

## ⚙️ Problemas Comunes

### No se conecta a la API

```
GET http://localhost:3001/api/horarios 
→ Error: 404 o Connection refused
```

**Solución:**
- Verificar que el backend está corriendo (`npm run dev` en terminal 1)
- Verificar que está en puerto 3001
- Ver consola del navegador (F12)

### Sesión expirada

```
GET /api/mis-solicitudes 
→ Error: 401 Unauthorized
```

**Solución:**
- Volver a iniciar sesión
- La sesión dura 24 horas

### PDFs no se cargaron

```
GET /api/horarios → Respuesta vacía
```

**Solución:**
```bash
cd server
npm run parse-horarios
# Esperar a que termine (unos segundos)
```

### No veo mis cambios

**Solución:**
- Hacer F5 (Refresh)
- Hacer clic en "Actualizar"

## 📱 Usar desde otro dispositivo

Sí, puedes:

1. Backend en `192.168.X.X:3001` (en lugar de localhost)
2. Frontend en `192.168.X.X:3000`
3. Desde otro dispositivo en la misma red accede a esas direcciones
4. El login funciona igual

## 🔒 Seguridad

✅ **Seguro porque:**
- No hay contraseñas (imposible phishing)
- JWT expirado en 24h
- CORS configurado
- SQL injection prevention

⚠️ **Ten cuidado con:**
- No compartir tu teléfono con gente que no conoces
- Revisa el mensaje de quien te contacta antes de cambiar
- Verifica que es realmente tu grupo compartiendo

## 🆘 Soporte

Si algo no funciona:

1. Abre consola del navegador: **F12**
2. Ve a **Console** y ve qué dice
3. Screenshot
4. Verifica los logs del servidor

## 🎯 Tips

- 💡 **Crea una solicitud lo antes posible** - Más visibilidad, más interesados
- 💡 **Ten descripción clara** - "Conflicto horario" > sin descripción  
- 💡 **Respond rápido** - No esperes mucho para contactar interesados
- 💡 **Usa WhatsApp** - Más cómodo que teléfono para coordinar
- 💡 **Confirma todo** - Asegurate que el cambio sea posible antes de cerrar

## 📞 Contacto

Si tienes dudas sobre el sistema, ve a ver al grupo SID en Discord/Teams.

---

**¡Listo! Ahora puedes cambiar de grupo sin problemas** 🎓
