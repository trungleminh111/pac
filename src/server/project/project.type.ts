export type Locale = "vi" | "en";

export type PublishStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type ProjectCardItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  clientName: string;
  projectType: string;
  completedAt: Date | null;
};

export type ProjectDetailItem = {
  id: string;
  status: PublishStatus;
  thumbnail: string | null;
  gallery: any;
  clientName: string | null;
  projectType: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  budget: string | null;
  categoryId: string | null;
  allowIndex: boolean;
  publishedAt: Date | null;
  title: string;
  slug: string;
  excerpt: string;
  content: any;
  seoTitle: string;
  seoDescription: string;
  structuredData: any;
  categoryName: string;
};

export type ProjectFormState = {
  ok: boolean;
  message: string;
};