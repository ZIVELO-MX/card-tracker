# Card Tracker

Aplicación web para administrar tu colección de estampas del álbum Panini FIFA World Cup 2026.

## Descripción

Una aplicación web para administrar tu colección de estampas del álbum Panini FIFA World Cup 2026. Lleva un registro detallado de las estampas que tienes, las que te faltan y las que están repetidas. Consulta estadísticas de rareza globales basadas en la comunidad de coleccionistas y genera listas inteligentes de intercambio para completar tu álbum más rápido.

## Características

- 📊 Gestión completa de tu colección personal (tengo/faltan/repetidas)
- 🌍 Estadísticas de rareza global según datos de la comunidad
- 🔄 Generación automática de listas de intercambio optimizadas
- 📱 Interfaz responsive para dispositivo móvil y escritorio
- 🎯 Recomendaciones inteligentes de intercambios prioritarios

## Estructura del Proyecto

```
card-tracker/
├── server/          # API y lógica de negocio
├── client/          # Interfaz de usuario
└── docs/            # Documentación
```

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/card-tracker.git
cd card-tracker

# Instalar dependencias del servidor
cd server
npm install
cp .env.example .env

# Instalar dependencias del cliente
cd ../client
npm install
cp .env.local.example .env.local
```

## Uso

### Desarrollo

```bash
# Terminal 1 - Servidor (puerto 5000)
cd server
npm run dev

# Terminal 2 - Cliente (puerto 3000)
cd client
npm run dev
```

Accede a la aplicación en `http://localhost:3000`

## Contribuir

Por favor lee [CONTRIBUTING.md](CONTRIBUTING.md) para detalles sobre el proceso de contribución.

## Licencia

Por definir
