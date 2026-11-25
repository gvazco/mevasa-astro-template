import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { C as addAttribute, T as unescapeHTML, _ as maybeRenderHead, g as renderTemplate, u as renderComponent } from "./console_Wxr6KIb-.mjs";
import { f as createAstro, i as $$Picture, p as createComponent } from "./_astro_assets_9YdPwNjf.mjs";
import { r as $$PostLayout, t as DirectusArticlesResponseSchema } from "./types_DYV8Bb9Z.mjs";
import { t as formatDate } from "./helpers_ByppY79C.mjs";
// src/components/documentacion/PostMeta.astro
createAstro("https://astro.build");
var $$PostMeta = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PostMeta;
	const { date } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<p class="text-sm">Escrito el: <span class="text-coffee-600">${formatDate(date)}</span></p>`;
}, "/home/gustavovazco/Documentos/GitHub/mevasa-astro-template/src/components/documentacion/PostMeta.astro", void 0);
// src/components/documentacion/PostCategories.astro
createAstro("https://astro.build");
var $$PostCategories = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PostCategories;
	const { name, slug } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(`/documentacion/categoria/${slug}`, "href")} class="inline-block py-1 px-5 bg-coffee-600 hover:bg-coffee-500 text-sm text-white mr-2 rounded">${name}</a>`;
}, "/home/gustavovazco/Documentos/GitHub/mevasa-astro-template/src/components/documentacion/PostCategories.astro", void 0);
// src/components/documentacion/PostTags.astro
createAstro("https://astro.build");
var $$PostTags = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PostTags;
	const { name, slug } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(`/documentacion/etiqueta/${slug}`, "href")} class="inline-block py-1 px-5 bg-coffee-600 hover:bg-coffee-500 text-sm text-white mr-2 rounded">${name}</a>`;
}, "/home/gustavovazco/Documentos/GitHub/mevasa-astro-template/src/components/documentacion/PostTags.astro", void 0);
// src/pages/documentacion/[slug].astro
var _slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Slug,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Slug = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Slug;
	const { slug } = Astro.params;
	const newJson = await (await fetch(`https://api-mevasa.mevasa-comercializadora.com/items/articles?filter[slug][_eq]=${slug}&fields=*,category.*,tags.*,author.*`)).json();
	const newPost = DirectusArticlesResponseSchema.safeParse(newJson);
	if (!newPost.success) return Astro.redirect("/404");
	const { data: post } = newPost.data;
	return renderTemplate`${renderComponent($$result, "PostLayout", $$PostLayout, {
		"title": post[0]?.title,
		"bgImage": `https://api-mevasa.mevasa-comercializadora.com/assets//${post[0]?.cover_image}`
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<article class="space-y-5 max-w-4xl mx-auto">${renderComponent($$result, "PostMeta", $$PostMeta, { "date": post[0]?.date_created })}${renderComponent($$result, "PostCategories", $$PostCategories, {
		"name": post[0]?.category?.name,
		"slug": post[0]?.category?.slug
	})}${renderComponent($$result, "PostTags", $$PostTags, {
		"name": post[0]?.tags?.name,
		"slug": post[0]?.tags?.slug
	})}<!-- <h3>{post[0]?.location}</h3> -->${post[0]?.video_enabled ? renderTemplate`<div class="aspect-video">${unescapeHTML(post[0]?.cover_video)}</div>` : post[0]?.cover_image && renderTemplate`${renderComponent($$result, "Picture", $$Picture, {
		"src": `https://api-mevasa.mevasa-comercializadora.com/assets//${post[0]?.cover_image}`,
		"alt": post[0]?.title,
		"width": 600,
		"height": 600,
		"formats": ["avif", "webp"],
		"class": "w-full"
	})}`}<div class="text-lg space-y-3 mt-5">${unescapeHTML(post[0]?.content)}</div></article>` })}`;
}, "/home/gustavovazco/Documentos/GitHub/mevasa-astro-template/src/pages/documentacion/[slug].astro", void 0);
var $$file = "/home/gustavovazco/Documentos/GitHub/mevasa-astro-template/src/pages/documentacion/[slug].astro";
var $$url = "/documentacion/[slug]";
// \0virtual:astro:page:src/pages/documentacion/[slug]@_@astro
var page = () => _slug__exports;
export { page };
