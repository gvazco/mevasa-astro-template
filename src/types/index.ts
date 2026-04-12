import { z } from "zod";

const imageSchema = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number(),
});

const featureImagesSchema = z.object({
  medium: imageSchema,
  medium_large: imageSchema,
  large: imageSchema,
  full: imageSchema,
});

export const BaseWPSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({
    rendered: z.string(),
  }),
  content: z.object({
    rendered: z.string(),
  }),
  featured_images: featureImagesSchema.optional(),
  acf: z.object({
    subtitle: z.string().optional(),
  }),
});

const gallerySchema = z.object({
  large: imageSchema,
  full: imageSchema,
});

export const GalleryPageSchema = BaseWPSchema.extend({
  gallery: z.array(gallerySchema),
});

const processSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
});

export const ProcessPageSchema = BaseWPSchema.extend({
  acf: z
    .object({
      subtitle: z.string(),
    })
    .catchall(processSchema),
});

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export const CategoriesSlugSchema = z.array(
  CategorySchema.pick({
    slug: true,
  }),
);

export const CategoriesSchema = z.array(CategorySchema);

export const PostSchema = BaseWPSchema.extend({
  acf: z.object({
    video_url: z.string(),
    video_enabled: z.boolean(),
    location: z.string()
  }),
  date: z.string(),
  category_details: CategoriesSchema,
});

export const PostsSchema = z.array(PostSchema);

export const ProductSchema = BaseWPSchema.omit({
  content: true,
}).extend({
  date: z.string(),
  category_details: CategoriesSchema,
  acf: z.object({
    brand: z.string(),
    summary: z.string(),
    description: z.string(),
    long: z.string(),
    width: z.string(),
    thickness: z.string(),
    caliber: z.string(),
    shipment: z.string(),
    button_label: z.string(),
    navigation: z.string(),
    price: z.coerce.number(),
  }),
});

export const ProductsSchema = z.array(ProductSchema);

const MenuItemSchema = BaseWPSchema.pick({
  title: true,
  slug: true,
  featured_images: true,
}).extend({
  link: z.string(),
  acf: z.object({
    description: z.string(),
    price: z.coerce.number(),
  }),
});

export const MenuItemsSchema = z.array(MenuItemSchema);

const MarkerSchema = z.object({
  label: z.string(),
  lat: z.number(),
  lng: z.number(),
});

const LocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  zoom: z.number(),
  markers: z.array(MarkerSchema),
});

export const ContactPageSchema = BaseWPSchema.extend({
  acf: z
    .object({
      subtitle: z.string(),
    })
    .catchall(LocationSchema),
});

const ProductCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  count: z.number(),
});

export const ProductCategoriesSchema = z.array(ProductCategorySchema);

export type Post = z.infer<typeof PostSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type Gallery = z.infer<typeof gallerySchema>;
export type FeatureImages = z.infer<typeof featureImagesSchema>;
export type Location = z.infer<typeof LocationSchema>;
