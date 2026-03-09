#!/bin/bash

# =====================================================
# Sistema de Cambios de Grupo - Script de Setup
# =====================================================

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║                                                      ║"
echo "║   🎓 Sistema de Cambios de Grupo - Setup             ║"
echo "║                                                      ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# Función para imprimir errores
error_exit() {
    echo "❌ $1"
    exit 1
}

# Verificar Node.js
echo "[1/4] Verificando dependencias..."
if ! command -v node &> /dev/null; then
    error_exit "Node.js no está instalado. Descargarlo de: https://nodejs.org"
fi
echo "✓ Node.js encontrado"

# Verificar Python
if ! command -v python3 &> /dev/null; then
    error_exit "Python no está instalado. Descargarlo de: https://python.org"
fi
echo "✓ Python encontrado"

# Instalar pdfplumber (Python dependency)
echo "[1b/4] Instalando dependencias Python..."
python3 -m pip install pdfplumber > /dev/null 2>&1 || true
echo "✓ pdfplumber instalado"

# Setup Backend
echo ""
echo "[2/4] Instalando backend..."
cd server || error_exit "No se encontró carpeta server"
npm install || error_exit "Error instalando dependencias del backend"
echo "✓ Backend instalado"

# Crear .env
if [ ! -f .env ]; then
    echo "[3/4] Creando archivo de configuración..."
    cp .env.example .env
    echo "✓ .env creado (cambiar JWT_SECRET en producción)"
else
    echo "✓ .env ya existe"
fi
cd ..

# Verificar carpeta Horarios
if [ ! -d ../Horarios ]; then
    error_exit "Carpeta Horarios no encontrada en: $(pwd)/../Horarios"
fi
echo "✓ Carpeta Horarios encontrada"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║         ✅ Setup completado exitosamente!           ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo ""
echo "Para usar el sistema:"
echo ""
echo "1. Cargar horarios desde PDFs:"
echo "   cd server"
echo "   npm run parse-horarios"
echo ""
echo "2. Iniciar el backend:"
echo "   npm run dev"
echo ""
echo "3. En otra terminal, servir frontend:"
echo "   cd client"
echo "   python -m http.server 3000"
echo ""
echo "4. Abrir navegador:"
echo "   http://localhost:3000"
echo ""
echo ""
