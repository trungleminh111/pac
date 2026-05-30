import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditPostForm from "./post-form";

export type EditPostState = {
  ok: boolean;
  message: string;
};

async function updatePost(
  id: string,
  _prevState: EditPostState,
  formData: FormData
): Promise<EditPostState> {
  "use server";

  const locale = String(formData.get("locale") || "vi") as "vi" | "en";
  const status = String(formData.get("status") || "DRAFT");
  const categoryId = String(formData.get("categoryId") || "");
  const thumbnail = String(formData.get("thumbnail") || "");
  const isFeatured = formData.get("isFeatured") === "on";
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
      message: "Vui lòng nhập tiêu đề và slug.",
    };
  }

  const existed = await prisma.postTranslation.findFirst({
    where: {
      locale,
      slug,
      postId: {
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
    await prisma.post.update({
      where: { id },
      data: {
        status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
        thumbnail: thumbnail || null,
        isFeatured,
        allowIndex,
        categoryId: categoryId || null,
        publishedAt: status === "PUBLISHED" ? new Date() : null,

        translations: {
          upsert: {
            where: {
              postId_locale: {
                postId: id,
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
      message: "Cập nhật bài viết thành công.",
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
      message: "Có lỗi xảy ra khi cập nhật bài viết.",
    };
  }
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      translations: true,
      category: true,
    },
  });

  if (!post) notFound();

  const translation = post.translations[0];

  const categories = await prisma.category.findMany({
    where: { type: "POST" },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <EditPostForm
      post={post}
      categories={categories}
      selectedLocale={translation?.locale || "vi"}
      action={updatePost.bind(null, id)}
    />
  );
}