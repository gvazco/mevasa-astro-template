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
  featured_images: featureImagesSchema.optional(),
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
const ProductSchema = BaseWPSchema.omit({
  content: true
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
    price: z.coerce.number()
  })
});
const ProductsSchema = z.array(ProductSchema);
const MenuItemSchema = BaseWPSchema.pick({
  title: true,
  slug: true,
  featured_images: true
}).extend({
  link: z.string(),
  acf: z.object({
    description: z.string(),
    price: z.coerce.number()
  })
});
z.array(MenuItemSchema);
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
const ProductCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string()
});
const ProductCategoriesSchema = z.array(ProductCategorySchema);

export { BaseWPSchema as B, CategorySchema as C, GalleryPageSchema as G, ProductsSchema as P, CategoriesSlugSchema as a, ProductSchema as b, ProductCategoriesSchema as c, ContactPageSchema as d, PostsSchema as e, PostSchema as f, ProcessPageSchema as g };
