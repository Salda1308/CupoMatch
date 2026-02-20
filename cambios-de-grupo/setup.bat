@echo off
REM =====================================================
REM System de Cambios de Grupo - Script de Setup
REM =====================================================

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║                                                      ║
echo ║   🎓 Sistema de Cambios de Grupo - Setup             ║
echo ║                                                      ║
echo ╚══════════════════════════════════════════════════════╝
echo.

REM Verificar Node.js
echo [1/4] Verificando dependencias...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js no está instalado. Descargarlo de: https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js encontrado

where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Python no está instalado. Descargarlo de: https://python.org
    pause
    exit /b 1
)
echo ✓ Python encontrado

REM Instalar pdfplumber (Python dependency)
echo [1b/4] Instalando dependencias Python...
pip install pdfplumber >nul 2>nul
echo ✓ pdfplumber instalado

REM Setup Backend
echo.
echo [2/4] Instalando backend...
cd server
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ Error instalando dependencias del backend
    cd ..
    pause
    exit /b 1
)
echo ✓ Backend instalado

REM Crear .env
if not exist .env (
    echo [3/4] Creando archivo de configuración...
    copy .env.example .env
    echo ✓ .env creado (cambiar JWT_SECRET en producción)
) else (
    echo ✓ .env ya existe
)
cd ..

REM Verificar carpeta Horarios
if not exist ..\Horarios (
    echo ❌ Carpeta Horarios no encontrada en: %cd%\..\Horarios
    echo    Por favor, asegurate que existe la carpeta de horarios
    pause
    exit /b 1
)
echo ✓ Carpeta Horarios encontrada

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║         ✅ Setup completado exitosamente!           ║
echo ╚══════════════════════════════════════════════════════╝
echo.
echo.
echo Para usar el sistema:
echo.
echo 1. Cargar horarios desde PDFs:
echo    cd server
echo    npm run parse-horarios
echo.
echo 2. Iniciar el backend:
echo    npm run dev
echo.
echo 3. En otra terminal, servir frontend:
echo    cd client
echo    python -m http.server 3000
echo.
echo 4. Abrir navegador:
echo    http://localhost:3000
echo.
echo.
pause
