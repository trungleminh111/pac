import type {
  CategoryAttributeLevel,
  ContentType,
} from "@prisma/client";

export type AdminCategoryListItem = {
  id: string;
  type: ContentType;
  slug: string;
  detailTemplate: string;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  nameVi: string;
  nameEn: string;
  parentName: string;
  attributesCount: number;
  childrenCount: number;
  contentCount: number;
};

export type AdminCategoryParentItem = {
  id: string;
  type: ContentType;
  name: string;
  slug: string;
};

export type AdminCategoryAttributeItem = {
  id: string;
  code: string;
  type: string;
  nameVi: string;
  nameEn: string;
  isFilter: boolean;
  isVariantOption: boolean;
  sortOrder: number;
};

export type AdminCategorySelectedAttribute = {
  attributeId: string;
  level: CategoryAttributeLevel;
  sortOrder: number;
};

export type AdminCategoryDetail = {
  id: string;
  type: ContentType;
  slug: string;
  detailTemplate: string;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  nameVi: string;
  slugVi: string;
  nameEn: string;
  slugEn: string;
  selectedAttributes: AdminCategorySelectedAttribute[];
};

export type AdminCategoryFormData = {
  category: AdminCategoryDetail | null;
  parents: AdminCategoryParentItem[];
  attributes: AdminCategoryAttributeItem[];
};