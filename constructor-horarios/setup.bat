@echo off
setlocal enabledelayedexpansion

echo.
echo ╔═══════════════════════════════════════════╗
echo ║  Constructor de Horarios - Setup Windows ║
echo ╚═══════════════════════════════════════════╝
echo.

REM Verificar Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado
    echo Descárgalo en: https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
echo ✓ Node.js %NODE_VER% detectado

REM Ir a servidor
cd server

REM Instalar dependencias
echo.
echo 📦 Instalando dependencias...
call npm install

REM Verificar BD
echo.
if not exist "database.db" (
    echo ⚠️  Base de datos no encontrada
    echo.
    echo Opciones:
    echo 1. Copia la BD desde cambios-de-grupo\server\database.db
    echo 2. O ejecuta: mklink database.db ..\..\..\cambios-de-grupo\server\database.db
    echo.
    set /p CHOICE="¿Deseas crear el vínculo ahora? (s/n): "
    if /i "!CHOICE!"=="s" (
        mklink database.db ..\..\cambios-de-grupo\server\database.db
        echo ✓ BD vinculada
    )
) else (
    echo ✓ Base de datos detectada
)

echo.
echo ✅ Setup completado!
echo.
echo Próximos pasos:
echo 1. Inicia con: npm start
echo 2. Abre: http://localhost:3001/../client/index.html
echo.
pause
