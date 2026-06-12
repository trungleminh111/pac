"use server";

import { prisma } from "@/lib/prisma";
import {
  CategoryAttributeLevel,
  ContentType,
  Locale,
  Prisma,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type AttributePayload = {
  attributeId: string;
  level: CategoryAttributeLevel;
  sortOrder: number;
};

type ReorderPayload = {
  id: string;
  sortOrder: number;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function toInt(value: string, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseContentType(value: string): ContentType {
  const values = Object.values(ContentType) as string[];

  if (values.includes(value)) {
    return value as ContentType;
  }

  return ContentType.PRODUCT;
}

function parseLevel(value: string): CategoryAttributeLevel {
  const values = Object.values(CategoryAttributeLevel) as string[];

  if (values.includes(value)) {
    return value as CategoryAttributeLevel;
  }

  return CategoryAttributeLevel.OPTIONAL;
}

function parseAttributesJson(value: string): AttributePayload[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) return [];

    const map = new Map<string, AttributePayload>();

    for (const item of parsed) {
      if (!item?.attributeId) continue;

      map.set(item.attributeId, {
        attributeId: String(item.attributeId),
        level: parseLevel(String(item.level || "OPTIONAL")),
        sortOrder: Number.isFinite(Number(item.sortOrder))
          ? Number(item.sortOrder)
          : 0,
      });
    }

    return Array.from(map.values());
  } catch {
    return [];
  }
}

function parseReorderJson(value: string): ReorderPayload[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => ({
        id: String(item.id || ""),
        sortOrder: Number(item.sortOrder),
      }))
      .filter((item) => item.id && Number.isFinite(item.sortOrder));
  } catch {
    return [];
  }
}

async function upsertCategoryTranslation({
  tx,
  categoryId,
  locale,
  name,
  slug,
}: {
  tx: Prisma.TransactionClient;
  categoryId: string;
  locale: Locale;
  name: string;
  slug: string;
}) {
  await tx.categoryTranslation.upsert({
    where: {
      categoryId_locale: {
        categoryId,
        locale,
      },
    },
    create: {
      categoryId,
      locale,
      name,
      slug,
    },
    update: {
      name,
      slug,
    },
  });
}

export async function saveCategoryAction(formData: FormData) {
  const mode = getString(formData, "mode");
  const id = getString(formData, "id");

  const type = parseContentType(getString(formData, "type"));
  const parentId = getString(formData, "parentId") || null;

  const nameVi = getString(formData, "nameVi").trim();
  const nameEn = getString(formData, "nameEn").trim();

  const slugVi = normalizeSlug(getString(formData, "slugVi") || nameVi);
  const slugEn = normalizeSlug(getString(formData, "slugEn") || nameEn || nameVi);
  const baseSlug = normalizeSlug(getString(formData, "slug") || slugVi);

  const detailTemplate = getString(formData, "detailTemplate") || "default";
  const sortOrder = toInt(getString(formData, "sortOrder"), 0);
  const isActive = getBoolean(formData, "isActive");

  const selectedAttributes = parseAttributesJson(
    getString(formData, "attributesJson")
  );

  if (!nameVi) {
    throw new Error("Tên tiếng Việt là bắt buộc");
  }

  if (!baseSlug) {
    throw new Error("Slug là bắt buộc");
  }

  if (mode === "edit" && id && parentId === id) {
    throw new Error("Category không thể chọn chính nó làm danh mục cha");
  }

  const savedCategory = await prisma.$transaction(async (tx) => {
    const category =
      mode === "edit" && id
        ? await tx.category.update({
            where: { id },
            data: {
              type,
              slug: baseSlug,
              detailTemplate,
              parentId,
              sortOrder,
              isActive,
            },
          })
        : await tx.category.create({
            data: {
              type,
              slug: baseSlug,
              detailTemplate,
              parentId,
              sortOrder,
              isActive,
            },
          });

    await upsertCategoryTranslation({
      tx,
      categoryId: category.id,
      locale: Locale.vi,
      name: nameVi,
      slug: slugVi || baseSlug,
    });

    await upsertCategoryTranslation({
      tx,
      categoryId: category.id,
      locale: Locale.en,
      name: nameEn || nameVi,
      slug: slugEn || baseSlug,
    });

    if (type !== ContentType.PRODUCT) {
      await tx.categoryAttribute.deleteMany({
        where: {
          categoryId: category.id,
        },
      });

      return category;
    }

    const selectedIds = selectedAttributes.map((item) => item.attributeId);

    if (selectedIds.length) {
      for (const [index, item] of selectedAttributes.entries()) {
        await tx.categoryAttribute.upsert({
          where: {
            categoryId_attributeId: {
              categoryId: category.id,
              attributeId: item.attributeId,
            },
          },
          create: {
            categoryId: category.id,
            attributeId: item.attributeId,
            level: item.level,
            sortOrder: item.sortOrder || index + 1,
          },
          update: {
            level: item.level,
            sortOrder: item.sortOrder || index + 1,
          },
        });
      }

      await tx.categoryAttribute.deleteMany({
        where: {
          categoryId: category.id,
          attributeId: {
            notIn: selectedIds,
          },
        },
      });
    } else {
      await tx.categoryAttribute.deleteMany({
        where: {
          categoryId: category.id,
        },
      });
    }

    return category;
  });

  revalidatePath("/admin/categories");
  revalidatePath(`/admin/categories/${savedCategory.id}/edit`);

  redirect("/admin/categories");
}

export async function deleteCategoryAction(formData: FormData) {
  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Thiếu ID category");
  }

  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      _count: {
        select: {
          children: true,
          posts: true,
          products: true,
          projects: true,
          services: true,
        },
      },
    },
  });

  if (!category) {
    throw new Error("Không tìm thấy category");
  }

  const contentCount =
    category._count.children +
    category._count.posts +
    category._count.products +
    category._count.projects +
    category._count.services;

  if (contentCount > 0) {
    throw new Error(
      "Không thể xoá category đang có danh mục con hoặc nội dung liên kết"
    );
  }

  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function reorderCategoriesAction(formData: FormData) {
  const items = parseReorderJson(getString(formData, "itemsJson"));

  if (!items.length) return;

  await prisma.$transaction(
    items.map((item) =>
      prisma.category.update({
        where: {
          id: item.id,
        },
        data: {
          sortOrder: item.sortOrder,
        },
      })
    )
  );

  revalidatePath("/admin/categories");
}