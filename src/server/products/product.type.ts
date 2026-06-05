export type Locale = "vi" | "en";

export type PublishStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type ProductCategoryItem = {
  id: string;
  slug: string;
  nameVi: string;
  nameEn: string | null;
  detailTemplate: string;
};

export type ProductCardItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  price: string;
  categoryId: string | null;
  categoryName: string;
  categorySlug: string;
};

export type ProductDetailItem = {
  id: string;
  status: PublishStatus;
  sku: string | null;
  price: string;
  thumbnail: string | null;
  gallery: any;
  origin: string | null;
  material: string | null;
  size: string | null;
  thickness: string | null;
  density: string | null;
  hardness: string | null;
  color: string | null;
  isFeatured: boolean;
  categoryId: string | null;
  allowIndex: boolean;
  publishedAt: Date | null;
  category: ProductCategoryItem | null;
  title: string;
  slug: string;
  excerpt: string;
  content: any;
  seoTitle: string;
  seoDescription: string;
};

export type ProductFormState = {
  ok: boolean;
  message: string;
};