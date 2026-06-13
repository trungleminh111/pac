export type AdminLocale = "vi" | "en";
export type AdminServiceStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type ServiceCategoryOption = {
  id: string;
  nameVi: string;
  nameEn: string | null;
};

export type AdminServiceItem = {
  id: string;
  status: AdminServiceStatus;
  thumbnail: string | null;
  icon: string | null;
  sortOrder: number;
  categoryName: string;
  titleVi: string;
  titleEn: string;
  slugVi: string;
  slugEn: string;
  publishedAt: string;
  updatedAt: string;
};

export type AdminServiceDetail = {
  id: string;
  status: AdminServiceStatus;
  thumbnail: string;
  icon: string;
  sortOrder: number;
  categoryId: string;
  allowIndex: boolean;
  publishedAt: string;
  activeLocale: AdminLocale;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
};