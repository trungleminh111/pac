import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServiceEditForm from "./service-form";

export type ServiceEditState = {
  ok: boolean;
  message: string;
};

async function updateService(
  id: string,
  _prevState: ServiceEditState,
  formData: FormData
): Promise<ServiceEditState> {
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
    return {
      ok: false,
      message: "Vui lòng nhập tên dịch vụ và slug.",
    };
  }

  const existed = await prisma.serviceTranslation.findFirst({
    where: {
      locale,
      slug,
      serviceId: {
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
    await prisma.service.update({
      where: { id },
      data: {
        status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
        thumbnail: thumbnail || null,
        icon: icon || null,
        sortOrder,
        categoryId: categoryId || null,
        allowIndex,
        publishedAt: status === "PUBLISHED" ? new Date() : null,

        translations: {
          upsert: {
            where: {
              serviceId_locale: {
                serviceId: id,
                locale,
              },
            },
            create: {
              locale,
              title,
              slug,
              excerpt: excerpt || null,
              content: { html: content },
              seoTitle: seoTitle || null,
              seoDescription: seoDescription || null,
            },
            update: {
              title,
              slug,
              excerpt: excerpt || null,
              content: { html: content },
              seoTitle: seoTitle || null,
              seoDescription: seoDescription || null,
            },
          },
        },
      },
    });

    return {
      ok: true,
      message: "Cập nhật dịch vụ thành công.",
    };
  } catch (error) {
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
      message: "Có lỗi xảy ra khi cập nhật dịch vụ.",
    };
  }
}

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      translations: true,
      category: true,
    },
  });

  if (!service) notFound();

  const translation = service.translations[0];

  const categories = await prisma.category.findMany({
    where: { type: "SERVICE" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <ServiceEditForm
      service={service}
      categories={categories}
      selectedLocale={translation?.locale || "vi"}
      action={updateService.bind(null, id)}
    />
  );
}