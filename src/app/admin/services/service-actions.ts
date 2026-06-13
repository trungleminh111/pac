"use server";

import { prisma } from "@/lib/prisma";
import { Locale as PrismaLocale, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AdminLocale, AdminServiceStatus } from "./service.type";

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

function parseStatus(value: string): AdminServiceStatus {
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

function parseSortOrder(value: string) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function parsePublishedAt(value: string, status: AdminServiceStatus) {
  if (status !== "PUBLISHED") return null;
  if (!value) return new Date();

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function successUrl(message: string) {
  return `/admin/services?success=${encodeURIComponent(message)}`;
}

function errorUrl(message: string) {
  return `/admin/services?error=${encodeURIComponent(message)}`;
}

function formSuccessUrl(id: string, locale: AdminLocale, message: string) {
  return `/admin/services/${id}/edit?locale=${locale}&success=${encodeURIComponent(
    message
  )}`;
}

function formErrorUrl(id: string, locale: AdminLocale, message: string) {
  const encoded = encodeURIComponent(message);

  if (id) {
    return `/admin/services/${id}/edit?locale=${locale}&error=${encoded}`;
  }

  return `/admin/services/create?error=${encoded}`;
}

export async function saveServiceAction(formData: FormData) {
  const id = getString(formData, "id");
  const locale = parseLocale(getString(formData, "locale"));
  const prismaLocale = toPrismaLocale(locale);

  const title = getString(formData, "title").trim();
  const slug = normalizeSlug(getString(formData, "slug") || title);
  const excerpt = getString(formData, "excerpt").trim();
  const content = getString(formData, "content");
  const seoTitle = getString(formData, "seoTitle").trim();
  const seoDescription = getString(formData, "seoDescription").trim();

  const status = parseStatus(
    getString(formData, "submitStatus") || getString(formData, "status")
  );

  const thumbnail = getString(formData, "thumbnail").trim();
  const icon = getString(formData, "icon").trim();
  const categoryId = getString(formData, "categoryId") || null;
  const sortOrder = parseSortOrder(getString(formData, "sortOrder"));
  const allowIndex = getBoolean(formData, "allowIndex");
  const publishedAt = parsePublishedAt(getString(formData, "publishedAt"), status);

  if (!title) {
    redirect(formErrorUrl(id, locale, "Tên dịch vụ là bắt buộc."));
  }

  if (!slug) {
    redirect(formErrorUrl(id, locale, "Slug dịch vụ là bắt buộc."));
  }

  let redirectTo = "";

  try {
    const savedService = await prisma.$transaction(async (tx) => {
      const service = id
        ? await tx.service.update({
            where: {
              id,
            },
            data: {
              status: status as any,
              thumbnail: thumbnail || null,
              icon: icon || null,
              sortOrder,
              categoryId,
              allowIndex,
              publishedAt,
            },
          })
        : await tx.service.create({
            data: {
              status: status as any,
              thumbnail: thumbnail || null,
              icon: icon || null,
              sortOrder,
              categoryId,
              allowIndex,
              publishedAt,
            },
          });

      await tx.serviceTranslation.upsert({
        where: {
          serviceId_locale: {
            serviceId: service.id,
            locale: prismaLocale,
          },
        },
        create: {
          serviceId: service.id,
          locale: prismaLocale,
          title,
          slug,
          excerpt: excerpt || null,
          content: content
            ? ({ html: content } as Prisma.InputJsonValue)
            : Prisma.JsonNull,
          seoTitle: seoTitle || null,
          seoDescription: seoDescription || null,
        },
        update: {
          title,
          slug,
          excerpt: excerpt || null,
          content: content
            ? ({ html: content } as Prisma.InputJsonValue)
            : Prisma.JsonNull,
          seoTitle: seoTitle || null,
          seoDescription: seoDescription || null,
        },
      });

      return service;
    });

    revalidatePath("/admin/services");
    revalidatePath(`/admin/services/${savedService.id}/edit`);

    redirectTo = formSuccessUrl(
      savedService.id,
      locale,
      id
        ? "Đã cập nhật dịch vụ."
        : "Đã tạo dịch vụ. Có thể tiếp tục chỉnh sửa."
    );
  } catch (error) {
    console.error("Save service error:", error);

    redirectTo = formErrorUrl(
      id,
      locale,
      "Lưu dịch vụ thất bại. Có thể slug đã tồn tại, vui lòng kiểm tra lại."
    );
  }

  redirect(redirectTo);
}

export async function deleteServiceAction(formData: FormData) {
  const id = getString(formData, "id");

  if (!id) {
    redirect(errorUrl("Thiếu ID dịch vụ cần xoá."));
  }

  const service = await prisma.service.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!service) {
    redirect(errorUrl("Dịch vụ không tồn tại hoặc đã bị xoá."));
  }

  await prisma.service.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/services");

  redirect(successUrl("Đã xoá dịch vụ."));
}