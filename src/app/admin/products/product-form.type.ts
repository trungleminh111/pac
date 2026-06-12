export type ProductActionState = {
  ok: boolean;
  message: string;
};

export type ProductAttributeValueItem = {
  id: string;
  code: string;
  nameVi: string;
  nameEn: string;
  colorHex: string | null;
  image: string | null;
  sortOrder: number;
};

export type ProductFormAttributeItem = {
  id: string;
  code: string;
  type: "SELECT" | "MULTI_SELECT" | "TEXT" | "NUMBER" | "BOOLEAN" | "COLOR";
  nameVi: string;
  nameEn: string;
  level: "REQUIRED" | "RECOMMENDED" | "OPTIONAL";
  sortOrder: number;
  values: ProductAttributeValueItem[];
};

export type ProductFormCategoryItem = {
  id: string;
  slug: string;
  nameVi: string;
  nameEn: string;
  attributes: ProductFormAttributeItem[];
};

export type ProductEditAttributeValue = {
  attributeId: string;
  type: ProductFormAttributeItem["type"];
  value: string | string[] | boolean;
};

export type ProductEditData = {
  id: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sku: string;
  price: string;
  salePrice: string;
  thumbnail: string;
  gallery: string[];
  categoryId: string;
  isFeatured: boolean;
  allowIndex: boolean;
  styleConfig: any;
  translation: {
    locale: "vi" | "en";
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    seoTitle: string;
    seoDescription: string;
  };
  attributeValues: ProductEditAttributeValue[];
};

export type AdminProductListItem = {
  id: string;
  title: string;
  slug: string;
  sku: string;
  price: string;
  salePrice: string;
  thumbnail: string;
  status: string;
  isFeatured: boolean;
  categoryName: string;
  updatedAt: Date;
};