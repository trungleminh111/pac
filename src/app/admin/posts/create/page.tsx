import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import CreatePostForm from "./post-form";

export type CreatePostState = {
  ok: boolean;
  message: string;
};

async function createPost(
  _prevState: CreatePostState,
  formData: FormData
): Promise<CreatePostState> {
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

  const existed = await prisma.postTranslation.findUnique({
    where: {
      locale_slug: {
        locale,
        slug,
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
    await prisma.post.create({
      data: {
        status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
        thumbnail: thumbnail || null,
        isFeatured,
        allowIndex,
        categoryId: categoryId || null,
        publishedAt: status === "PUBLISHED" ? new Date() : null,

        translations: {
          create: {
            locale,
            title,
            slug,
            excerpt: excerpt || null,
            content: { html: content },
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
      message: "Có lỗi xảy ra khi tạo bài viết.",
    };
  }
}

export default async function CreatePostPage() {
  const categories = await prisma.category.findMany({
    where: {
      type: "POST",
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  return <CreatePostForm action={createPost} categories={categories} />;
}