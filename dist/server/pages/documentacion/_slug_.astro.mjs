import { c as createComponent, b as createAstro, r as renderComponent, a as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from '../../chunks/astro/server_DSHpjjKh.mjs';
import { $ as $$PostLayout } from '../../chunks/PostLayout_PRcLDSOs.mjs';
import { $ as $$Picture } from '../../chunks/_astro_assets_BHrP1kQD.mjs';
import { f as PostSchema } from '../../chunks/index_DgQ9vC0h.mjs';
import { $ as $$PostMeta, a as $$PostCategories } from '../../chunks/PostCategories_C8UUCEEJ.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const res = await fetch(`${"https://api-mevasa.core-hub-plex.cloud/wp-json/wp/v2"}/posts?slug=${slug}`);
  const json = await res.json();
  const post = PostSchema.safeParse(json[0]);
  if (!post.success) return Astro2.redirect("/404");
  const { title, featured_images, date, content, category_details } = post.data;
  return renderTemplate`${renderComponent($$result, "PostLayout", $$PostLayout, { "title": title.rendered, "subtitle": title.rendered, "bgImage": featured_images?.full?.url || "" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<article class="space-y-5 max-w-4xl mx-auto"> ${renderComponent($$result2, "PostMeta", $$PostMeta, { "date": date })} ${category_details.map((cat) => renderTemplate`${renderComponent($$result2, "PostCategories", $$PostCategories, { "name": cat.name, "slug": cat.slug })}`)} ${renderComponent($$result2, "Picture", $$Picture, { "src": featured_images?.full?.url || "", "alt": title.rendered, "width": featured_images?.full?.width || 600, "height": featured_images?.full?.height || 600, "formats": ["avif", "webp"], "class": "w-full" })} <div class="text-lg space-y-3 mt-5">${unescapeHTML(content.rendered)}</div> </article> ` })}`;
}, "C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/pages/documentacion/[slug].astro", void 0);
const $$file = "C:/Users/Gustavo Vazco/source/repos/mevasa-astro-template/src/pages/documentacion/[slug].astro";
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
