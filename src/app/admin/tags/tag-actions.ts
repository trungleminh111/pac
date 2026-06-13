"use server";

import { prisma } from "@/lib/prisma";
import { Locale } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getBoolean(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "1";
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

function successUrl(message: string) {
  return `/admin/tags?success=${encodeURIComponent(message)}`;
}

function errorUrl(message: string) {
  return `/admin/tags?error=${encodeURIComponent(message)}`;
}

export async function saveTagAction(formData: FormData) {
  const id = getString(formData, "id");
  const nameVi = getString(formData, "nameVi").trim();
  const nameEn = getString(formData, "nameEn").trim();

  const slugVi = normalizeSlug(getString(formData, "slugVi") || nameVi);
  const slugEn = normalizeSlug(getString(formData, "slugEn") || nameEn);
  const baseSlug = normalizeSlug(getString(formData, "slug") || slugVi || slugEn);

  const descriptionVi = getString(formData, "descriptionVi").trim();
  const descriptionEn = getString(formData, "descriptionEn").trim();
  const sortOrderValue = Number(getString(formData, "sortOrder") || 0);
  const sortOrder = Number.isFinite(sortOrderValue) ? sortOrderValue : 0;
  const isActive = getBoolean(formData, "isActive");

  if (!nameVi) {
    redirect(errorUrl("Tên tag Tiếng Việt là bắt buộc."));
  }

  if (!baseSlug) {
    redirect(errorUrl("Slug tag là bắt buộc."));
  }

  let redirectTo = "";

  try {
    const savedTag = await prisma.$transaction(async (tx) => {
      const tag = id
        ? await tx.tag.update({
            where: {
              id,
            },
            data: {
              slug: baseSlug,
              sortOrder,
              isActive,
            },
          })
        : await tx.tag.create({
            data: {
              slug: baseSlug,
              sortOrder,
              isActive,
            },
          });

      await tx.tagTranslation.upsert({
        where: {
          tagId_locale: {
            tagId: tag.id,
            locale: Locale.vi,
          },
        },
        create: {
          tagId: tag.id,
          locale: Locale.vi,
          name: nameVi,
          slug: slugVi || baseSlug,
          description: descriptionVi || null,
        },
        update: {
          name: nameVi,
          slug: slugVi || baseSlug,
          description: descriptionVi || null,
        },
      });

      if (nameEn || slugEn || descriptionEn) {
        await tx.tagTranslation.upsert({
          where: {
            tagId_locale: {
              tagId: tag.id,
              locale: Locale.en,
            },
          },
          create: {
            tagId: tag.id,
            locale: Locale.en,
            name: nameEn || nameVi,
            slug: slugEn || slugVi || baseSlug,
            description: descriptionEn || null,
          },
          update: {
            name: nameEn || nameVi,
            slug: slugEn || slugVi || baseSlug,
            description: descriptionEn || null,
          },
        });
      }

      return tag;
    });

    revalidatePath("/admin/tags");
    revalidatePath(`/admin/tags/${savedTag.id}/edit`);

    redirectTo = successUrl(id ? "Đã cập nhật tag." : "Đã tạo tag.");
  } catch (error) {
    console.error("Save tag error:", error);

    redirectTo = errorUrl(
      "Lưu tag thất bại. Có thể slug đã tồn tại, vui lòng kiểm tra lại."
    );
  }

  redirect(redirectTo);
}

export async function deleteTagAction(formData: FormData) {
  const id = getString(formData, "id");

  if (!id) {
    redirect(errorUrl("Thiếu ID tag cần xoá."));
  }

  const tag = await prisma.tag.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      posts: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!tag) {
    redirect(errorUrl("Tag không tồn tại hoặc đã bị xoá."));
  }

  if (tag.posts.length > 0) {
    redirect(
      errorUrl(
        `Không thể xoá tag này vì đang được ${tag.posts.length} bài viết sử dụng. Hãy gỡ tag khỏi bài viết trước.`
      )
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.tagTranslation.deleteMany({
      where: {
        tagId: id,
      },
    });

    await tx.tag.delete({
      where: {
        id,
      },
    });
  });

  revalidatePath("/admin/tags");

  redirect(successUrl("Đã xoá tag."));
}