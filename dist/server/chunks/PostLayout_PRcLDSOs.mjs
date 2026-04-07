import { c as createComponent, b as createAstro, m as maybeRenderHead, d as addAttribute, r as renderComponent, a as renderTemplate, f as renderHead, g as renderSlot, h as renderTransition, i as fade, s as slide } from './astro/server_DSHpjjKh.mjs';
import { L as Logo, $ as $$MainNav, a as $$ClientRouter, b as $$Footer } from './Footer_CEqqg47L.mjs';
/* empty css                            */

const $$Astro$1 = createAstro();
const $$PostHeader = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$PostHeader;
  const { bgImage, subtitle } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<header class="min-h-36 relative md:pb-36"> <div class="absolute inset-0 bg-center bg-cover bg-image"${addAttribute({ backgroundImage: `url(${bgImage})` }, "style")}></div> <div class="absolute inset-0 bg-black/60"></div> <div class="relative max-w-7xl mx-auto py-10 md:py-14 px-4 md:px-0"> <div class="flex flex-col md:flex-row md:justify-between"> <a href="/" class="mx-auto md:mx-0"> ${renderComponent($$result, "Logo", Logo, { "class": "w-32 md:w-72" })} </a> <div id="nav-menu" class="md:flex md:flex-row md:gap-3"> ${renderComponent($$result, "MainNav", $$MainNav, {})} </div> </div> <h1 class="text-2xl md:text-4xl font-black uppercase text-white text-center mt-8 md:mt-20 lg:mt-32 after:coffee-icon"> ${subtitle} </h1> </div> </header>`;
}, "C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/components/ui/PostHeader.astro", void 0);

const $$Astro = createAstro();
const $$PostLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PostLayout;
  const { title, subtitle, bgImage } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title} - Mevasa Comercializadora</title><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet">${renderComponent($$result, "ClientRouter", $$ClientRouter, {})}${renderHead()}</head> <body class="bg-coffee-100"> ${renderComponent($$result, "PostHeader", $$PostHeader, { "subtitle": subtitle, "bgImage": bgImage, "data-astro-transition-scope": renderTransition($$result, "c27rpouy", fade({ duration: ".5s" })) })} <main class="bg-white p-5 sm:p-8 md:p-10 max-w-7xl mx-auto lg:-mt-20 relative"> <div${addAttribute(renderTransition($$result, "cw7q37ok", slide({ duration: "1s" })), "data-astro-transition-scope")}> ${renderSlot($$result, $$slots["default"])} </div> </main> ${renderSlot($$result, $$slots["after-main-content"])} ${renderComponent($$result, "Footer", $$Footer, {})} </body></html>`;
}, "C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/layouts/PostLayout.astro", "self");

export { $$PostLayout as $ };
