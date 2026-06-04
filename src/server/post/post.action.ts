"use server";

import { prisma } from "@/lib/prisma";
import type { Locale, PostFormState, PublishStatus } from "./post.type";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function parseContent(value: string) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return {
      html: value,
    };
  }
}

export async function createPostAction(
  prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const locale = getString(formData, "locale") as Locale;
  const title = getString(formData, "title");
  const slug = getString(formData, "slug");
  const excerpt = getString(formData, "excerpt");
  const content = parseContent(getString(formData, "content"));
  const seoTitle = getString(formData, "seoTitle");
  const seoDescription = getString(formData, "seoDescription");

  const status = getString(formData, "status") as PublishStatus;
  const thumbnail = getString(formData, "thumbnail");
  const categoryId = getString(formData, "categoryId");
  const authorId = getString(formData, "authorId");

  if (!title || !slug) {
    return {
      ok: false,
      message: "Vui lòng nhập tiêu đề bài viết và slug.",
    };
  }

  try {
    await prisma.post.create({
      data: {
        status: status || "DRAFT",
        thumbnail: thumbnail || null,
        categoryId: categoryId || null,
        authorId: authorId || null,
        allowIndex: formData.get("allowIndex") === "on",
        isFeatured: formData.get("isFeatured") === "on",
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
          },
        },
      },
    });

    return {
      ok: true,
      message: "Tạo bài viết thành công.",
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: "Không thể tạo bài viết. Có thể slug đã tồn tại.",
    };
  }
}

export async function updatePostAction(
  postId: string,
  prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const locale = getString(formData, "locale") as Locale;
  const title = getString(formData, "title");
  const slug = getString(formData, "slug");
  const excerpt = getString(formData, "excerpt");
  const content = parseContent(getString(formData, "content"));
  const seoTitle = getString(formData, "seoTitle");
  const seoDescription = getString(formData, "seoDescription");

  const status = getString(formData, "status") as PublishStatus;
  const thumbnail = getString(formData, "thumbnail");
  const categoryId = getString(formData, "categoryId");
  const authorId = getString(formData, "authorId");

  if (!title || !slug) {
    return {
      ok: false,
      message: "Vui lòng nhập tiêu đề bài viết và slug.",
    };
  }

  try {
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        status: status || "DRAFT",
        thumbnail: thumbnail || null,
        categoryId: categoryId || null,
        authorId: authorId || null,
        allowIndex: formData.get("allowIndex") === "on",
        isFeatured: formData.get("isFeatured") === "on",
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        translations: {
          upsert: {
            where: {
              postId_locale: {
                postId,
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
            },
            update: {
              title,
              slug,
              excerpt: excerpt || null,
              content,
              seoTitle: seoTitle || null,
              seoDescription: seoDescription || null,
            },
          },
        },
      },
    });

    return {
      ok: true,
      message: "Cập nhật bài viết thành công.",
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: "Không thể cập nhật bài viết. Có thể slug đã tồn tại.",
    };
  }
}

export async function deletePostAction(postId: string) {
  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
}