import type { AttributeInputType } from "@prisma/client";

export type AdminAttributeValueItem = {
  id: string;
  code: string;
  colorHex: string | null;
  image: string | null;
  sortOrder: number;
  nameVi: string;
  nameEn: string;
};

export type AdminAttributeItem = {
  id: string;
  code: string;
  type: AttributeInputType;
  isFilter: boolean;
  isVariantOption: boolean;
  sortOrder: number;
  nameVi: string;
  nameEn: string;
  valuesCount: number;
};

export type AdminAttributeDetail = {
  id: string;
  code: string;
  type: AttributeInputType;
  isFilter: boolean;
  isVariantOption: boolean;
  sortOrder: number;
  nameVi: string;
  nameEn: string;
  values: AdminAttributeValueItem[];
};