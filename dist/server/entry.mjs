import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CPDDAyc2.mjs';
import { manifest } from './manifest_BtEEEnpJ.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/_actions/_---path_.astro.mjs');
const _page2 = () => import('./pages/404.astro.mjs');
const _page3 = () => import('./pages/catalogo/categoria/_slug_.astro.mjs');
const _page4 = () => import('./pages/catalogo/_slug_.astro.mjs');
const _page5 = () => import('./pages/catalogo.astro.mjs');
const _page6 = () => import('./pages/contacto.astro.mjs');
const _page7 = () => import('./pages/documentacion/categoria/_slug_.astro.mjs');
const _page8 = () => import('./pages/documentacion/_slug_.astro.mjs');
const _page9 = () => import('./pages/documentacion.astro.mjs');
const _page10 = () => import('./pages/galeria.astro.mjs');
const _page11 = () => import('./pages/nosotros.astro.mjs');
const _page12 = () => import('./pages/proceso.astro.mjs');
const _page13 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["node_modules/astro/dist/actions/runtime/route.js", _page1],
    ["src/pages/404.astro", _page2],
    ["src/pages/catalogo/categoria/[slug].astro", _page3],
    ["src/pages/catalogo/[slug].astro", _page4],
    ["src/pages/catalogo.astro", _page5],
    ["src/pages/contacto.astro", _page6],
    ["src/pages/documentacion/categoria/[slug].astro", _page7],
    ["src/pages/documentacion/[slug].astro", _page8],
    ["src/pages/documentacion.astro", _page9],
    ["src/pages/galeria.astro", _page10],
    ["src/pages/nosotros.astro", _page11],
    ["src/pages/proceso.astro", _page12],
    ["src/pages/index.astro", _page13]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "host": false,
    "port": 4321,
    "client": "file:///C:/Users/Gustavo%20Vazco/source/repos/mevasa-astro-template/dist/client/",
    "server": "file:///C:/Users/Gustavo%20Vazco/source/repos/mevasa-astro-template/dist/server/",
    "assets": "_astro",
    "experimentalStaticHeaders": false
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
