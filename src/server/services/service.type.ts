export type Locale = "vi" | "en";

export type PublishStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type ServiceCardItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  icon: string;
};

export type ServiceDetailItem = {
  id: string;
  status: PublishStatus;
  thumbnail: string | null;
  icon: string | null;
  sortOrder: number;
  categoryId: string | null;
  allowIndex: boolean;
  publishedAt: Date | null;
  title: string;
  slug: string;
  excerpt: string;
  content: any;
  seoTitle: string;
  seoDescription: string;
};

export type ServiceFormState = {
  ok: boolean;
  message: string;
};