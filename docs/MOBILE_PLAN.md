# Plan de Estabilización Mobile — Stickio
**Fecha:** 2026-04-24  
**Rama base:** `fix/mobile-login-statusbar`  
**Objetivo:** Llevar la experiencia mobile a paridad funcional y visual con desktop para lanzamiento.

---

## Diagnóstico por pantalla

### 🔴 CRÍTICO — Bloqueadores de lanzamiento

#### 1. `computeStats` — sobreconteo de `have` con estampas FWC/CC
**Archivo:** `index.html` — `computeStats()`  
**Bug:** Itera `Object.values(collection)` sin filtrar claves. Si el usuario tiene estampas especiales (`FWC00`, `CC01`, etc.), se suman a `have` pero el `total` solo cuenta estampas de países. El porcentaje puede superar 100%.  
**Fix:** Filtrar en `computeStats` solo las claves con formato de país (`/^[A-Z]{3}\d{2}$/`), o bien incluir las especiales en `TOTAL`.

#### 2. `marketplaceListings` — nunca se carga desde Supabase al iniciar
**Archivo:** `index.html` — estado inicial `[]`  
**Bug:** `marketplaceListings` arranca como `[]` y no hay un `useEffect` de carga inicial visible. El feed del Marketplace aparece vacío aunque haya publicaciones activas en Supabase.  
**Fix:** Agregar `useEffect` que llame a `window.supabase.from('marketplace_listings').select(...)` al montar la app (cuando `userId` esté disponible), y `setMarketplaceListings`.

#### 3. `AlbumScreen` — filtro `filterFn` opera sobre estado del demo, no sobre `merged`
**Archivo:** `components/mobile-2.jsx` — `AlbumScreen`  
**Bug:** `filterFn` referencia `s.state`, pero `s` en `filtered = merged.filter(filterFn)` viene de `merged` (que sí tiene estado real). El problema ocurre si `merged` no cubre algún sticker: los stickers de FWC/CC no pasan por `sections`, por lo que nunca aparecen en el álbum aunque estén en `collection`.  
**Fix:** Agregar secciones de FWC y CC en `sections` del AlbumScreen, usando `specialStickers()` y `ccStickers()` ya definidos.

#### 4. `DashboardScreen` — no recibe `userId`
**Archivo:** `index.html` línea 822  
**Bug:** `<DashboardScreen>` no recibe `userId`. Si en algún momento Dashboard necesita hacer queries de Supabase (leaderboard, notificaciones de server, etc.) o el sistema se extiende, falla silenciosamente.  
**Fix:** Pasar `userId={userId}` en el render.

---

### 🟡 MAYOR — Degradan experiencia significativamente

#### 5. `stickersFor` — datos demo en `state`/`count` iniciales no eliminados
**Archivo:** `components/mobile-2.jsx` — `stickersFor()`  
**Problema:** La función genera `state: 'have'` / `state: 'duplicate'` basado en `country.have` (valor hardcodeado). `AlbumScreen` los sobreescribe correctamente con `merged`, pero los componentes que consuman las secciones directamente (ej. `DashboardScreen` con `topCountries`) verían datos falsos.  
**Fix:** En `stickersFor`, siempre generar `state: 'missing'`, `count: 0`. El estado real lo computa `AlbumScreen` al hacer `merged`.

#### 6. `ProfileScreen` — "Últimas marcadas" usa `activityLog` pero puede estar vacío sin indicación
**Archivo:** `components/mobile-2.jsx` — `ProfileScreen` línea ~1319  
**Problema:** Si `activityLog` está vacío (primer uso, o usuario nuevo), la sección "Últimas marcadas" muestra nada sin mensaje de empty state.  
**Fix:** Agregar empty state: _"Aún no has marcado estampas."_

#### 7. `TradeHistoryMobile` — sin empty state ni loading state
**Archivo:** `components/mobile-2.jsx` — `TradeHistoryMobile`  
**Problema:** Si no hay historial de trades, pantalla en blanco.  
**Fix:** Agregar empty state: _"No tienes intercambios todavía."_

#### 8. `ProfileScreen` — validación de `whatsapp`/`phone` incompleta en edición
**Archivo:** `components/mobile-2.jsx` — `ProfileScreen` save handler  
**Problema:** El usuario puede guardar un número de WhatsApp sin el prefijo internacional, lo que rompe el link `wa.me/`. No hay validación visible de formato.  
**Fix:** Validar que el campo empiece con `+` y tenga al menos 10 dígitos, o mostrar hint claro.

