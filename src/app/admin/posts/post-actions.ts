"use server";

import { prisma } from "@/lib/prisma";
import { Locale as PrismaLocale, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AdminLocale, AdminPostStatus } from "./post.type";

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

function parseStatus(value: string): AdminPostStatus {
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

function parsePublishedAt(value: string, status: AdminPostStatus) {
  if (status !== "PUBLISHED") return null;
  if (!value) return new Date();

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function parseTagNames(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[,\n]/g)
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

function successUrl(message: string) {
  return `/admin/posts?success=${encodeURIComponent(message)}`;
}

function errorUrl(message: string) {
  return `/admin/posts?error=${encodeURIComponent(message)}`;
}

function formSuccessUrl(id: string, locale: AdminLocale, message: string) {
  return `/admin/posts/${id}/edit?locale=${locale}&success=${encodeURIComponent(
    message
  )}`;
}

function formErrorUrl(id: string, locale: AdminLocale, message: string) {
  const encoded = encodeURIComponent(message);

  if (id) {
    return `/admin/posts/${id}/edit?locale=${locale}&error=${encoded}`;
  }

  return `/admin/posts/create?error=${encoded}`;
}

async function createTagsFromText({
  tx,
  names,
  locale,
}: {
  tx: Prisma.TransactionClient;
  names: string[];
  locale: AdminLocale;
}) {
  const tagIds: string[] = [];
  const prismaLocale = toPrismaLocale(locale);

  for (const name of names) {
    const slug = normalizeSlug(name);

    if (!slug) continue;

    let tag = await tx.tag.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        slug: true,
      },
    });

    if (!tag) {
      tag = await tx.tag.create({
        data: {
          slug,
          sortOrder: 0,
          isActive: true,
        },
        select: {
          id: true,
          slug: true,
        },
      });
    }

    await tx.tagTranslation.upsert({
      where: {
        tagId_locale: {
          tagId: tag.id,
          locale: prismaLocale,
        },
      },
      create: {
        tagId: tag.id,
        locale: prismaLocale,
        name,
        slug,
        description: null,
      },
      update: {
        name,
        slug,
      },
    });

    tagIds.push(tag.id);
  }

  return tagIds;
}

export async function savePostAction(formData: FormData) {
  const id = getString(formData, "id");
  const locale = parseLocale(getString(formData, "locale"));
  const prismaLocale = toPrismaLocale(locale);

  const title = getString(formData, "title").trim();
  const slug = normalizeSlug(getString(formData, "slug") || title);
  const excerpt = getString(formData, "excerpt").trim();
  const content = getString(formData, "content");
  const seoTitle = getString(formData, "seoTitle").trim();
  const seoDescription = getString(formData, "seoDescription").trim();

  const status = parseStatus(getString(formData, "status"));
  const thumbnail = getString(formData, "thumbnail").trim();
  const categoryId = getString(formData, "categoryId") || null;
  const isFeatured = getBoolean(formData, "isFeatured");
  const allowIndex = getBoolean(formData, "allowIndex");
  const publishedAt = parsePublishedAt(
    getString(formData, "publishedAt"),
    status
  );

  const selectedTagIds = formData
    .getAll("tagIds")
    .map((item) => String(item))
    .filter(Boolean);

  const newTagNames = parseTagNames(getString(formData, "newTags"));

  if (!title) {
    redirect(formErrorUrl(id, locale, "Tiêu đề bài viết là bắt buộc."));
  }

  if (!slug) {
    redirect(formErrorUrl(id, locale, "Slug bài viết là bắt buộc."));
  }

  let redirectTo = "";

  try {
    const savedPost = await prisma.$transaction(async (tx) => {
      const post = id
        ? await tx.post.update({
            where: {
              id,
            },
            data: {
              status: status as any,
              thumbnail: thumbnail || null,
              categoryId,
              isFeatured,
              allowIndex,
              publishedAt,
            },
          })
        : await tx.post.create({
            data: {
              status: status as any,
              thumbnail: thumbnail || null,
              categoryId,
              isFeatured,
              allowIndex,
              publishedAt,
            },
          });

      await tx.postTranslation.upsert({
        where: {
          postId_locale: {
            postId: post.id,
            locale: prismaLocale,
          },
        },
        create: {
          postId: post.id,
          locale: prismaLocale,
          title,
          slug,
          excerpt: excerpt || null,
          content: content
            ? ({ html: content } as Prisma.InputJsonValue)
            : Prisma.JsonNull,
          contentHtml: content || null,
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
          contentHtml: content || null,
          seoTitle: seoTitle || null,
          seoDescription: seoDescription || null,
        },
      });

      const createdTagIds = await createTagsFromText({
        tx,
        names: newTagNames,
        locale,
      });

      const cleanTagIds = Array.from(
        new Set([...selectedTagIds, ...createdTagIds])
      );

      await tx.postTag.deleteMany({
        where: {
          postId: post.id,
        },
      });

      if (cleanTagIds.length) {
        await tx.postTag.createMany({
          data: cleanTagIds.map((tagId, index) => ({
            postId: post.id,
            tagId,
            sortOrder: index,
          })),
          skipDuplicates: true,
        });
      }

      return post;
    });

    revalidatePath("/admin/posts");
    revalidatePath(`/admin/posts/${savedPost.id}/edit`);
    revalidatePath("/admin/tags");

    redirectTo = formSuccessUrl(
      savedPost.id,
      locale,
      id ? "Đã cập nhật bài viết." : "Đã tạo bài viết. Có thể tiếp tục chỉnh sửa."
    );
  } catch (error) {
    console.error("Save post error:", error);

    redirectTo = formErrorUrl(
      id,
      locale,
      "Lưu bài viết thất bại. Có thể slug đã tồn tại, vui lòng kiểm tra lại."
    );
  }

  redirect(redirectTo);
}

export async function deletePostAction(formData: FormData) {
  const id = getString(formData, "id");

  if (!id) {
    redirect(errorUrl("Thiếu ID bài viết cần xoá."));
  }

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!post) {
    redirect(errorUrl("Bài viết không tồn tại hoặc đã bị xoá."));
  }

  await prisma.post.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/posts");

  redirect(successUrl("Đã xoá bài viết."));
}