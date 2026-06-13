"use server";

import { prisma } from "@/lib/prisma";
import { Locale as PrismaLocale, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type {
  AdminLocale,
  AdminProjectStatus,
  ProjectStructuredData,
} from "./project.type";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getBoolean(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "1";
}

function parseLocale(value: string): AdminLocale {
  return value === "en" ? "en" : "vi";
}

function toPrismaLocale(locale: AdminLocale) {
  return locale === "en" ? PrismaLocale.en : PrismaLocale.vi;
}

function parseStatus(value: string): AdminProjectStatus {
  if (value === "PUBLISHED") return "PUBLISHED";
  if (value === "ARCHIVED") return "ARCHIVED";
  return "DRAFT";
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseDate(value: string) {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function parsePublishedAt(status: AdminProjectStatus) {
  return status === "PUBLISHED" ? new Date() : null;
}

function successUrl(message: string) {
  return `/admin/projects?success=${encodeURIComponent(message)}`;
}

function errorUrl(message: string) {
  return `/admin/projects?error=${encodeURIComponent(message)}`;
}

function formSuccessUrl(id: string, locale: AdminLocale, message: string) {
  return `/admin/projects/${id}/edit?locale=${locale}&success=${encodeURIComponent(
    message
  )}`;
}

function formErrorUrl(id: string, locale: AdminLocale, message: string) {
  const encoded = encodeURIComponent(message);

  if (id) {
    return `/admin/projects/${id}/edit?locale=${locale}&error=${encoded}`;
  }

  return `/admin/projects/create?error=${encoded}`;
}

function parseStructuredData(value: string): ProjectStructuredData | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value);

    if (!parsed || typeof parsed !== "object") return null;
    if (!Array.isArray(parsed.blocks)) return null;

    return parsed as ProjectStructuredData;
  } catch {
    return null;
  }
}

function validateStructuredData(data: ProjectStructuredData | null) {
  if (!data) return "Thiếu dữ liệu layout công trình.";

  const block1 = data.blocks[0];
  const block2 = data.blocks[1];

  if (!block1 || block1.type !== "titleTextImageText") {
    return "Thiếu khối 1: Tiêu đề + text + ảnh + text.";
  }

  if (!block2 || block2.type !== "twoImagesContent") {
    return "Thiếu khối 2: 2 ảnh bên trái, nội dung bên phải.";
  }

  const requiredFields = [
    { label: "Tiêu đề khối 1", value: block1.title },
    { label: "Nội dung phía trên ảnh", value: block1.textTop },
    { label: "Ảnh khối 1", value: block1.image },
    { label: "Nội dung phía dưới ảnh", value: block1.textBottom },
    { label: "Ảnh bên trái 1", value: block2.image1 },
    { label: "Ảnh bên trái 2", value: block2.image2 },
    { label: "Nội dung bên phải 1", value: block2.content1 },
    { label: "Nội dung bên phải 2", value: block2.content2 },
  ];

  const missingField = requiredFields.find(
    (field) => !field.value || !field.value.trim()
  );

  if (missingField) {
    return `Vui lòng nhập đầy đủ: ${missingField.label}`;
  }

  return "";
}

export async function saveProjectAction(formData: FormData) {
  const id = getString(formData, "id");
  const locale = parseLocale(getString(formData, "locale"));
  const prismaLocale = toPrismaLocale(locale);

  const title = getString(formData, "title").trim();
  const slug = normalizeSlug(getString(formData, "slug") || title);
  const excerpt = getString(formData, "excerpt").trim();
  const seoTitle = getString(formData, "seoTitle").trim();
  const seoDescription = getString(formData, "seoDescription").trim();

  const status = parseStatus(
    getString(formData, "submitStatus") || getString(formData, "status")
  );

  const thumbnail = getString(formData, "thumbnail").trim();
  const clientName = getString(formData, "clientName").trim();
  const projectType = getString(formData, "projectType").trim();
  const categoryId = getString(formData, "categoryId") || null;
  const allowIndex = getBoolean(formData, "allowIndex");

  const startedAt = parseDate(getString(formData, "startedAt"));
  const completedAt = parseDate(getString(formData, "completedAt"));

  const structuredData = parseStructuredData(getString(formData, "structuredData"));
  const structuredDataError = validateStructuredData(structuredData);

  if (!title) {
    redirect(formErrorUrl(id, locale, "Tên công trình là bắt buộc."));
  }

  if (!slug) {
    redirect(formErrorUrl(id, locale, "Slug công trình là bắt buộc."));
  }

  if (structuredDataError) {
    redirect(formErrorUrl(id, locale, structuredDataError));
  }

  if (startedAt && completedAt && completedAt < startedAt) {
    redirect(
      formErrorUrl(
        id,
        locale,
        "Ngày hoàn thành không được nhỏ hơn ngày khởi công."
      )
    );
  }

  let redirectTo = "";

  try {
    const savedProject = await prisma.$transaction(async (tx) => {
      const project = id
        ? await tx.project.update({
            where: {
              id,
            },
            data: {
              status: status as any,
              thumbnail: thumbnail || null,
              clientName: clientName || null,
              projectType: projectType || null,
              startedAt,
              completedAt,
              categoryId,
              allowIndex,
              publishedAt: parsePublishedAt(status),
            },
          })
        : await tx.project.create({
            data: {
              status: status as any,
              thumbnail: thumbnail || null,
              clientName: clientName || null,
              projectType: projectType || null,
              startedAt,
              completedAt,
              categoryId,
              allowIndex,
              publishedAt: parsePublishedAt(status),
            },
          });

      await tx.projectTranslation.upsert({
        where: {
          projectId_locale: {
            projectId: project.id,
            locale: prismaLocale,
          },
        },
        create: {
          projectId: project.id,
          locale: prismaLocale,
          title,
          slug,
          excerpt: excerpt || null,
          content: structuredData as Prisma.InputJsonValue,
          structuredData: structuredData as Prisma.InputJsonValue,
          seoTitle: seoTitle || null,
          seoDescription: seoDescription || null,
        },
        update: {
          title,
          slug,
          excerpt: excerpt || null,
          content: structuredData as Prisma.InputJsonValue,
          structuredData: structuredData as Prisma.InputJsonValue,
          seoTitle: seoTitle || null,
          seoDescription: seoDescription || null,
        },
      });

      return project;
    });

    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${savedProject.id}/edit`);

    redirectTo = formSuccessUrl(
      savedProject.id,
      locale,
      id
        ? "Đã cập nhật công trình."
        : "Đã tạo công trình. Có thể tiếp tục chỉnh sửa."
    );
  } catch (error) {
    console.error("Save project error:", error);

    redirectTo = formErrorUrl(
      id,
      locale,
      "Lưu công trình thất bại. Có thể slug đã tồn tại, vui lòng kiểm tra lại."
    );
  }

  redirect(redirectTo);
}

export async function deleteProjectAction(formData: FormData) {
  const id = getString(formData, "id");

  if (!id) {
    redirect(errorUrl("Thiếu ID công trình cần xoá."));
  }

  const project = await prisma.project.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    redirect(errorUrl("Công trình không tồn tại hoặc đã bị xoá."));
  }

  await prisma.project.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/projects");

  redirect(successUrl("Đã xoá công trình."));
}