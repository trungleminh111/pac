import { Prisma } from "@prisma/client";
import {
  Locale,
  PageTemplate,
  PageType,
  PublishStatus,
} from "@prisma/client";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditPageForm from "./edit-page-form";

export type EditPageState = {
  ok: boolean;
  message: string;
};

function getPageType(value: FormDataEntryValue | null): PageType {
  const type = String(value || "NORMAL");

  if (["NORMAL", "POLICY", "LANDING"].includes(type)) {
    return type as PageType;
  }

  return PageType.NORMAL;
}

function getPageTemplate(value: FormDataEntryValue | null): PageTemplate {
  const template = String(value || "DEFAULT");

  if (["DEFAULT", "POLICY", "LANDING", "CONTACT", "ABOUT", "FAQ"].includes(template)) {
    return template as PageTemplate;
  }

  return PageTemplate.DEFAULT;
}

function getPublishStatus(value: FormDataEntryValue | null): PublishStatus {
  const status = String(value || "DRAFT");

  if (["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
    return status as PublishStatus;
  }

  return PublishStatus.DRAFT;
}

function contentToJson(content: string) {
  return {
    type: "doc",
    blocks: content
      .split(/\n+/)
      .map((text) => text.trim())
      .filter(Boolean)
      .map((text) => ({
        type: "paragraph",
        text,
      })),
  };
}

function safeJson(value: string, fallback: unknown) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

async function updatePage(
  id: string,
  _prevState: EditPageState,
  formData: FormData
): Promise<EditPageState> {
  "use server";

  const type = getPageType(formData.get("type"));
  const template = getPageTemplate(formData.get("template"));
  const status = getPublishStatus(formData.get("status"));

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const seoTitle = String(formData.get("seoTitle") || "").trim();
  const seoDescription = String(formData.get("seoDescription") || "").trim();
  const sections = safeJson(String(formData.get("sections") || "[]"), []);

  if (!title || !slug) {
    return { ok: false, message: "Vui lòng nhập tiêu đề và slug." };
  }

  try {
    await prisma.page.update({
      where: { id },
      data: {
        type,
        template,
        status,
        publishedAt: status === PublishStatus.PUBLISHED ? new Date() : null,
        sections: sections as Prisma.InputJsonValue,
        settings: {
          layout: "default",
        },
        translations: {
          upsert: {
            where: {
              pageId_locale: {
                pageId: id,
                locale: Locale.vi,
              },
            },
            update: {
              title,
              slug,
              excerpt: excerpt || null,
              content: contentToJson(content),
              seoTitle: seoTitle || null,
              seoDescription: seoDescription || null,
            },
            create: {
              locale: Locale.vi,
              title,
              slug,
              excerpt: excerpt || null,
              content: contentToJson(content),
              seoTitle: seoTitle || null,
              seoDescription: seoDescription || null,
            },
          },
        },
      },
    });

    return { ok: true, message: "Cập nhật page thành công." };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { ok: false, message: "Slug đã tồn tại." };
    }

    return { ok: false, message: "Có lỗi xảy ra khi cập nhật page." };
  }
}

export default async function EditPagePage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;

  const page = await prisma.page.findUnique({
    where: { id },
    include: {
      translations: true,
    },
  });

  if (!page) notFound();

  return <EditPageForm page={page} action={updatePage.bind(null, id)} />;
}