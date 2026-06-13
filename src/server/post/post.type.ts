export type Locale = "vi" | "en";

export type PublishStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type PostTagItem = {
  id: string;
  name: string;
  slug: string;
  postCount: number;
};

export type PostCardItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  publishedAt: Date | null;
  isFeatured: boolean;
  tags?: PostTagItem[];
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
  tags: PostTagItem[];
};

export type PostFormState = {
  ok: boolean;
  message: string;
};