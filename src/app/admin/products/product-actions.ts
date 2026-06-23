"use server";

import { prisma } from "@/lib/prisma";
import { Locale, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ProductActionState } from "./product-form.type";

type ProductStatusValue = "DRAFT" | "PUBLISHED" | "ARCHIVED";

type AttributePayload = {
  attributeId: string;
  code: string;
  type: "SELECT" | "MULTI_SELECT" | "TEXT" | "NUMBER" | "BOOLEAN" | "COLOR";
  value: string | string[] | boolean;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function parseStatus(value: string): ProductStatusValue {
  if (value === "PUBLISHED") return "PUBLISHED";
  if (value === "ARCHIVED") return "ARCHIVED";
  return "DRAFT";
}

function parseLocale(value: string): Locale {
  return value === Locale.en ? Locale.en : Locale.vi;
}

function parseMoney(value: string) {
  const clean = value.replace(/\D/g, "");

  if (!clean) return null;

  return new Prisma.Decimal(clean);
}

function parseJsonArray(value: string): any[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseJsonObject(value: string): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  if (!value) return Prisma.JsonNull;

  try {
    const parsed = JSON.parse(value);

    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
      return Prisma.JsonNull;
    }

    return parsed as Prisma.InputJsonValue;
  } catch {
    return Prisma.JsonNull;
  }
}

function parseAttributeValues(value: string): AttributePayload[] {
  const parsed = parseJsonArray(value);

  return parsed
    .map((item) => ({
      attributeId: String(item.attributeId || ""),
      code: String(item.code || ""),
      type: item.type,
      value: item.value,
    }))
    .filter((item) => item.attributeId && item.type);
}

function parseAttributeScope(value: string) {
  return parseJsonArray(value)
    .map((item) => String(item.attributeId || item.id || ""))
    .filter(Boolean);
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

function isEmptyAttributeValue(value: unknown) {
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "boolean") return false;
  if (value === 0) return false;
  if (value === null || value === undefined) return true;

  return String(value).trim() === "";
}

/**
 * Lưu gallery an toàn:
 * - Không dùng field alt vì schema của bạn là altVi/altEn hoặc không có alt chung.
 * - Không xoá toàn bộ rồi create lại.
 * - Ảnh cũ còn trong gallery thì giữ record cũ, chỉ update sortOrder.
 * - Ảnh bị admin gỡ thì mới xoá.
 */
async function saveProductImages({
  tx,
  productId,
  gallery,
}: {
  tx: Prisma.TransactionClient;
  productId: string;
  gallery: string[];
}) {
  const cleanGallery = Array.from(
    new Set(gallery.map((url) => url.trim()).filter(Boolean))
  );

  if (!cleanGallery.length) {
    await tx.productImage.deleteMany({
      where: {
        productId,
      },
    });

    return;
  }

  await tx.productImage.deleteMany({
    where: {
      productId,
      url: {
        notIn: cleanGallery,
      },
    },
  });

  const existingImages = await tx.productImage.findMany({
    where: {
      productId,
      url: {
        in: cleanGallery,
      },
    },
    select: {
      id: true,
      url: true,
    },
  });

  for (const [index, url] of cleanGallery.entries()) {
    const existed = existingImages.find((image) => image.url === url);

    if (existed) {
      await tx.productImage.update({
        where: {
          id: existed.id,
        },
        data: {
          sortOrder: index + 1,
        },
      });

      continue;
    }

    await tx.productImage.create({
      data: {
        productId,
        url,
        sortOrder: index + 1,
      },
    });
  }
}

async function saveProductAttributes({
  tx,
  productId,
  attributes,
  attributeScopeIds,
}: {
  tx: Prisma.TransactionClient;
  productId: string;
  attributes: AttributePayload[];
  attributeScopeIds: string[];
}) {
  const scopeIds = Array.from(new Set(attributeScopeIds));

  if (scopeIds.length) {
    await tx.productAttributeValue.deleteMany({
      where: {
        productId,
        attributeId: {
          in: scopeIds,
        },
      },
    });
  }

  for (const attribute of attributes) {
    if (isEmptyAttributeValue(attribute.value)) continue;

    if (attribute.type === "SELECT" || attribute.type === "COLOR") {
      if (typeof attribute.value !== "string" || !attribute.value) continue;

      await tx.productAttributeValue.create({
        data: {
          productId,
          attributeId: attribute.attributeId,
          attributeValueId: attribute.value,
        },
      });

      continue;
    }

    if (attribute.type === "MULTI_SELECT") {
      if (!Array.isArray(attribute.value)) continue;

      for (const valueId of attribute.value) {
        if (!valueId) continue;

        await tx.productAttributeValue.create({
          data: {
            productId,
            attributeId: attribute.attributeId,
            attributeValueId: valueId,
          },
        });
      }

      continue;
    }

    if (attribute.type === "BOOLEAN") {
      if (typeof attribute.value !== "boolean") continue;

      await tx.productAttributeValue.create({
        data: {
          productId,
          attributeId: attribute.attributeId,
          valueBoolean: attribute.value,
        },
      });

      continue;
    }

    if (attribute.type === "NUMBER") {
      const numberValue = Number(attribute.value);

      if (!Number.isFinite(numberValue)) continue;

      await tx.productAttributeValue.create({
        data: {
          productId,
          attributeId: attribute.attributeId,
          valueNumber: numberValue,
        },
      });

      continue;
    }

    await tx.productAttributeValue.create({
      data: {
        productId,
        attributeId: attribute.attributeId,
        valueText: String(attribute.value || "").trim(),
      },
    });
  }
}

