#!/bin/bash
cd "$(dirname "$0")"

echo "==================================================="
echo "   Iniciando App de Prevención de Riesgos..."
echo "==================================================="

# Check for Node.js
if ! command -v npm &> /dev/null; then
    echo "❌ ERROR: No se encontró 'npm' (Node.js)."
    echo "Por favor, instala Node.js desde: https://nodejs.org/"
    echo "Una vez instalado, vuelve a ejecutar este archivo."
    echo "==================================================="
    read -p "Presiona Enter para salir..."
    exit 1
fi

echo "📦 Instalando librerías necesarias (esto puede tardar un poco)..."
npm install

echo "✅ Instalación completada."
echo "🚀 Arrancando el servidor..."
echo "⚠️  NO CIERRES ESTA VENTANA NEGRA mientras uses la app."
echo "==================================================="

# Start dev server and open browser
(sleep 3 && open http://localhost:5173) &
npm run dev
