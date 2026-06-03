export type Locale = "vi" | "en";

export type SiteMenuItem = {
  id: string;
  label: string;
  href: string;
  target: string;
  icon: string | null;
  children: SiteMenuItem[];
};