#### 9. `AlbumScreen` — prop `notifications` recibida en `index.html` pero no declarada en firma
**Archivo:** `components/mobile-2.jsx` — `AlbumScreen` firma  
**Problema:** Se pasa `notifications` desde `index.html` pero `AlbumScreen` no la declara en sus props ni la usa. React no rompe, pero indica que el componente nunca mostrará badge de notificaciones en el álbum (a diferencia del header de desktop).  
**Fix (diseño):** Decidir si el álbum mobile necesita el bell/badge; si no, quitar el prop en index.html.

#### 10. `MarketplaceScreen` — contacto por WhatsApp falla silenciosamente si `profile.whatsapp` es null
**Archivo:** `components/mobile-2.jsx` — `contactHrefFor()`  
**Problema:** Si el publicador no tiene WhatsApp/phone guardado, el botón "Contactar" no aparece, pero no hay feedback al usuario explicando por qué no puede contactar.  
**Fix:** Mostrar tooltip o texto: _"Este usuario no compartió su contacto."_

---

### 🟢 MENOR — Pulido y deuda técnica

#### 11. `FoilSticker` — componente muerto en mobile-2.jsx
**Archivo:** `components/mobile-2.jsx` línea 1722  
**Problema:** Fue reemplazado por "últimas marcadas" en commit `01f56c7` pero el componente sigue definido. Dead code.  
**Fix:** Eliminar `function FoilSticker`.

#### 12. `MobileStatus` — exportado pero no usado
**Archivo:** `components/mobile-1.jsx` línea 1196  
**Problema:** `Object.assign(window, { ..., MobileStatus, ... })` exporta el componente eliminado en `33f9dee`. Queda como ruido.  
**Fix:** Quitar `MobileStatus` del `Object.assign`.

#### 13. Dashboard `topCountries` — calcula progress desde `collection` pero usa stickers generados en `sections`
**Archivo:** `components/mobile-1.jsx` — `DashboardScreen`  
**Problema menor:** El cálculo de países más completos puede estar usando los stickers de `stickersFor` con datos demo en lugar de derivar 100% de `collection`. Verificar que `topCountries` use `COUNTRIES.map(c => { qty de collection })`.

#### 14. `DashboardScreen` — `activityLog` puede mostrar entradas de sesiones anteriores sin límite
**Problema:** No hay cap visible de cuántas entradas del log se muestran. En mobile el scroll puede ser interminable.  
**Fix:** Limitar a las últimas 20 entradas en el render.

#### 15. `ResetPasswordScreen` — redirige a `window.location.origin + window.location.pathname` (funciona en Vercel pero no en dev con hash routing)
**Archivo:** `components/mobile-1.jsx` línea 764  
**Problema:** Si se usa hash routing o rutas específicas, el redirect post-reset no lleva a la pantalla correcta.  
**Fix menor:** Verificar que en Vercel este redirect funcione end-to-end antes del launch.

---

## Plan de ejecución

### Fase 1 — Críticos (antes del launch)
| # | Tarea | Archivo | Rama sugerida |
|---|-------|---------|---------------|
| 1 | Fix `computeStats` — excluir FWC/CC del conteo de `have`/`total` | `index.html` | `fix/mobile-stats-overcount` |
| 2 | Agregar `useEffect` de carga inicial de marketplace listings | `index.html` | `fix/marketplace-load` |
| 3 | Agregar secciones FWC/CC a `AlbumScreen` | `mobile-2.jsx` | `fix/album-special-stickers` |
| 4 | Pasar `userId` a `DashboardScreen` | `index.html` | `fix/dashboard-userid` |

### Fase 2 — Mayores (antes del soft launch)
| # | Tarea | Archivo |
|---|-------|---------|
| 5 | Fix `stickersFor` — siempre `state: 'missing'`, `count: 0` | `mobile-2.jsx` |
| 6 | Empty state en "Últimas marcadas" del Perfil | `mobile-2.jsx` |
| 7 | Empty state en Trade History | `mobile-2.jsx` |
| 8 | Validación de WhatsApp en edición de perfil | `mobile-2.jsx` |
| 9 | Feedback en Marketplace si contacto es null | `mobile-2.jsx` |
| 10 | Decidir prop `notifications` en AlbumScreen | `index.html` / `mobile-2.jsx` |

### Fase 3 — Pulido (post-launch o en paralelo)
| # | Tarea |
|---|-------|
| 11 | Eliminar `FoilSticker` |
| 12 | Quitar `MobileStatus` del Object.assign |
| 13 | Verificar `topCountries` en Dashboard |
| 14 | Cap de 20 entradas en `activityLog` en Dashboard |
| 15 | Probar reset-password redirect en Vercel |

---

## Convención de ramas
Seguir formato: `fix/mobile-<descripcion-corta>`  
PRs ligados a issue correspondiente con `Closes #<id>`.
