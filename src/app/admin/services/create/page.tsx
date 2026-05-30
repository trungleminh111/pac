import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import ServiceForm from "./service-form";

export type ServiceCreateState = {
  ok: boolean;
  message: string;
};

async function createService(
  _prevState: ServiceCreateState,
  formData: FormData
): Promise<ServiceCreateState> {
  "use server";

  const locale = String(formData.get("locale") || "vi") as "vi" | "en";
  const status = String(formData.get("status") || "DRAFT");
  const categoryId = String(formData.get("categoryId") || "");
  const thumbnail = String(formData.get("thumbnail") || "");
  const icon = String(formData.get("icon") || "").trim();
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const allowIndex = formData.get("allowIndex") !== "off";

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const excerpt = String(formData.get("excerpt") || "");
  const content = String(formData.get("content") || "");
  const seoTitle = String(formData.get("seoTitle") || "");
  const seoDescription = String(formData.get("seoDescription") || "");

  if (!title || !slug) {
    return { ok: false, message: "Vui lòng nhập tên dịch vụ và slug." };
  }

  const existed = await prisma.serviceTranslation.findUnique({
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
    await prisma.service.create({
      data: {
        status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
        thumbnail: thumbnail || null,
        icon: icon || null,
        sortOrder,
        categoryId: categoryId || null,
        allowIndex,
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

    return { ok: true, message: "Tạo dịch vụ thành công." };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { ok: false, message: "Slug đã tồn tại. Vui lòng đổi slug khác." };
    }

    return { ok: false, message: "Có lỗi xảy ra khi tạo dịch vụ." };
  }
}

export default async function CreateServicePage() {
  const categories = await prisma.category.findMany({
    where: { type: "SERVICE" },
    orderBy: { createdAt: "desc" },
  });

  return <ServiceForm action={createService} categories={categories} />;
}