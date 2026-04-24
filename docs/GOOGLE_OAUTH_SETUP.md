# Google OAuth Setup (Supabase)

Guia para habilitar inicio de sesion con Google en Stickio.

## 1) Crear credenciales OAuth en Google Cloud

1. Entra a Google Cloud Console.
2. Crea o selecciona un proyecto.
3. Ve a `APIs & Services` -> `OAuth consent screen`.
4. Configura la pantalla de consentimiento (External o Internal).
5. Agrega scopes basicos (`email`, `profile`, `openid`).
6. Ve a `Credentials` -> `Create Credentials` -> `OAuth client ID`.
7. Tipo: `Web application`.
8. Agrega `Authorized redirect URIs`:
   - `https://<SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`

Guarda `Client ID` y `Client Secret`.

## 2) Configurar Google provider en Supabase

1. En Supabase: `Authentication` -> `Providers` -> `Google`.
2. Activar provider.
3. Pegar `Client ID` y `Client Secret` de Google Cloud.
4. Guardar cambios.

## 3) Configurar URLs permitidas en Supabase Auth

En `Authentication` -> `URL Configuration`:

- `Site URL`:
  - Local: `http://localhost:5173` (o el puerto usado)
  - Prod: `https://tu-dominio.com`

- `Redirect URLs` (agrega todas):
  - `http://localhost:5173`
  - `http://localhost:3000`
  - `https://tu-dominio.com`

## 4) Rehabilitar boton en frontend

Llamada recomendada:

```js
await window.supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: window.location.origin,
  },
});
```

## 5) Verificar flujo completo

Checklist:

1. Click en "Continuar con Google".
2. Redireccion a Google y regreso al dominio.
3. Sesion creada en Supabase (`auth.users`).
4. Perfil en `profiles` creado/actualizado correctamente.
5. UI refleja usuario autenticado (desktop y mobile).

## 6) Errores comunes

- `redirect_uri_mismatch`
  - La URI de callback no coincide entre Google y Supabase.
- Login vuelve al inicio sin sesion
  - Falta `Site URL` o `Redirect URL` correcta en Supabase.
- Usuario OAuth sin `username`
  - Implementar fallback seguro post-login en sincronizacion de perfil.

## Nota de producto actual

Google login esta oculto temporalmente en UI hasta completar esta configuracion en ambiente productivo.
