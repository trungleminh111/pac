import type { CSSProperties } from "react";

export type Locale = "vi" | "en";

export type PublishStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type ProductCategoryItem = {
  id: string;
  slug: string;
  nameVi: string;
  nameEn: string | null;
  name: string;
  detailTemplate: string;
};

export type ProductStyleConfig = {
  image?: {
    width?: string;
    height?: string;
    objectFit?: CSSProperties["objectFit"];
  };
  card?: {
    margin?: string;
    borderRadius?: string;
  };
};

export type ProductAttributeItem = {
  id: string;
  code: string;
  type: "SELECT" | "MULTI_SELECT" | "TEXT" | "NUMBER" | "BOOLEAN" | "COLOR";
  name: string;
  nameVi: string;
  nameEn: string;
  value: string;
  values: string[];
  colorHex: string | null;
  image: string | null;
};

export type ProductCardItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  price: string;
  salePrice: string;
  categoryId: string | null;
  categoryName: string;
  categorySlug: string;
  styleConfig: ProductStyleConfig | null;
};

export type ProductDetailItem = {
  id: string;
  status: PublishStatus;
  sku: string | null;
  price: string;
  salePrice: string;
  thumbnail: string | null;
  gallery: string[];

  /**
   * Field cũ để FE hiện tại chưa vỡ.
   * Dữ liệu được map từ ProductAttributeValue.
   */
  origin: string | null;
  material: string | null;
  size: string | null;
  thickness: string | null;
  density: string | null;
  hardness: string | null;
  color: string | null;

  /**
   * Field mới cho FE detail/filter sau này.
   */
  attributes: ProductAttributeItem[];

  styleConfig: ProductStyleConfig | null;
  isFeatured: boolean;
  categoryId: string | null;
  allowIndex: boolean;
  publishedAt: Date | null;
  category: ProductCategoryItem | null;

  title: string;
  slug: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
};

export type ProductsPageData = {
  products: ProductCardItem[];
  categories: ProductCategoryItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ProductFormState = {
  ok: boolean;
  message: string;
};