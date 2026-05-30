import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectEditForm from "./project-form";


export type ProjectEditState = {
  ok: boolean;
  message: string;
};

async function updateProject(
  id: string,
  _prevState: ProjectEditState,
  formData: FormData
): Promise<ProjectEditState> {
  "use server";

  const locale = String(formData.get("locale") || "vi") as "vi" | "en";
  const status = String(formData.get("status") || "DRAFT");
  const thumbnail = String(formData.get("thumbnail") || "");
  const categoryId = String(formData.get("categoryId") || "");
  const allowIndex = formData.get("allowIndex") !== "off";

  const clientName = String(formData.get("clientName") || "").trim();
  const projectType = String(formData.get("projectType") || "").trim();
  const budget = String(formData.get("budget") || "").trim();
  const startedAt = String(formData.get("startedAt") || "");
  const completedAt = String(formData.get("completedAt") || "");

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const excerpt = String(formData.get("excerpt") || "");
  const content = String(formData.get("content") || "");
  const seoTitle = String(formData.get("seoTitle") || "");
  const seoDescription = String(formData.get("seoDescription") || "");

  if (!title || !slug) {
    return { ok: false, message: "Vui lòng nhập tên công trình và slug." };
  }

  const existed = await prisma.projectTranslation.findFirst({
    where: {
      locale,
      slug,
      projectId: {
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
    await prisma.project.update({
      where: { id },
      data: {
        status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
        thumbnail: thumbnail || null,
        gallery: null,
        clientName: clientName || null,
        projectType: projectType || null,
        budget: budget || null,
        startedAt: startedAt ? new Date(startedAt) : null,
        completedAt: completedAt ? new Date(completedAt) : null,
        categoryId: categoryId || null,
        allowIndex,
        publishedAt: status === "PUBLISHED" ? new Date() : null,

        translations: {
          upsert: {
            where: {
              projectId_locale: {
                projectId: id,
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

    return { ok: true, message: "Cập nhật công trình thành công." };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { ok: false, message: "Slug đã tồn tại. Vui lòng đổi slug khác." };
    }

    return { ok: false, message: "Có lỗi xảy ra khi cập nhật công trình." };
  }
}

function toInputDate(value: Date | null) {
  if (!value) return "";
  return value.toISOString().slice(0, 10);
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      translations: true,
      category: true,
    },
  });

  if (!project) notFound();

  const translation = project.translations[0];

  const categories = await prisma.category.findMany({
    where: { type: "PROJECT" },
    orderBy: { createdAt: "desc" },
  });

  const projectForForm = {
    ...project,
    startedAt: toInputDate(project.startedAt),
    completedAt: toInputDate(project.completedAt),
  };

  return (
    <ProjectEditForm
      project={projectForForm}
      categories={categories}
      selectedLocale={translation?.locale || "vi"}
      action={updateProject.bind(null, id)}
    />
  );
}