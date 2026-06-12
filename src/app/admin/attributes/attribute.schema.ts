import { AttributeInputType, Locale } from "@prisma/client";
import { z } from "zod";

export const attributeCodeRegex = /^[a-z0-9_-]+$/;

export function normalizeCode(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const attributeValueSchema = z.object({
  id: z.string().optional().nullable(),
  code: z
    .string()
    .min(1, "Code giá trị là bắt buộc")
    .transform(normalizeCode)
    .refine((value) => attributeCodeRegex.test(value), {
      message: "Code chỉ được gồm chữ thường, số, dấu - hoặc _",
    }),
  nameVi: z.string().min(1, "Tên tiếng Việt là bắt buộc"),
  nameEn: z.string().optional().default(""),
  colorHex: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const attributeFormSchema = z.object({
  id: z.string().optional().nullable(),
  locale: z.nativeEnum(Locale).default(Locale.vi),
  code: z
    .string()
    .min(1, "Code thuộc tính là bắt buộc")
    .transform(normalizeCode)
    .refine((value) => attributeCodeRegex.test(value), {
      message: "Code chỉ được gồm chữ thường, số, dấu - hoặc _",
    }),
  type: z.nativeEnum(AttributeInputType),
  nameVi: z.string().min(1, "Tên tiếng Việt là bắt buộc"),
  nameEn: z.string().optional().default(""),
  isFilter: z.coerce.boolean().default(false),
  isVariantOption: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
  values: z.array(attributeValueSchema).default([]),
});

export type AttributeFormInput = z.infer<typeof attributeFormSchema>;