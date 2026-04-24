<div align="center">

# Stickio

**Gestor de colección de estampas del álbum FIFA World Cup 2026.**
Marca tus estampas, identifica tus repetidas e intercambia con otros coleccionistas.

</div>

---

## Qué hace

- **Álbum digital** — 992 estampas organizadas por selección y posición (portero, defensas, mediocampistas, delanteros, escudo, foto equipo).
- **Filtros por país** — Picker con bandera y porcentaje de completitud por selección.
- **Intercambios** — Selecciona repetidas y faltantes, ve el balance (das / recibes) antes de confirmar.
- **Perfil y colección en la nube** — Login con email, colección sincronizada con Supabase. Los datos se mezclan al iniciar sesión: Supabase gana conflictos, los datos locales se suben si no existen en la nube.
- **Vista desktop y móvil** — Dos layouts independientes, detectados automáticamente.

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 18 (CDN, sin bundler) |
| Backend / Auth | Supabase (PostgreSQL · Auth) |
| Estilos | CSS-in-JS inline (sin framework) |
| Deploy | Vercel (sitio estático, sin build step) |

> No hay Node.js, no hay npm, no hay TypeScript. Todo corre directo en el navegador desde `index.html`.

## Estructura

```
.
├── index.html              # Punto de entrada único — monta la app React
├── privacy.html            # Política de privacidad
├── terms.html              # Términos y condiciones
├── components/
│   ├── atoms.jsx           # Componentes base (StickerCard, Badge, etc.)
│   ├── tokens.jsx          # Design tokens (colores, tipografía, espaciado)
│   ├── theme-and-modal.jsx # ThemeContext y ModalContext
│   ├── mobile-1.jsx        # Login / registro / perfil móvil
│   ├── mobile-2.jsx        # Álbum, scan, trade (móvil)
│   ├── desktop.jsx         # Layout desktop
│   ├── desktop-2.jsx       # Login / registro / álbum (desktop)
│   └── desktop-3.jsx       # Vistas adicionales desktop
├── docs/
│   ├── DATABASE_SCHEMA.md  # Esquema de tablas Supabase
│   └── GOOGLE_OAUTH_SETUP.md
├── img/
│   └── stickio-favicon.png
├── CONTRIBUTING.md
├── ROADMAP.md
└── AI-COLLAB.md            # Canal de comunicación con agentes AI
```

## Deploy en Vercel

El proyecto es un sitio estático — no requiere build.

1. Importa el repositorio en [vercel.com](https://vercel.com).
2. Deja el **Framework Preset** en `Other` (sin build command).
3. Agrega las variables de entorno en el dashboard de Vercel:

```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
```

> La `anon key` de Supabase es segura para exponer en el frontend siempre que las políticas RLS estén activas en tus tablas.

## Supabase — tablas requeridas

```sql
-- Usuarios (manejado por Supabase Auth)
-- Perfiles
create table profiles (
  id uuid primary key references auth.users(id),
  username text unique,
  full_name text,
  avatar_url text
);

-- Colección
create table collections (
  user_id uuid references auth.users(id),
  sticker_id text,
  quantity int default 1,
  updated_at timestamptz default now(),
  primary key (user_id, sticker_id)
);
```

Habilita RLS en ambas tablas y crea políticas para que cada usuario solo vea y modifique sus propios registros.

## Desarrollo local

No hay dependencias que instalar. Solo abre `index.html` en un servidor local:

```bash
# Con Python
python3 -m http.server 8080

# O con Node (npx)
npx serve .
```

Luego abre `http://localhost:8080`.

## Contribuciones

Ver [`CONTRIBUTING.md`](./CONTRIBUTING.md) para convenciones de ramas, commits y PRs.

## Aviso legal

Este proyecto no está afiliado ni respaldado por FIFA, Panini S.p.A. ni ninguna federación de fútbol. Los nombres de selecciones y la competencia son marcas de sus respectivos dueños. Proyecto independiente hecho por coleccionistas, para coleccionistas.

## Licencia

MIT © Raul · BYRULAXX
