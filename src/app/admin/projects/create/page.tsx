import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import ProjectForm from "./project-form";

export type ProjectCreateState = {
  ok: boolean;
  message: string;
};

function parseJson(value: FormDataEntryValue | null): Prisma.InputJsonValue {
  try {
    return JSON.parse(String(value || "{}")) as Prisma.InputJsonValue;
  } catch {
    return {};
  }
}

async function createProject(
  _prevState: ProjectCreateState,
  formData: FormData
): Promise<ProjectCreateState> {
  "use server";

  const locale = String(formData.get("locale") || "vi") as "vi" | "en";
  const status = String(formData.get("status") || "DRAFT");
  const thumbnail = String(formData.get("thumbnail") || "");
  const categoryId = String(formData.get("categoryId") || "");

  const allowIndex = formData.get("allowIndex") === "on";

  const clientName = String(formData.get("clientName") || "").trim();
  const projectType = String(formData.get("projectType") || "").trim();
  const startedAt = String(formData.get("startedAt") || "");
  const completedAt = String(formData.get("completedAt") || "");

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const excerpt = String(formData.get("excerpt") || "");
  const seoTitle = String(formData.get("seoTitle") || "");
  const seoDescription = String(formData.get("seoDescription") || "");
  const structuredData = parseJson(formData.get("structuredData"));

  if (!title || !slug) {
    return { ok: false, message: "Vui lòng nhập tên công trình và slug." };
  }

  const existed = await prisma.projectTranslation.findUnique({
    where: {
      locale_slug: {
        locale,
        slug,
      },
    },
  });

  if (existed) {
    return { ok: false, message: "Slug đã tồn tại trong ngôn ngữ này." };
  }

  try {
    await prisma.project.create({
      data: {
        status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
        thumbnail: thumbnail || null,
        gallery: [],
        clientName: clientName || null,
        projectType: projectType || null,
        budget: null,
        startedAt: startedAt ? new Date(startedAt) : null,
        completedAt: completedAt ? new Date(completedAt) : null,
        categoryId: categoryId || null,
        allowIndex,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        translations: {
          create: {
            locale,
            title,
            slug,
            excerpt: excerpt || null,
            content: { html: "" },
            structuredData,
            seoTitle: seoTitle || null,
            seoDescription: seoDescription || null,
          },
        },
      },
    });

    return { ok: true, message: "Tạo công trình thành công." };
  } catch (error) {
    console.error("Create project error:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { ok: false, message: "Slug đã tồn tại." };
    }

    return { ok: false, message: "Có lỗi xảy ra khi tạo công trình." };
  }
}

export default async function CreateProjectPage() {
  const categories = await prisma.category.findMany({
    where: { type: "PROJECT" },
    orderBy: { createdAt: "desc" },
  });

  return <ProjectForm action={createProject} categories={categories} />;
}