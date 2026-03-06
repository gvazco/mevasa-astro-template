import { z } from 'zod';

const imageSchema = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number()
});
const featureImagesSchema = z.object({
  medium: imageSchema,
  medium_large: imageSchema,
  large: imageSchema,
  full: imageSchema
});
const BaseWPSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({
    rendered: z.string()
  }),
  content: z.object({
    rendered: z.string()
  }),
  featured_images: featureImagesSchema,
  acf: z.object({
    subtitle: z.string()
  })
});
const gallerySchema = z.object({
  large: imageSchema,
  full: imageSchema
});
const GalleryPageSchema = BaseWPSchema.extend({
  gallery: z.array(gallerySchema)
});
const processSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string()
});
const ProcessPageSchema = BaseWPSchema.extend({
  acf: z.object({
    subtitle: z.string()
  }).catchall(processSchema)
});
const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string()
});
const CategoriesSlugSchema = z.array(
  CategorySchema.pick({
    slug: true
  })
);
const CategoriesSchema = z.array(CategorySchema);
const PostSchema = BaseWPSchema.omit({
  acf: true
}).extend({
  date: z.string(),
  category_details: CategoriesSchema
});
const PostsSchema = z.array(PostSchema);
const MenuItemSchema = BaseWPSchema.pick({
  title: true,
  featured_images: true
}).extend({
  acf: z.object({
    description: z.string(),
    price: z.coerce.number()
  })
});
const MenuItemsSchema = z.array(MenuItemSchema);
const MarkerSchema = z.object({
  label: z.string(),
  lat: z.number(),
  lng: z.number()
});
const LocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  zoom: z.number(),
  markers: z.array(MarkerSchema)
});
const ContactPageSchema = BaseWPSchema.extend({
  acf: z.object({
    subtitle: z.string()
  }).catchall(LocationSchema)
});

export { BaseWPSchema as B, CategorySchema as C, GalleryPageSchema as G, MenuItemsSchema as M, PostsSchema as P, CategoriesSlugSchema as a, PostSchema as b, ContactPageSchema as c, ProcessPageSchema as d };
