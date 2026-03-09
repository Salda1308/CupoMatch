# 🎯 Instalación Paso a Paso

Este documento te guía para instalar y ejecutar el sistema de cambios de grupo.

## 📋 Requisitos Previos

- ✅ Windows 10/11, macOS o Linux
- ✅ [Node.js 18+](https://nodejs.org) - **Instalar primero**
- ✅ [Python 3.8+](https://python.org) - **Instalar segundo**
- ✅ Carpeta Horarios con PDFs en `../Horarios` (hermana del proyecto)

### Verificar Instalación

Abre terminal y verifica:

```bash
node --version
# Debería mostrar: v18.x.x o similar

python --version  
# Debería mostrar: Python 3.8.x o similar
```

## 🪟 Windows

### Paso 1: Descargar

- [Node.js 18 LTS](https://nodejs.org)
- [Python 3.11](https://python.org)

### Paso 2: Instalar

1. Ejecutar instalador de Node.js
   - Seguir wizard
   - Dejar valores por defecto
   - ✓ "Add to PATH"

2. Ejecutar instalador de Python
   - Muy importante: ✓ "Add Python to PATH"
   - ✓ "Install npm"

### Paso 3: Verificar

Abrir **PowerShell** nueva y escribir:

```powershell
node --version
python --version
npm --version
```

Deberían mostrar versiones.

### Paso 4: Ejecutar Setup

1. Navegar a la carpeta del proyecto
2. Doble clic en `setup.bat`
3. Esperar a que termine

Verás:
```
✓ Node.js encontrado
✓ Python encontrado  
✓ Backend instalado
✓ .env creado
✓ Carpeta Horarios encontrada
✅ Setup completado exitosamente!
```

### Paso 5: Cargar Horarios

```powershell
cd server
npm run parse-horarios
```

Esperar... verá:
```
Total de horarios cargados: 2847
Materias únicas: 156
Grupos únicos: 892
```

### Paso 6: Iniciar Backend

Dejar PowerShell abierto:

```powershell
npm run dev
```

Ver:
```
✓ Base de datos conectada
🚀 Servidor API ejecutándose en: http://localhost:3001
```

### Paso 7: Iniciar Frontend (Nueva terminal)

Abrir **PowerShell diferente** (no cerrar la anterior):

```powershell
cd client
# Python debe estar en PATH
python -m http.server 3000
```

Ver:
```
Serving HTTP on 0.0.0.0 port 3000
```

### Paso 8: Acceder

1. Abrir navegador
2. Ir a **http://localhost:3000**
3. ¡Listo!

---

## 🍎 macOS

### Paso 1: Instalar Homebrew (si no tiene)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Paso 2: Instalar Dependencias

```bash
brew install node python3
```

### Paso 3: Verificar

```bash
node --version
python3 --version
npm --version
```

### Paso 4: Ejecutar Setup

```bash
cd cambios-de-grupo
chmod +x setup.sh
./setup.sh
```

### Paso 5-8: Seguir igual que Windows

```bash
cd server
npm run parse-horarios
npm run dev

# En otra terminal:
cd client
python3 -m http.server 3000
```

---

## 🐧 Linux (Ubuntu/Debian)

### Paso 1: Instalar Dependencias

```bash
sudo apt-get update
sudo apt-get install nodejs npm python3 python3-pip
```

### Paso 2-8: Seguir igual que macOS

```bash
cd cambios-de-grupo
chmod +x setup.sh
./setup.sh

cd server
npm run parse-horarios
npm run dev

# Nueva terminal:
cd client
python3 -m http.server 3000
```

---

## ✅ Verificación

Si todo funciona:

- ✅ Backend en http://localhost:3001/health (responde OK)
- ✅ Frontend en http://localhost:3000 (carga interfaz)
- ✅ Puedes iniciar sesión
- ✅ Ves horarios cargados
- ✅ Puedes crear solicitud

---

## 🚨 Problemas Comunes

### Error: `command not found: node`

**Causa:** Node.js no está en PATH

**Solución:**
1. Reinstalar Node.js
2. Verificar que la opción "Add to PATH" estaba ✓
3. Reiniciar terminal

### Error: `ModuleNotFoundError: No module named 'pdfplumber'`

**Causa:** Python no tiene pdfplumber

**Solución:**
```bash
pip install pdfplumber
# O:
python -m pip install pdfplumber
```

### Error: `Port 3000 already in use`

**Causa:** Algo más usa puerto 3000

**Solución:**
```bash
# Cambiar puerto
python -m http.server 3001
# O matar proceso:
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -ti:3000 | xargs kill -9
```

### Error: `Cannot connect to API`

**Causa:** Backend no está corriendo

**Solución:**
1. ¿Abierta terminal con `npm run dev`?
2. ¿Dice `🚀 Servidor API ejecutándose`?
3. ¿Puerto 3001 sin cambios?

### Error: `0 horarios cargados`

**Causa:** PDFs no encontrados

**Solución:**
1. Verificar que carpeta `../Horarios` existe
2. Tiene PDFs adentro
3. Ejecutar: `npm run parse-horarios` nuevamente

---

## 🎮 Primeros Pasos

1. Abrir http://localhost:3000
2. Login:
   - Código: `2023001`
   - Materia: `1`
   - Teléfono: `+57 123 456 7890`
3. Hacer clic en "Ver Solicitudes"
4. Explorar horarios
5. Crear solicitud

---

## 📝 Notas

- Puedes cerrar navegador y volver (sesión dura 24h)
- Cambios de código requieren:
  - Backend: reiniciar `npm run dev`
  - Frontend: F5 en navegador
- Database en `server/database.db` (SQLite)
- Logs en consola del servidor

---

## 🚀 Próximo Paso

Ver [GUIDE.md](GUIDE.md) para aprender a usar el sistema.

¡Disfruta!
