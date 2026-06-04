"use server";

import { prisma } from "@/lib/prisma";
import type { Locale, ProductFormState, PublishStatus } from "./product.type";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function parseContent(value: string) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return {
      html: value,
    };
  }
}

function parsePrice(value: string) {
  if (!value) return null;

  const cleaned = value.replace(/[^\d.]/g, "");
  const numberValue = Number(cleaned);

  if (Number.isNaN(numberValue)) return null;

  return numberValue;
}

export async function createProductAction(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const locale = getString(formData, "locale") as Locale;
  const title = getString(formData, "title");
  const slug = getString(formData, "slug");
  const excerpt = getString(formData, "excerpt");
  const content = parseContent(getString(formData, "content"));
  const seoTitle = getString(formData, "seoTitle");
  const seoDescription = getString(formData, "seoDescription");

  const status = getString(formData, "status") as PublishStatus;
  const sku = getString(formData, "sku");
  const price = parsePrice(getString(formData, "price"));
  const thumbnail = getString(formData, "thumbnail");
  const origin = getString(formData, "origin");
  const size = getString(formData, "size");
  const material = getString(formData, "material");
  const color = getString(formData, "color");
  const categoryId = getString(formData, "categoryId");

  if (!title || !slug) {
    return {
      ok: false,
      message: "Vui lòng nhập tên sản phẩm và slug.",
    };
  }

  try {
    await prisma.product.create({
      data: {
        status: status || "DRAFT",
        sku: sku || null,
        price,
        thumbnail: thumbnail || null,
        origin: origin || null,
        size: size || null,
        material: material || null,
        color: color || null,
        categoryId: categoryId || null,
        allowIndex: formData.get("allowIndex") === "on",
        isFeatured: formData.get("isFeatured") === "on",
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        translations: {
          create: {
            locale: locale || "vi",
            title,
            slug,
            excerpt: excerpt || null,
            content,
            seoTitle: seoTitle || null,
            seoDescription: seoDescription || null,
          },
        },
      },
    });

    return {
      ok: true,
      message: "Tạo sản phẩm thành công.",
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: "Không thể tạo sản phẩm. Có thể slug đã tồn tại.",
    };
  }
}

export async function updateProductAction(
  productId: string,
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const locale = getString(formData, "locale") as Locale;
  const title = getString(formData, "title");
  const slug = getString(formData, "slug");
  const excerpt = getString(formData, "excerpt");
  const content = parseContent(getString(formData, "content"));
  const seoTitle = getString(formData, "seoTitle");
  const seoDescription = getString(formData, "seoDescription");

  const status = getString(formData, "status") as PublishStatus;
  const sku = getString(formData, "sku");
  const price = parsePrice(getString(formData, "price"));
  const thumbnail = getString(formData, "thumbnail");
  const origin = getString(formData, "origin");
  const size = getString(formData, "size");
  const material = getString(formData, "material");
  const color = getString(formData, "color");
  const categoryId = getString(formData, "categoryId");

  if (!title || !slug) {
    return {
      ok: false,
      message: "Vui lòng nhập tên sản phẩm và slug.",
    };
  }

  try {
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        status: status || "DRAFT",
        sku: sku || null,
        price,
        thumbnail: thumbnail || null,
        origin: origin || null,
        size: size || null,
        material: material || null,
        color: color || null,
        categoryId: categoryId || null,
        allowIndex: formData.get("allowIndex") === "on",
        isFeatured: formData.get("isFeatured") === "on",
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        translations: {
          upsert: {
            where: {
              productId_locale: {
                productId,
                locale: locale || "vi",
              },
            },
            create: {
              locale: locale || "vi",
              title,
              slug,
              excerpt: excerpt || null,
              content,
              seoTitle: seoTitle || null,
              seoDescription: seoDescription || null,
            },
            update: {
              title,
              slug,
              excerpt: excerpt || null,
              content,
              seoTitle: seoTitle || null,
              seoDescription: seoDescription || null,
            },
          },
        },
      },
    });

    return {
      ok: true,
      message: "Cập nhật sản phẩm thành công.",
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: "Không thể cập nhật sản phẩm. Có thể slug đã tồn tại.",
    };
  }
}

export async function deleteProductAction(productId: string) {
  await prisma.product.delete({
    where: {
      id: productId,
    },
  });
}