export type Locale = "vi" | "en";

export type PublishStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type PostCardItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  publishedAt: Date | null;
  isFeatured: boolean;
};

export type PostDetailItem = {
  id: string;
  status: PublishStatus;
  thumbnail: string | null;
  isFeatured: boolean;
  allowIndex: boolean;
  authorId: string | null;
  categoryId: string | null;
  publishedAt: Date | null;
  title: string;
  slug: string;
  excerpt: string;
  content: any;
  seoTitle: string;
  seoDescription: string;
  categoryName: string;
};

export type PostFormState = {
  ok: boolean;
  message: string;
};