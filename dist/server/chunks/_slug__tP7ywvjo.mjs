import { c as createComponent, $ as $$Picture } from './_astro_assets_Bg1wNTbr.mjs';
import 'piccolore';
import { m as maybeRenderHead, f as renderTemplate, h as addAttribute, j as renderComponent, u as unescapeHTML } from './server_DdZqx79G.mjs';
import { a as DirectusArticlesResponseSchema, $ as $$PostLayout } from './index_D1W6wNu2.mjs';
import 'clsx';
import { f as formatDate } from './index_DBtM_ae6.mjs';

const $$PostMeta = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$PostMeta;
  const { date } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<p class="text-sm">
Escrito el: <span class="text-coffee-600">${formatDate(date)}</span> </p>`;
}, "/home/gustavovazco/Documentos/GitHub/mevasa-astro-template/src/components/documentacion/PostMeta.astro", void 0);

const $$PostCategories = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$PostCategories;
  const { name, slug } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(`/documentacion/categoria/${slug}`, "href")} class="inline-block py-1 px-5 bg-coffee-600 hover:bg-coffee-500 text-sm text-white mr-2 rounded"> ${name} </a>`;
}, "/home/gustavovazco/Documentos/GitHub/mevasa-astro-template/src/components/documentacion/PostCategories.astro", void 0);

const $$PostTags = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$PostTags;
  const { name, slug } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(`/documentacion/etiqueta/${slug}`, "href")} class="inline-block py-1 px-5 bg-coffee-600 hover:bg-coffee-500 text-sm text-white mr-2 rounded"> ${name} </a>`;
}, "/home/gustavovazco/Documentos/GitHub/mevasa-astro-template/src/components/documentacion/PostTags.astro", void 0);

const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const newsRes = await fetch(
    `${"https://api-mevasa.mevasa-comercializadora.com/items"}/articles?filter[slug][_eq]=${slug}&fields=*,category.*,tags.*,author.*`
  );
  const newJson = await newsRes.json();
  const newPost = DirectusArticlesResponseSchema.safeParse(newJson);
  if (!newPost.success) return Astro2.redirect("/404");
  const { data: post } = newPost.data;
  return renderTemplate`${renderComponent($$result, "PostLayout", $$PostLayout, { "title": post[0]?.title, "bgImage": `${"https://api-mevasa.mevasa-comercializadora.com/assets/"}/${post[0]?.cover_image}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<article class="space-y-5 max-w-4xl mx-auto"> ${renderComponent($$result2, "PostMeta", $$PostMeta, { "date": post[0]?.date_created })} ${renderComponent($$result2, "PostCategories", $$PostCategories, { "name": post[0]?.category?.name, "slug": post[0]?.category?.slug })} ${renderComponent($$result2, "PostTags", $$PostTags, { "name": post[0]?.tags?.name, "slug": post[0]?.tags?.slug })} <!-- <h3>{post[0]?.location}</h3> --> ${post[0]?.video_enabled ? renderTemplate`<div class="aspect-video">${unescapeHTML(post[0]?.cover_video)}</div>` : post[0]?.cover_image && renderTemplate`${renderComponent($$result2, "Picture", $$Picture, { "src": `${"https://api-mevasa.mevasa-comercializadora.com/assets/"}/${post[0]?.cover_image}`, "alt": post[0]?.title, "width": 600, "height": 600, "formats": ["avif", "webp"], "class": "w-full" })}`} <div class="text-lg space-y-3 mt-5">${unescapeHTML(post[0]?.content)}</div> </article> ` })}`;
}, "/home/gustavovazco/Documentos/GitHub/mevasa-astro-template/src/pages/documentacion/[slug].astro", void 0);
const $$file = "/home/gustavovazco/Documentos/GitHub/mevasa-astro-template/src/pages/documentacion/[slug].astro";
const $$url = "/documentacion/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
