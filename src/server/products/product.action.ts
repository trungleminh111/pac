export type Locale = "vi" | "en";

export type ProductCardItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  price: string;
  categoryId: string | null;
  categoryName: string;
};