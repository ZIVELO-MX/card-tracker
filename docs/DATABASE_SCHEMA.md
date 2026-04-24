# Esquema de Base de Datos

Esquema de datos para Card Tracker (Stickio).

---

## Entidades

### Card (Estampa)

Representa una estampa individual del álbum.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | Identificador único (ej: `"001"`) |
| `number` | number | Número de la estampa en el álbum |
| `name` | string | Nombre del jugador / personaje |
| `group` | string | Grupo/sección del álbum (ej: `"Grupo A"`) |
| `rarity` | `"common" \| "rare" \| "legendary"` | Rareza de la estampa |
| `imageUrl` | string (opcional) | URL de imagen de la estampa |

---

### Collection (Colección del usuario)

Estado de la colección de un usuario específico.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `userId` | string | ID del usuario dueño de la colección |
| `cardId` | string | ID de la estampa (`Card.id`) |
| `quantity` | number | Cantidad que posee (0 = falta, 1 = tiene, 2+ = repetida) |
| `updatedAt` | string (ISO) | Última actualización |

---

### GlobalStats (Estadísticas Globales)

Estadísticas agregadas de la colección del usuario.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `userId` | string | ID del usuario |
| `total` | number | Total de estampas del álbum |
| `have` | number | Estampas que tiene (quantity >= 1) |
| `missing` | number | Estampas que faltan (quantity == 0) |
| `duplicates` | number | Estampas repetidas (quantity >= 2) |
| `completionPct` | number | Porcentaje de completado (0–100) |
| `updatedAt` | string (ISO) | Última actualización |

---

### TradeList (Lista de Intercambios privada)

Lista personal de estampas marcadas para intercambiar (previa al Marketplace).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `userId` | string | ID del usuario |
| `cardId` | string | ID de la estampa |
| `type` | `"offer" \| "want"` | Si la ofrece o la necesita |
| `addedAt` | string (ISO) | Fecha en que se marcó |

---

### MarketplaceListing (Publicación en Marketplace)

Publicación pública donde un usuario declara lo que tiene o necesita.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | string (uuid) | Identificador único de la publicación |
| `userId` | string | ID del usuario que publica |
| `userName` | string | Nombre visible del usuario |
| `type` | `"have" \| "want" \| "exchange"` | Tipo: tengo / necesito / intercambio |
| `cards` | string[] | Array de `Card.id` involucradas |
| `description` | string (opcional) | Texto libre del publicante |
| `status` | `"active" \| "closed"` | Estado de la publicación |
| `location` | object (opcional) | Ubicación del publicante para coordinar el intercambio |
| `location.country` | string (código ISO) | País (ej: `"MX"`, `"AR"`) |
| `location.state` | string (opcional) | Estado o provincia |
| `location.city` | string (opcional) | Ciudad o barrio |
| `createdAt` | string (ISO) | Fecha de creación |
| `closedAt` | string (ISO, opcional) | Fecha en que se cerró |

---

## Relaciones

```
User (1) ──── (N) Collection
User (1) ──── (N) TradeList
User (1) ──── (N) MarketplaceListing
Card (1) ──── (N) Collection
Card (1) ──── (N) TradeList
Card (N) ──── (N) MarketplaceListing  [via cards[]]
```

---

## Implementación

### Fase 1: JSON Files

```
server/data/
├── cards.json              — Array de Card
├── collections.json        — Array de Collection
├── globalStats.json        — Array de GlobalStats
├── tradeLists.json         — Array de TradeList
└── marketplace.json        — Array de MarketplaceListing (nuevo)
```

### Fase 2: MongoDB/PostgreSQL

Ver `DATABASE_MIGRATION.md`

---

## Seguridad (RLS, constraints y anti‑SQLi)

Este proyecto usa Supabase y el SDK oficial (queries parametrizadas). Evitar SQL dinámico reduce riesgos de inyección. Aun así, la seguridad depende de **RLS** y **constraints** en base de datos.

### Políticas RLS recomendadas

#### profiles
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

CREATE POLICY "profiles_select_own"
ON profiles FOR SELECT
USING (id = auth.uid());

CREATE POLICY "profiles_update_own"
ON profiles FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_unique
ON profiles (username);
```

#### collections
```sql
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "collections_select_own"
ON collections FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "collections_write_own"
ON collections FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "collections_update_own"
ON collections FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "collections_delete_own"
ON collections FOR DELETE
USING (user_id = auth.uid());

CREATE UNIQUE INDEX IF NOT EXISTS collections_user_sticker_unique
ON collections (user_id, sticker_id);
```

#### marketplace_listings
```sql
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "marketplace_select_public"
ON marketplace_listings FOR SELECT
USING (true);

CREATE POLICY "marketplace_insert_owner"
ON marketplace_listings FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "marketplace_update_owner"
ON marketplace_listings FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "marketplace_delete_owner"
ON marketplace_listings FOR DELETE
USING (user_id = auth.uid());
```

### Constraints recomendadas

```sql
ALTER TABLE collections
  ADD CONSTRAINT collections_quantity_nonnegative CHECK (quantity >= 0);

ALTER TABLE marketplace_listings
  ADD CONSTRAINT marketplace_status_check CHECK (status IN ('active', 'closed')),
  ADD CONSTRAINT marketplace_type_check CHECK (type IN ('have', 'want', 'exchange'));
```

### Admin stats (RPC)

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE((SELECT is_admin FROM profiles WHERE id = auth.uid()), false);
$$;

CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  result := json_build_object(
    'total_users', (SELECT COUNT(*) FROM profiles),
    'new_users_24h', (SELECT COUNT(*) FROM profiles WHERE created_at >= NOW() - INTERVAL '24 hours'),
    'new_users_7d', (SELECT COUNT(*) FROM profiles WHERE created_at >= NOW() - INTERVAL '7 days'),
    'avg_have', (SELECT COALESCE(AVG(t.have),0)::int FROM (
      SELECT user_id, SUM(CASE WHEN quantity >= 1 THEN 1 ELSE 0 END) AS have
      FROM collections GROUP BY user_id
    ) t),
    'avg_duplicates', (SELECT COALESCE(AVG(t.dup),0)::int FROM (
      SELECT user_id, SUM(CASE WHEN quantity >= 2 THEN 1 ELSE 0 END) AS dup
      FROM collections GROUP BY user_id
    ) t),
    'users_with_collection', (SELECT COUNT(DISTINCT user_id) FROM collections),
    'market_active', (SELECT COUNT(*) FROM marketplace_listings WHERE status = 'active'),
    'market_total', (SELECT COUNT(*) FROM marketplace_listings)
  );
  RETURN result;
END;
$$;

REVOKE EXECUTE ON FUNCTION get_admin_stats() FROM public;
GRANT EXECUTE ON FUNCTION get_admin_stats() TO authenticated;
```

### Buenas prácticas anti‑SQLi
- Usar siempre el SDK de Supabase (sin SQL dinámico en strings).
- Validar longitudes y formatos de inputs en el frontend.
- Evitar exponer `userName` editable en `marketplace_listings` sin validación.
