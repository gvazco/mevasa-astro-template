# MEVASA Astro Template

Sitio web corporativo de **MeVasa Comercializadora** construido con **Astro 6 (SSR)**, contenido gestionado por **Directus (headless CMS)** y formulario de contacto vía **WordPress Contact Form 7**.

## Características

- **SSR con Node standalone** — páginas de detalle renderizadas por servidor (`prerender = false`), listados de categoría/etiqueta pre-renderizados con `getStaticPaths()`.
- **CMS Directus** — productos, artículos, categorías, etiquetas y galería obtenidos con `fetch()` y validados con **Zod** (`src/types/index.ts`). Falla de validación → redirección a `/404`.
- **Imágenes optimizadas** — servidas desde Directus y renderizadas con `<Picture>` en `avif`/`webp`.
- **Tailwind CSS v4** — tema CSS-first en `src/styles/global.css` (bloques `@theme` y `@utility`, sin `tailwind.config.*`).
- **Interacciones** — PhotoSwipe (galerías), Leaflet (mapa de ubicación), AOS (animaciones), Notyf (notificaciones del formulario).

## Requisitos

- **Node.js 22+** (ver `.nvmrc`: `22.12.0`)

## Instalación

```bash
npm install
```

### Variables de entorno

No existe `.env.example` — el proyecto **falla sin estas tres variables**. Crea `.env.development` y/o `.env.production`:

| Variable | Propósito |
|---|---|
| `API_ITEMS` | URL base `/items` de Directus, p.ej. `https://api-mevasa.mevasa-comercializadora.com/items` |
| `PUBLIC_ASSETS` | Base de imágenes de Directus, p.ej. `https://api-mevasa.mevasa-comercializadora.com/assets/` |
| `HOME_URL` | Destino del POST del formulario de contacto (endpoint Contact Form 7) |

Ejemplo para desarrollo:

```bash
API_ITEMS=https://api-mevasa.mevasa-comercializadora.com/items
PUBLIC_ASSETS=https://api-mevasa.mevasa-comercializadora.com/assets/
HOME_URL=http://comercializadora-mevasa.local
```

Ambos archivos `.env.*` están en `.gitignore`: recrearlos después de cada clon.

## Comandos

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Build de producción → `dist/` |
| `npm run preview` | Previsualiza el build localmente |
| `npm run start` | Arranca el servidor standalone (`node ./dist/server/entry.mjs`) |
| `npx astro check` | Type-check |
| `npx astro sync` | Regenera `.astro/types.d.ts` tras cambios en esquemas |

No hay scripts de `lint`, `test` ni `format`.

## Estructura

```
src/
├── actions/            # Astro Actions: contacto → WP Contact Form 7
├── assets/             # Imágenes locales estáticas
├── components/         # contact/, documentacion/, gallery/, products/, ui/
├── helpers/            # formateo de fechas/moneda, metadatos de categorías
├── layouts/            # Layout.astro y PostLayout.astro
├── pages/              # Home, catálogo, documentación, nosotros, contacto, 404
├── styles/global.css   # Tema Tailwind v4
└── types/index.ts      # Esquemas Zod de todos los endpoints de Directus
```

## Rutas

| Ruta | Tipo |
|---|---|
| `/` | Home (SSR) |
| `/catalogo` | Índice de productos |
| `/catalogo/[slug]` | Detalle de producto (SSR) |
| `/catalogo/categoria/[slug]` | Listado por categoría (pre-renderizado) |
| `/documentacion` | Índice de artículos |
| `/documentacion/[slug]` | Detalle de artículo (SSR) |
| `/documentacion/categoria/[slug]` | Listado por categoría (pre-renderizado) |
| `/documentacion/etiqueta/[slug]` | Listado por etiqueta (pre-renderizado) |
| `/nosotros` | Sobre nosotros |
| `/contacto` | Formulario + mapa de ubicación |
| `/404` | Página no encontrada |

## Despliegue

Docker vía `dockerfile` (imagen final `node:22-alpine`, usuario no-root, healthcheck). Desplegado en **Coolify**, que pasa las variables de entorno como build args. No hay CI/CD.

```bash
# Build de las imágenes localmente, si hace falta
docker build --build-arg API_ITEMS=... --build-arg PUBLIC_ASSETS=... --build-arg HOME_URL=... .
```

## Notas para agentes de IA

Consulta [AGENTS.md](./AGENTS.md) para contexto técnico orientado a desarrollo y [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) para instrucciones de Copilot.