import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                                DIRECTUS CMS                                */
/* -------------------------------------------------------------------------- */

/* ------------------------------- BASE_SCHEMA ------------------------------ */
export const DirectusBaseSchema = z.object({
  id: z.number(),
  title: z.string(), 
  subtitle: z.string().optional(),
  slug: z.string(),
  content: z.string().nullable().optional(),
  cover_image: z.string(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

/* ----------------------------- CATEGORY SCHEMA ---------------------------- */
export const DirectusCategorySchema = z.object({
  id: z.number(),
  status: z.string(),
  name: z.string(),
  cover_image: z.string().nullable().optional(),
  slug: z.string(),
  description: z.string().nullable(),
});

export const DirectusCategoriesSlugSchema = z.array(
  DirectusCategorySchema.pick({
    slug: true,
  }),
);

export const DirectusCategoriesSchema = z.array(DirectusCategorySchema);

export const DirectusCategoriesResponseSchema = z.object({
  data: DirectusCategoriesSchema,
});
/* -------------------------------------------------------------------------- */

/* ----------------------------- AUTHORS SCHEMA ----------------------------- */
export const DirectusAuthorSchema = z.object({
  id: z.number(),
  status: z.string(),
  name: z.string(),
  email: z.string(),
  bio: z.string(),
  avatar: z.string().nullable().optional(),
  social_links: z.object({
    facebook: z.string(),
    instagram: z.string(),
  }),
  slug: z.string(),
}); 

export const DirectusAuthorsSlugSchema = z.array(
  DirectusAuthorSchema.pick({
    slug: true,
  }),
);

export const DirectusAuthorsSchema = z.array(DirectusAuthorSchema);
/* -------------------------------------------------------------------------- */

/* ------------------------- DirectusPageIndexSchema ------------------------ */

export const DirectusPageIndexSchema = DirectusBaseSchema.extend({
  left_title: z.string().nullable().optional(),
  center_title: z.string().nullable().optional(),
  right_title: z.string().nullable().optional(),
  left_slug: z.string().nullable().optional(),
  center_slug: z.string().nullable().optional(),
  right_slug: z.string().nullable().optional(),
  left_category: DirectusCategorySchema,
  center_category: DirectusCategorySchema,
  right_category: DirectusCategorySchema,
  left_image: z.string().nullable().optional(),
  center_image: z.string().nullable().optional(),
  right_image: z.string().nullable().optional(),
});

export const DirectusPageIndexArraySchema = z.array(DirectusPageIndexSchema);

export const DirectusPageIndexResponseSchema = z.object({
  data: DirectusPageIndexArraySchema,
});

export const DirectusPageArraySchema = z.array(DirectusBaseSchema);

export const DirectusPageResponseSchema = z.object({
  data: DirectusPageArraySchema,
});
/* -------------------------------------------------------------------------- */

/* ------------------------ DIRECTUS ARTICLES SCHEMA ------------------------ */

export const DirectusArticlesSchema = DirectusBaseSchema.omit({
  id: true,
  subtitle: true,
}).extend({
  date_created: z.string().datetime(),
  excerpt: z.string().nullable().optional(),
  category: DirectusCategorySchema,
  tags: DirectusCategorySchema,
  author: DirectusAuthorSchema,
  video_enabled: z.boolean().optional(),
  cover_video: z.string().nullable().optional(),
});

export const DirectusArticlesArraySchema = z.array(DirectusArticlesSchema);

export const DirectusArticlesResponseSchema = z.object({
  data: DirectusArticlesArraySchema,
});

export const DirectusArticlesCategoryArraySchema = z.array(DirectusCategorySchema);

export const DirectusArticlesCategoryResponseSchema = z.object({
  data: DirectusArticlesCategoryArraySchema,
});

/* ------------------------ DIRECTUS PRODUCTS SCHEMA ------------------------ */
export const DirectusProductsSchema = DirectusBaseSchema.omit({
  id: true,
  content: true,
  subtitle: true,
}).extend({
  date_created: z.string().datetime(),
  date_updated: z.string().datetime().nullable().optional(),
  excerpt: z.string().nullable().optional(),
  product_category: DirectusCategorySchema,
  navigation_options: z.boolean().optional(),
  button_label: z.string().nullable().optional(),
  button_navigation: z.string().nullable().optional(),
  brand: z.string().nullable().optional(),
  long: z.string().nullable().optional(),
  width: z.string().nullable().optional(),
  thickness: z.string().nullable().optional(),
  caliber: z.string().nullable().optional(),
  shipment: z.string().nullable().optional(),
  gallery_options: z.boolean().optional(),
  product_gallery: z.array(z.object({
    id: z.number(),
    products_id: z.number(),
    directus_files_id: z.string(),
  })).optional(),
});

export const DirectusProductsArraySchema = z.array(DirectusProductsSchema);

export const DirectusProductsResponseSchema = z.object({
  data: DirectusProductsArraySchema,
});

/* -------------------------------------------------------------------------- */

/* ------------------------ DIRECTUS CONTACT SCHEMA ------------------------ */
const DirectusMarkerSchema = z.object({
  label: z.string(),
  default_label: z.string(),
  lat: z.number(),
  lng: z.number(),
});

const DirectusLocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  zoom: z.number(),
  markers: z.array(DirectusMarkerSchema),
});

export const DirectusContactPageSchema = DirectusBaseSchema.extend({
  location: z.object({
    location: DirectusLocationSchema,
  }).nullable().optional(),
});

export const DirectusContactPageArraySchema = z.array(DirectusContactPageSchema);

export const DirectusContactPageResponseSchema = z.object({
  data: DirectusContactPageArraySchema,
});

/* -------------------------------------------------------------------------- */


export const DirectusPageGalleryItemSchema = z.object({
  id: z.number(),
  about_gallery_id: z.number(),
  directus_files_id: z.string(),
});

export const DirectusPageGallerySchema = z.object({
  about_gallery: z.array(DirectusPageGalleryItemSchema),
});

export const DirectusPageGalleryResponseSchema = z.object({
  data: DirectusPageGallerySchema,
});


/* -------------------------------------------------------------------------- */

export type Post = z.infer<typeof DirectusArticlesSchema>;
export type Product = z.infer<typeof DirectusProductsSchema>;
export type Gallery = z.infer<typeof DirectusPageGalleryItemSchema>;
export type Location = z.infer<typeof DirectusLocationSchema>;
export type DirectusPageGalleryItem = z.infer<typeof DirectusPageGalleryItemSchema>;
export type DirectusPageGallery = z.infer<typeof DirectusPageGallerySchema>;
export type DirectusPageGalleryResponse = z.infer<typeof DirectusPageGalleryResponseSchema>;
