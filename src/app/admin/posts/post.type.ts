export type AdminPostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type AdminLocale = "vi" | "en";

export type PostCategoryOption = {
  id: string;
  name: string;
};

export type PostTagOption = {
  id: string;
  name: string;
  slug: string;
};

export type AdminPostItem = {
  id: string;
  status: AdminPostStatus;
  thumbnail: string | null;
  isFeatured: boolean;
  allowIndex: boolean;
  categoryName: string;
  titleVi: string;
  titleEn: string;
  slugVi: string;
  slugEn: string;
  tags: string[];
  tagsCount: number;
  publishedAt: string;
  updatedAt: string;
};

export type AdminPostDetail = {
  id: string;
  status: AdminPostStatus;
  thumbnail: string | null;
  isFeatured: boolean;
  allowIndex: boolean;
  categoryId: string | null;
  publishedAt: string;
  activeLocale: AdminLocale;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  selectedTagIds: string[];
};