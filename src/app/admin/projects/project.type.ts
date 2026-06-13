export type AdminLocale = "vi" | "en";
export type AdminProjectStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type ProjectCategoryOption = {
  id: string;
  nameVi: string;
  nameEn: string | null;
};

export type TitleTextImageTextBlock = {
  type: "titleTextImageText";
  title: string;
  textTop: string;
  image: string;
  textBottom: string;
};

export type TwoImagesContentBlock = {
  type: "twoImagesContent";
  image1: string;
  image2: string;
  content1: string;
  content2: string;
};

export type ProjectContentBlock =
  | TitleTextImageTextBlock
  | TwoImagesContentBlock;

export type ProjectStructuredData = {
  blocks: ProjectContentBlock[];
};

export type AdminProjectItem = {
  id: string;
  status: AdminProjectStatus;
  thumbnail: string | null;
  clientName: string;
  projectType: string;
  categoryName: string;
  titleVi: string;
  titleEn: string;
  slugVi: string;
  slugEn: string;
  startedAt: string;
  completedAt: string;
  publishedAt: string;
  updatedAt: string;
};

export type AdminProjectDetail = {
  id: string;
  status: AdminProjectStatus;
  thumbnail: string;
  clientName: string;
  projectType: string;
  startedAt: string;
  completedAt: string;
  categoryId: string;
  allowIndex: boolean;
  activeLocale: AdminLocale;
  title: string;
  slug: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  structuredData: ProjectStructuredData;
};