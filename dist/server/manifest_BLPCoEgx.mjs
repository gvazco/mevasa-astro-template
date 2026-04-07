import { w as decodeKey } from './chunks/astro/server_DSHpjjKh.mjs';
import 'clsx';
import 'cookie';
import './chunks/astro-designed-error-pages_CHQwPytY.mjs';
import 'es-module-lexer';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_DykRhuW0.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/Gustavo%20Vazco/source/repos/mevasa-astro-template/","cacheDir":"file:///C:/Users/Gustavo%20Vazco/source/repos/mevasa-astro-template/node_modules/.astro/","outDir":"file:///C:/Users/Gustavo%20Vazco/source/repos/mevasa-astro-template/dist/","srcDir":"file:///C:/Users/Gustavo%20Vazco/source/repos/mevasa-astro-template/src/","publicDir":"file:///C:/Users/Gustavo%20Vazco/source/repos/mevasa-astro-template/public/","buildClientDir":"file:///C:/Users/Gustavo%20Vazco/source/repos/mevasa-astro-template/dist/client/","buildServerDir":"file:///C:/Users/Gustavo%20Vazco/source/repos/mevasa-astro-template/dist/server/","adapterName":"@astrojs/node","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"404.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"catalogo/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/catalogo","isIndex":false,"type":"page","pattern":"^\\/catalogo\\/?$","segments":[[{"content":"catalogo","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/catalogo.astro","pathname":"/catalogo","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"contacto/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contacto","isIndex":false,"type":"page","pattern":"^\\/contacto\\/?$","segments":[[{"content":"contacto","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contacto.astro","pathname":"/contacto","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"documentacion/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/documentacion","isIndex":false,"type":"page","pattern":"^\\/documentacion\\/?$","segments":[[{"content":"documentacion","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/documentacion.astro","pathname":"/documentacion","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"galeria/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/galeria","isIndex":false,"type":"page","pattern":"^\\/galeria\\/?$","segments":[[{"content":"galeria","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/galeria.astro","pathname":"/galeria","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"nosotros/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/nosotros","isIndex":false,"type":"page","pattern":"^\\/nosotros\\/?$","segments":[[{"content":"nosotros","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/nosotros.astro","pathname":"/nosotros","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"proceso/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/proceso","isIndex":false,"type":"page","pattern":"^\\/proceso\\/?$","segments":[[{"content":"proceso","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/proceso.astro","pathname":"/proceso","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/node.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_actions/[...path]","pattern":"^\\/_actions(?:\\/(.*?))?\\/?$","segments":[[{"content":"_actions","dynamic":false,"spread":false}],[{"content":"...path","dynamic":true,"spread":true}]],"params":["...path"],"component":"node_modules/astro/dist/actions/runtime/route.js","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/contacto.BcGrhNyv.css"}],"routeData":{"route":"/catalogo/[slug]","isIndex":false,"type":"page","pattern":"^\\/catalogo\\/([^/]+?)\\/?$","segments":[[{"content":"catalogo","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/catalogo/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/contacto.BcGrhNyv.css"}],"routeData":{"route":"/documentacion/[slug]","isIndex":false,"type":"page","pattern":"^\\/documentacion\\/([^/]+?)\\/?$","segments":[[{"content":"documentacion","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/documentacion/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/pages/catalogo.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/pages/catalogo/[slug].astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/pages/catalogo/categoria/[slug].astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/pages/documentacion.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/pages/documentacion/[slug].astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/layouts/PostLayout.astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/catalogo@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/catalogo/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/catalogo/categoria/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/documentacion@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/documentacion/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/pages/404.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/pages/contacto.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/pages/documentacion/categoria/[slug].astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/pages/galeria.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/pages/nosotros.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/pages/proceso.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/layouts/Layout.astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/404@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/contacto@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/documentacion/categoria/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/galeria@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/nosotros@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/proceso@_@astro",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/entrypoint":"entrypoint.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/node@_@js":"pages/_image.astro.mjs","\u0000@astro-page:node_modules/astro/dist/actions/runtime/route@_@js":"pages/_actions/_---path_.astro.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/catalogo/categoria/[slug]@_@astro":"pages/catalogo/categoria/_slug_.astro.mjs","\u0000@astro-page:src/pages/catalogo/[slug]@_@astro":"pages/catalogo/_slug_.astro.mjs","\u0000@astro-page:src/pages/catalogo@_@astro":"pages/catalogo.astro.mjs","\u0000@astro-page:src/pages/contacto@_@astro":"pages/contacto.astro.mjs","\u0000@astro-page:src/pages/documentacion/categoria/[slug]@_@astro":"pages/documentacion/categoria/_slug_.astro.mjs","\u0000@astro-page:src/pages/documentacion/[slug]@_@astro":"pages/documentacion/_slug_.astro.mjs","\u0000@astro-page:src/pages/documentacion@_@astro":"pages/documentacion.astro.mjs","\u0000@astro-page:src/pages/galeria@_@astro":"pages/galeria.astro.mjs","\u0000@astro-page:src/pages/nosotros@_@astro":"pages/nosotros.astro.mjs","\u0000@astro-page:src/pages/proceso@_@astro":"pages/proceso.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BLPCoEgx.mjs","C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/node_modules/unstorage/drivers/fs-lite.mjs":"chunks/fs-lite_COtHaKzy.mjs","C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_CeQ_bGFx.mjs","@astrojs/react/client.js":"_astro/client.oy8U-Y-W.js","C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/components/gallery/GalleryGrid.astro?astro&type=script&index=0&lang.ts":"_astro/GalleryGrid.astro_astro_type_script_index_0_lang.DCVBTAhd.js","C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/components/contact/LocationMap.astro?astro&type=script&index=0&lang.ts":"_astro/LocationMap.astro_astro_type_script_index_0_lang.DHXtLyCm.js","C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/components/contact/ContactForm.astro?astro&type=script&index=0&lang.ts":"_astro/ContactForm.astro_astro_type_script_index_0_lang.CEd63AKA.js","C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts":"_astro/ClientRouter.astro_astro_type_script_index_0_lang.COPH5o9P.js","C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/node_modules/photoswipe/dist/photoswipe.esm.js":"_astro/photoswipe.esm.CKV1Bsxh.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/bg_404.CD52rWbJ.jpg","/_astro/bg_home.BVb4l72j.jpg","/_astro/aislantes.Be2C_soW.webp","/_astro/fijacion.DUgoHqaz.webp","/_astro/lamina-estructural.CnxfAFlo.webp","/_astro/herramientas-de-mano.DdExEj4E.webp","/_astro/lamina-lisa.Cx6vaBhG.webp","/_astro/translucidos.B8LRHEqL.webp","/_astro/lamina-ondulada.DKWIbIAw.webp","/_astro/panel-aislante.DF8wQf2U.webp","/_astro/pintura.CuxDvaCR.webp","/_astro/accesorios-lamina.BbEGpfCx.webp","/_astro/selladores.XV6eSike.webp","/_astro/logo.BMyL0tUR.svg","/_astro/casco.BomHAPPE.png","/_astro/contacto.BcGrhNyv.css","/favicon.svg","/icon_coffee.svg","/icon_dessert.svg","/icon_tea.svg","/_astro/client.B9YBqyHK.js","/_astro/client.oy8U-Y-W.js","/_astro/ClientRouter.astro_astro_type_script_index_0_lang.COPH5o9P.js","/_astro/ContactForm.astro_astro_type_script_index_0_lang.CEd63AKA.js","/_astro/ContactForm.KOmfmGu7.css","/_astro/GalleryGrid.astro_astro_type_script_index_0_lang.DCVBTAhd.js","/_astro/GalleryGrid.cPPnkASS.css","/_astro/LocationMap.astro_astro_type_script_index_0_lang.DHXtLyCm.js","/_astro/LocationMap.CIGW-MKW.css","/_astro/photoswipe.esm.CKV1Bsxh.js","/404.html","/catalogo/index.html","/contacto/index.html","/documentacion/index.html","/galeria/index.html","/nosotros/index.html","/proceso/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"qERPWJo7c+EFonqPDMeQEfvvYSO1xNHzN9qg2T/p/Hk=","sessionConfig":{"driver":"fs-lite","options":{"base":"C:\\Users\\Gustavo Vazco\\source\\repos\\mevasa-astro-template\\node_modules\\.astro\\sessions"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/fs-lite_COtHaKzy.mjs');

export { manifest };
