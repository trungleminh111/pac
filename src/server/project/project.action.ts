"use server";

import { prisma } from "@/lib/prisma";
import type { Locale, ProjectFormState, PublishStatus } from "./project.type";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function parseJson(value: string) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return {
      html: value,
    };
  }
}

function parseDate(value: string) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

export async function createProjectAction(
  prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const locale = getString(formData, "locale") as Locale;
  const title = getString(formData, "title");
  const slug = getString(formData, "slug");
  const excerpt = getString(formData, "excerpt");
  const content = parseJson(getString(formData, "content"));
  const seoTitle = getString(formData, "seoTitle");
  const seoDescription = getString(formData, "seoDescription");
  const structuredData = parseJson(getString(formData, "structuredData"));

  const status = getString(formData, "status") as PublishStatus;
  const thumbnail = getString(formData, "thumbnail");
  const gallery = parseJson(getString(formData, "gallery"));
  const clientName = getString(formData, "clientName");
  const projectType = getString(formData, "projectType");
  const startedAt = parseDate(getString(formData, "startedAt"));
  const completedAt = parseDate(getString(formData, "completedAt"));
  const budget = getString(formData, "budget");
  const categoryId = getString(formData, "categoryId");

  if (!title || !slug) {
    return {
      ok: false,
      message: "Vui lòng nhập tên công trình và slug.",
    };
  }

  try {
    await prisma.project.create({
      data: {
        status: status || "DRAFT",
        thumbnail: thumbnail || null,
        gallery,
        clientName: clientName || null,
        projectType: projectType || null,
        startedAt,
        completedAt,
        budget: budget || null,
        categoryId: categoryId || null,
        allowIndex: formData.get("allowIndex") === "on",
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
            structuredData,
          },
        },
      },
    });

    return {
      ok: true,
      message: "Tạo công trình thành công.",
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: "Không thể tạo công trình. Có thể slug đã tồn tại.",
    };
  }
}

export async function updateProjectAction(
  projectId: string,
  prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const locale = getString(formData, "locale") as Locale;
  const title = getString(formData, "title");
  const slug = getString(formData, "slug");
  const excerpt = getString(formData, "excerpt");
  const content = parseJson(getString(formData, "content"));
  const seoTitle = getString(formData, "seoTitle");
  const seoDescription = getString(formData, "seoDescription");
  const structuredData = parseJson(getString(formData, "structuredData"));

  const status = getString(formData, "status") as PublishStatus;
  const thumbnail = getString(formData, "thumbnail");
  const gallery = parseJson(getString(formData, "gallery"));
  const clientName = getString(formData, "clientName");
  const projectType = getString(formData, "projectType");
  const startedAt = parseDate(getString(formData, "startedAt"));
  const completedAt = parseDate(getString(formData, "completedAt"));
  const budget = getString(formData, "budget");
  const categoryId = getString(formData, "categoryId");

  if (!title || !slug) {
    return {
      ok: false,
      message: "Vui lòng nhập tên công trình và slug.",
    };
  }

  try {
    await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        status: status || "DRAFT",
        thumbnail: thumbnail || null,
        gallery,
        clientName: clientName || null,
        projectType: projectType || null,
        startedAt,
        completedAt,
        budget: budget || null,
        categoryId: categoryId || null,
        allowIndex: formData.get("allowIndex") === "on",
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        translations: {
          upsert: {
            where: {
              projectId_locale: {
                projectId,
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
              structuredData,
            },
            update: {
              title,
              slug,
              excerpt: excerpt || null,
              content,
              seoTitle: seoTitle || null,
              seoDescription: seoDescription || null,
              structuredData,
            },
          },
        },
      },
    });

    return {
      ok: true,
      message: "Cập nhật công trình thành công.",
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: "Không thể cập nhật công trình. Có thể slug đã tồn tại.",
    };
  }
}

export async function deleteProjectAction(projectId: string) {
  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });
}