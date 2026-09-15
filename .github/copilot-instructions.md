# GitHub Copilot Instructions

Este archivo explica cómo funciona el repositorio `mevasa-astro-template` para que Copilot no cometa errores comunes.

## Qué es este proyecto

Sitio web Astro 6 con SSR (server-side rendering) usando el adaptador Node.js standalone. **No es un sitio estático.** El contenido viene de un CMS headless pero el render de páginas es híbrido.

Comandos básicos:

```bash
npm run dev       # servidor de desarrollo en :4321
npm run build     # build de producción → dist/
npm run start     # node ./dist/server/entry.mjs (entrypoint de Docker)
npx astro check   # type-check
```

No hay scripts de `lint`, `test` ni `format`. Prettier está configurado en `.prettierrc` (semi, singleQuote, tabWidth 2).

## Arquitectura de datos

- **CMS: Directus** en `api-mevasa.mevasa-comercializadora.com`. Todo el contenido se obtiene con `fetch()` y se valida con **Zod** (esquemas en `src/types/index.ts`).
- **Formulario de contacto:** envía POST al endpoint REST de WordPress Contact Form 7 usando la variable `HOME_URL`.
- **Colecciones consultadas:** `/products`, `/products_categories`, `/articles`, `/articles_categories`, `/articles_tags`, `/pages`, `/about_gallery`.

## Render híbrido (importante)

- Las páginas de listado (`categoria/[slug]`, `etiqueta/[slug]`) se pre-renderizan con `getStaticPaths()` en build time.
- Las páginas de detalle (`catalogo/[slug].astro`, `documentacion/[slug].astro`) son SSR con `export const prerender = false`.
- Si la validación Zod falla en una página de detalle, se redirige a `/404`.
- Si agregas una página nueva con `getStaticPaths`, se pre-renderiza. Si usas dynamic routes sin esa función, es SSR.

## Variables de entorno (obligatorias)

No existe `.env.example`. Estas tres variables son necesarias — sin ellas la app falla:

| Variable | Propósito |
|---|---|
| `API_ITEMS` | URL base `/items` de Directus, p.ej. `https://api-mevasa.mevasa-comercializadora.com/items` |
| `PUBLIC_ASSETS` | Base de imágenes de Directus, p.ej. `https://api-mevasa.mevasa-comercializadora.com/assets/` |
| `HOME_URL` | Destino del POST del formulario de contacto |

Los archivos `.env.development` y `.env.production` están en `.gitignore`. Un clon nuevo debe recrearlos.

## Imágenes

- Se sirven desde la URL `PUBLIC_ASSETS` y se renderizan con el componente `<Picture>` de Astro en formatos `avif`/`webp`.
- `astro.config.mjs` tiene una lista blanca de dominios en `image.domains`: `coffeeshop.local` y el host de Directus. Si agregas un nuevo dominio de imágenes, agrégalo ahí.

## Style de código

- **Path alias:** `@/*` → `src/*`. Se usa en todos los imports.
- **Tailwind v4:** no hay `tailwind.config.*`. El tema es CSS-first en `src/styles/global.css` con bloques `@theme` y `@utility` para utilities custom (`bg-image`, `coffee-icon`, etc.).
- No uses `tailwind.config.js`, no existe.
- No hay componentes React en `src/` — `@astrojs/react` está declarado en `package.json` pero sin uso.

## Operación y despliegue

- Despliegue con Docker (ver `dockerfile`: `node:22-alpine`, `npm ci`, `npm run build`, `node ./dist/server/entry.mjs`) vía Coolify.
- No hay CI/CD workflows.
- `src/pages/api/` existe pero está vacío.

## Gotchas conocidos

- **Node 22+:** `.nvmrc` (`22.12.0`), `package.json` engines (`>=22.12.0`) y Docker (`node:22-alpine`) coinciden en Node 22.
- **Deps sin uso:** `gsap`, `@astrojs/react` están en `package.json` pero no se importan en `src/`.
- **Generados y gitignoreados:** `.astro/` y `dist/` no se versionan.