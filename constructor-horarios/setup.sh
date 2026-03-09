#!/bin/bash

# Constructor de Horarios - Setup Script

echo "╔═══════════════════════════════════════════╗"
echo "║  Constructor de Horarios - Setup         ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "Descárgalo en: https://nodejs.org"
    exit 1
fi

echo "✓ Node.js $(node --version) detectado"

# Ir a servidor
cd server

# Instalar dependencias
echo ""
echo "📦 Instalando dependencias..."
npm install

# Verificar BD
echo ""
if [ ! -f "database.db" ]; then
    echo "⚠️  Base de datos no encontrada"
    echo ""
    echo "Opciones:"
    echo "1. Copia la BD desde cambios-de-grupo/server/database.db"
    echo "2. O si está en la misma carpeta padre:"
    echo "   ln -s ../../cambios-de-grupo/server/database.db database.db"
    echo ""
    read -p "¿Quieres hacerlo ahora? (s/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        ln -s ../../cambios-de-grupo/server/database.db database.db
        echo "✓ BD vinculada"
    fi
fi

if [ -f "database.db" ]; then
    echo "✓ Base de datos detectada"
else
    echo "⚠️  BD no encontrada. La app no funcionará sin ella."
fi

echo ""
echo "✅ Setup completado!"
echo ""
echo "Próximos pasos:"
echo "1. Navega a: cd constructor-horarios/server"
echo "2. Inicia con: npm start"
echo "3. Abre: http://localhost:3001/../client/index.html"
echo ""
