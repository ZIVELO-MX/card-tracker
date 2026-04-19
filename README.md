<div align="center">
# Panini Tracker 2026
 
**Web app para coleccionistas del álbum Panini FIFA World Cup 2026.**
Gestiona tu colección, descubre las estampas más raras del mundo e intercambia mejor.
 
</div>
---
 
## El problema
 
980 estampas. Cero herramientas digitales decentes. Los coleccionistas siguen usando hojas de Excel, mensajes ilegibles de WhatsApp ("cambio 12, 47, 89...") y pura intuición para adivinar qué estampas son raras. **Panini Tracker 2026** resuelve esto con una app rápida, minimalista y mobile-first.
 
## Qué hace
 
- 📒 **Gestión personal** — Marca tus estampas como poseídas o repetidas. Filtros por grupo, país, brillantes y faltantes. UI optimista: respuesta en <50ms.
- 📊 **Rareza global en vivo** — Descubre qué estampas son realmente difíciles de conseguir a nivel mundial, calculado sobre los datos reales de todos los usuarios. No rumores. Datos.
- 🔄 **Listas de intercambio** — Genera texto formateado para WhatsApp e imagen optimizada para Instagram Stories. Link público compartible con tu oferta.
- 🌎 **Perfil público** — Cada usuario tiene su página `/u/[username]` con su progreso y su oferta de intercambio.
## Stack
 
| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 · App Router · RSC · PPR |
| Lenguaje | TypeScript (strict) |
| Estilos | Tailwind CSS v4 |
| UI primitives | Radix UI + shadcn/ui |
| Backend | Supabase (PostgreSQL · Auth · Realtime · Storage) |
| Data fetching | Server Components + TanStack Query |
| Forms & validación | React Hook Form + Zod |
| Imágenes OG | `@vercel/og` |
| Deploy | Vercel |
 
## Arquitectura
 
```
auth.users (Supabase Auth)
     │
     ▼
profiles ──────────────► user_stickers ◄────────── stickers
                              │                        │
                              │                        ▼
                              │                     sticker_categories
                              ▼
                     sticker_global_stats (materialized view)
                     └─ refrescada cada 10 min con pg_cron
```
 
**Decisiones clave:**
- **PK compuesta `(user_id, sticker_id)`** en `user_stickers` — idiomático en Postgres, sin índices redundantes.
- **Fila solo si `count ≥ 1`** — la ausencia representa "no la tiene". Con 10k usuarios ahorramos millones de filas vacías.
- **Row Level Security** activo en todas las tablas desde día uno.
- **Agregaciones vía materialized view** — rareza global sin consultas `O(n)` en la tabla transaccional.
- **Funciones RPC con `SECURITY DEFINER`** para exponer agregados sin filtrar datos privados.
El plan técnico completo está en [`PLAN_PROYECTO.md`](./PLAN_PROYECTO.md).
 
## El catálogo
 
981 estampas base:
- **Apertura** (IDs 00–20): logos, trofeo, mascota, estadios, posters.
- **Fase de Grupos** (IDs 21–980): 12 grupos × 4 selecciones × 20 estampas (escudo + foto equipo + 18 jugadores).
> Las secciones Coca-Cola, Legends y Extra Stickers se consideran **post-MVP**.
> La tabla `stickers` incluye un campo `catalog_version` para absorber cambios post-sorteo sin migrar data de usuarios.
 
## Estética
 
Inspirada en Linear, Vercel Dashboard y Raycast. Nada de gradientes deportivos, pelotas renderizadas ni verdes neón.
 
- Fondo `#0A0A0A`, superficies elevadas `#141414` y `#1C1C1C`.
- Un único acento: Panini green `#00A859`.
- Tipografía Geist Sans, escala estricta 12 / 14 / 16 / 20 / 28 / 40.
- Sistema visual basado en tipografía (códigos ISO de país en bold) en lugar de imágenes licenciadas — **cero riesgo de copyright**.
- Mobile-first. Tap targets ≥ 44px. Bottom sheets en móvil.
## Roadmap
 
| Fase | Semanas | Entregable |
|---|---|---|
| **01 · Setup & DB** | 1–2 | Proyecto inicializado, migraciones versionadas, catálogo seed (981 filas), RLS en todas las tablas. |
| **02 · Auth & Perfil** | 3 | Email + OAuth Google, onboarding con username único, perfil público, middleware SSR. |
| **03 · Colección** | 4–6 | Grid con filtros y búsqueda, mutaciones optimistas, generador de intercambios con imagen OG. |
| **04 · Analytics** | 7–8 | Materialized view + `pg_cron`, funciones RPC de rareza, dashboard `/stats`, PWA. |
 
## Cómo empezar
 
> ⚠️ El proyecto está en fase de setup inicial. Las instrucciones se completarán al final de la Fase 1.
 
```bash
# Clonar
git clone https://github.com/byrulaxx/panini-tracker-2026.git
cd panini-tracker-2026
 
# Instalar dependencias
pnpm install
 
# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase
 
# Desarrollo
pnpm dev
```
 
Variables requeridas (ver `.env.example`):
 
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
 
## Estructura del proyecto
 
```
.
├── app/                    # Next.js App Router
│   ├── (auth)/             # Login, signup, onboarding
│   ├── (app)/              # Rutas autenticadas
│   │   ├── collection/
│   │   ├── stats/
│   │   └── trade/
│   ├── u/[username]/       # Perfiles públicos
│   └── api/
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   └── features/           # Componentes de dominio
├── lib/
│   ├── supabase/           # Cliente SSR + browser
│   ├── queries/            # Queries de TanStack
│   └── utils/
├── supabase/
│   ├── migrations/         # Migraciones SQL versionadas
│   └── seed/               # Seed del catálogo de 981 estampas
└── PLAN_PROYECTO.md        # Documento técnico completo
```
 
## Criterios de "Done" para v1
 
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95.
- Bundle JS inicial < 150 KB.
- Cero errores de TypeScript, cero warnings de ESLint en CI.
- Flujos críticos cubiertos por E2E en Playwright: auth, marcar estampa, generar lista de intercambio.
## Contribuciones
 
Este proyecto está abierto a colaboradores. Áreas donde se necesita ayuda:
 
- **Desarrollo** — Frontend, full-stack con Next.js/Supabase.
- **Diseño** — Refinamiento de UI en Figma, sistema de componentes.
- **QA** — Coleccionistas reales probando en dispositivos reales.
- **Data** — Validación del catálogo oficial post-sorteo FIFA.
Abre un issue o un PR. Los PRs requieren que pase el CI (lint + type-check).
 
## Aviso legal
 
Este proyecto **no está afiliado, asociado, patrocinado ni respaldado por** Panini S.p.A., FIFA, ni ninguna federación nacional de fútbol. "Panini", "FIFA World Cup" y nombres de selecciones nacionales son marcas de sus respectivos dueños. Este es un proyecto independiente hecho por y para coleccionistas.
 
Todo el contenido visual del sistema (códigos de país en tipografía) es original y no reproduce ninguna obra licenciada.
 
## Licencia
 
MIT © Raul · BYRULAXX
 
---
 
<div align="center">
<sub>Construido con ☕ para los coleccionistas que se cansaron de las hojas de Excel.</sub>
</div>
 