export async function createProductAction(
  prevState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  try {
    const locale = parseLocale(getString(formData, "locale"));
    const title = getString(formData, "title").trim();
    const slug = normalizeSlug(getString(formData, "slug") || title);

    if (!title) {
      return {
        ok: false,
        message: "Tên sản phẩm là bắt buộc.",
      };
    }

    if (!slug) {
      return {
        ok: false,
        message: "Slug sản phẩm là bắt buộc.",
      };
    }

    const gallery = parseJsonArray(getString(formData, "gallery"))
      .map((item) => String(item || "").trim())
      .filter(Boolean);

    const attributes = parseAttributeValues(
      getString(formData, "attributeValuesJson")
    );

    const attributeScopeIds = parseAttributeScope(
      getString(formData, "attributeScopeJson")
    );

    const styleConfig = parseJsonObject(getString(formData, "styleConfig"));

    await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          status: parseStatus(getString(formData, "status")) as any,
          sku: getString(formData, "sku").trim() || null,
          price: parseMoney(getString(formData, "price")),
          salePrice: parseMoney(getString(formData, "salePrice")),
          thumbnail: getString(formData, "thumbnail").trim() || null,
          categoryId: getString(formData, "categoryId") || null,
          isFeatured: getBoolean(formData, "isFeatured"),
          allowIndex: getBoolean(formData, "allowIndex"),
          styleConfig,
        },
      });

      await tx.productTranslation.create({
        data: {
          productId: product.id,
          locale,
          title,
          slug,
          excerpt: getString(formData, "excerpt").trim() || null,
          content: getString(formData, "content") || "",
          seoTitle: getString(formData, "seoTitle").trim() || null,
          seoDescription:
            getString(formData, "seoDescription").trim() || null,
        },
      });

      await saveProductImages({
        tx,
        productId: product.id,
        gallery,
      });

      await saveProductAttributes({
        tx,
        productId: product.id,
        attributes,
        attributeScopeIds,
      });
    });

    revalidatePath("/admin/products");

    return {
      ok: true,
      message: "Đã tạo sản phẩm.",
    };
  } catch (error) {
    console.error("Create product error:", error);

    return {
      ok: false,
      message: "Tạo sản phẩm thất bại. Kiểm tra lại dữ liệu hoặc log server.",
    };
  }
}

export async function updateProductAction(
  prevState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  try {
    const id = getString(formData, "id");

    if (!id) {
      return {
        ok: false,
        message: "Thiếu ID sản phẩm.",
      };
    }

    const locale = parseLocale(getString(formData, "locale"));
    const title = getString(formData, "title").trim();
    const slug = normalizeSlug(getString(formData, "slug") || title);

    if (!title) {
      return {
        ok: false,
        message: "Tên sản phẩm là bắt buộc.",
      };
    }

    if (!slug) {
      return {
        ok: false,
        message: "Slug sản phẩm là bắt buộc.",
      };
    }

    const gallery = parseJsonArray(getString(formData, "gallery"))
      .map((item) => String(item || "").trim())
      .filter(Boolean);

    const attributes = parseAttributeValues(
      getString(formData, "attributeValuesJson")
    );

    const attributeScopeIds = parseAttributeScope(
      getString(formData, "attributeScopeJson")
    );

    const styleConfig = parseJsonObject(getString(formData, "styleConfig"));

    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: {
          id,
        },
        data: {
          status: parseStatus(getString(formData, "status")) as any,
          sku: getString(formData, "sku").trim() || null,
          price: parseMoney(getString(formData, "price")),
          salePrice: parseMoney(getString(formData, "salePrice")),
          thumbnail: getString(formData, "thumbnail").trim() || null,
          categoryId: getString(formData, "categoryId") || null,
          isFeatured: getBoolean(formData, "isFeatured"),
          allowIndex: getBoolean(formData, "allowIndex"),
          styleConfig,
        },
      });

      await tx.productTranslation.upsert({
        where: {
          productId_locale: {
            productId: id,
            locale,
          },
        },
        create: {
          productId: id,
          locale,
          title,
          slug,
          excerpt: getString(formData, "excerpt").trim() || null,
          content: getString(formData, "content") || "",
          seoTitle: getString(formData, "seoTitle").trim() || null,
          seoDescription:
            getString(formData, "seoDescription").trim() || null,
        },
        update: {
          title,
          slug,
          excerpt: getString(formData, "excerpt").trim() || null,
          content: getString(formData, "content") || "",
          seoTitle: getString(formData, "seoTitle").trim() || null,
          seoDescription:
            getString(formData, "seoDescription").trim() || null,
        },
      });

      await saveProductImages({
        tx,
        productId: id,
        gallery,
      });

      await saveProductAttributes({
        tx,
        productId: id,
        attributes,
        attributeScopeIds,
      });
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}/edit`);
    revalidatePath(`/admin/products/${id}/edit?locale=vi`);
    revalidatePath(`/admin/products/${id}/edit?locale=en`);

    return {
      ok: true,
      message:
        locale === Locale.en ? "Đã lưu bản English." : "Đã lưu bản Tiếng Việt.",
    };
  } catch (error) {
    console.error("Update product error:", error);

    return {
      ok: false,
      message: "Lưu sản phẩm thất bại. Kiểm tra lại dữ liệu hoặc log server.",
    };
  }
}

export async function deleteProductAction(formData: FormData) {
  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Thiếu ID sản phẩm.");
  }

  await prisma.product.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}