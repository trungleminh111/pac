import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductEditForm from "./product-form";

export type ProductEditState = {
  ok: boolean;
  message: string;
};

function parseGallery(value: string) {
  if (!value) return [];

  try {
    const data = JSON.parse(value);
    return Array.isArray(data)
      ? data.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

async function updateProduct(
  id: string,
  _prevState: ProductEditState,
  formData: FormData
): Promise<ProductEditState> {
  "use server";

  const locale = String(formData.get("locale") || "vi") as "vi" | "en";
  const status = String(formData.get("status") || "DRAFT") as
    | "DRAFT"
    | "PUBLISHED"
    | "ARCHIVED";

  const categoryId = String(formData.get("categoryId") || "");
  const thumbnail = String(formData.get("thumbnail") || "");
  const gallery = parseGallery(String(formData.get("gallery") || "[]"));

  const isFeatured = formData.get("isFeatured") === "on";
  const allowIndex = formData.get("allowIndex") === "on";

  const sku = String(formData.get("sku") || "").trim();
  const priceRaw = String(formData.get("price") || "").trim();
  const origin = String(formData.get("origin") || "").trim();
  const size = String(formData.get("size") || "").trim();
  const material = String(formData.get("material") || "").trim();
  const color = String(formData.get("color") || "").trim();

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "");
  const seoTitle = String(formData.get("seoTitle") || "").trim();
  const seoDescription = String(formData.get("seoDescription") || "").trim();

  if (!title || !slug) {
    return {
      ok: false,
      message: "Vui lòng nhập tên sản phẩm và slug.",
    };
  }

  const existed = await prisma.productTranslation.findFirst({
    where: {
      locale,
      slug,
      productId: {
        not: id,
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
    await prisma.product.update({
      where: {
        id,
      },
      data: {
        status,
        sku: sku || null,
        price: priceRaw ? new Prisma.Decimal(priceRaw) : null,
        thumbnail: thumbnail || gallery[0] || null,
        gallery: gallery.length > 0 ? gallery : [],
        origin: origin || null,
        size: size || null,
        material: material || null,
        color: color || null,
        isFeatured,
        allowIndex,
        categoryId: categoryId || null,
        publishedAt: status === "PUBLISHED" ? new Date() : null,

        translations: {
          upsert: {
            where: {
              productId_locale: {
                productId: id,
                locale,
              },
            },
            create: {
              locale,
              title,
              slug,
              excerpt: excerpt || null,
              content: content ? { html: content } : undefined,
              seoTitle: seoTitle || null,
              seoDescription: seoDescription || null,
            },
            update: {
              title,
              slug,
              excerpt: excerpt || null,
              content: content ? { html: content } : undefined,
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

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        ok: false,
        message: "Slug đã tồn tại. Vui lòng đổi slug khác.",
      };
    }

    return {
      ok: false,
      message: "Có lỗi xảy ra khi cập nhật sản phẩm.",
    };
  }
}

export default async function EditProductPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      translations: true,
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  const translation = product.translations[0];

  const categories = await prisma.category.findMany({
    where: {
      type: "PRODUCT",
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  const productForForm = {
    ...product,
    price: product.price ? product.price.toString() : null,
    gallery: Array.isArray(product.gallery) ? product.gallery : [],
  };

  return (
    <ProductEditForm
      product={productForForm}
      categories={categories}
      selectedLocale={translation?.locale || "vi"}
      action={updateProduct.bind(null, id)}
    />
  );
}