import { c as createComponent, $ as $$Picture } from './_astro_assets_65LpmLq1.mjs';
import 'piccolore';
import { m as maybeRenderHead, f as renderTemplate, h as addAttribute, j as renderComponent, u as unescapeHTML } from './server_BM8pLRoH.mjs';
import { a as PostSchema, $ as $$PostLayout } from './index_Czp6d-4i.mjs';
import 'clsx';
import { f as formatDate } from './index_By2z1dI5.mjs';

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

const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const res = await fetch(`${"https://api-mevasa.mevasa-comercializadora.com/wp-json/wp/v2"}/posts?slug=${slug}`);
  const json = await res.json();
  const post = PostSchema.safeParse(json[0]);
  if (!post.success) return Astro2.redirect("/404");
  const { title, featured_images, date, content, category_details, acf } = post.data;
  return renderTemplate`${renderComponent($$result, "PostLayout", $$PostLayout, { "title": title.rendered, "bgImage": featured_images?.full?.url || "" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<article class="space-y-5 max-w-4xl mx-auto"> ${renderComponent($$result2, "PostMeta", $$PostMeta, { "date": date })} ${category_details.map((cat) => renderTemplate`${renderComponent($$result2, "PostCategories", $$PostCategories, { "name": cat.name, "slug": cat.slug })}`)} <h3>${acf.location}</h3> ${acf.video_url && acf.video_enabled ? renderTemplate`<div class="aspect-video"> <iframe${addAttribute(acf?.video_url, "src")}${addAttribute(title.rendered, "title")} allowfullscreen class="w-full h-full"></iframe> </div>` : featured_images?.full?.url && renderTemplate`${renderComponent($$result2, "Picture", $$Picture, { "src": featured_images.full.url, "alt": title.rendered, "width": featured_images?.full?.width || 600, "height": featured_images?.full?.height || 600, "formats": ["avif", "webp"], "class": "w-full" })}`} <div class="text-lg space-y-3 mt-5">${unescapeHTML(content.rendered)}</div> </article> ` })}`;
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
