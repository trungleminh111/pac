import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import ProductForm from "./product-form";

export type ProductCreateState = {
  ok: boolean;
  message: string;
};

async function createProduct(
  _prevState: ProductCreateState,
  formData: FormData
): Promise<ProductCreateState> {
  "use server";

  const locale = String(formData.get("locale") || "vi") as "vi" | "en";
  const status = String(formData.get("status") || "DRAFT");
  const categoryId = String(formData.get("categoryId") || "");
  const thumbnail = String(formData.get("thumbnail") || "");
  const galleryRaw = String(formData.get("gallery") || "[]");
  const isFeatured = formData.get("isFeatured") === "on";
  const allowIndex = formData.get("allowIndex") !== "off";

  const sku = String(formData.get("sku") || "").trim();
  const priceRaw = String(formData.get("price") || "").trim();
  const origin = String(formData.get("origin") || "").trim();
  const size = String(formData.get("size") || "").trim();
  const material = String(formData.get("material") || "").trim();
  const color = String(formData.get("color") || "").trim();

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const excerpt = String(formData.get("excerpt") || "");
  const content = String(formData.get("content") || "");
  const seoTitle = String(formData.get("seoTitle") || "");
  const seoDescription = String(formData.get("seoDescription") || "");

  let gallery: string[] = [];

  try {
    gallery = JSON.parse(galleryRaw);
  } catch {
    gallery = [];
  }

  if (!title || !slug) {
    return { ok: false, message: "Vui lòng nhập tên sản phẩm và slug." };
  }

  const existed = await prisma.productTranslation.findUnique({
    where: {
      locale_slug: {
        locale,
        slug,
      },
    },
  });

  if (existed) {
    return {
      ok: false,
      message: "Slug đã tồn tại trong ngôn ngữ này. Vui lòng đổi slug khác.",
    };
  }

  try {
    await prisma.product.create({
      data: {
        status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
        sku: sku || null,
        price: priceRaw ? new Prisma.Decimal(priceRaw) : null,
        thumbnail: thumbnail || gallery[0] || null,
        gallery,
        origin: origin || null,
        size: size || null,
        material: material || null,
        color: color || null,
        isFeatured,
        allowIndex,
        categoryId: categoryId || null,
        publishedAt: status === "PUBLISHED" ? new Date() : null,

        translations: {
          create: {
            locale,
            title,
            slug,
            excerpt: excerpt || null,
            content: { html: content },
            seoTitle: seoTitle || null,
            seoDescription: seoDescription || null,
          },
        },
      },
    });

    return { ok: true, message: "Tạo sản phẩm thành công." };
  } catch {
    return { ok: false, message: "Có lỗi xảy ra khi tạo sản phẩm." };
  }
}

export default async function CreateProductPage() {
  const categories = await prisma.category.findMany({
    where: { type: "PRODUCT" },
    orderBy: { sortOrder: "asc" },
  });

  return <ProductForm action={createProduct} categories={categories} />;
}