import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategoriesClient from "./categories-client";

export type CategoryState = {
  ok: boolean;
  message: string;
  nonce: number;
};

type CategoryType = "POST" | "PRODUCT" | "SERVICE" | "PROJECT";

function getType(value: FormDataEntryValue | null): CategoryType {
  const type = String(value || "POST");

  if (["POST", "PRODUCT", "SERVICE", "PROJECT"].includes(type)) {
    return type as CategoryType;
  }

  return "POST";
}

async function createCategory(
  _prevState: CategoryState,
  formData: FormData
): Promise<CategoryState> {
  "use server";

  const type = getType(formData.get("type"));
  const nameVi = String(formData.get("nameVi") || "").trim();
  const nameEn = String(formData.get("nameEn") || "").trim();
  const slug = String(formData.get("slug") || "").trim();

  if (!nameVi || !slug) {
    return {
      ok: false,
      message: "Vui lòng nhập tên danh mục và slug.",
      nonce: Date.now(),
    };
  }

  try {
    await prisma.category.create({
      data: {
        type,
        nameVi,
        nameEn: nameEn || null,
        slug,
        parentId: null,
        sortOrder: 0,
      },
    });

    revalidatePath("/admin/categories");

    return {
      ok: true,
      message: "Tạo danh mục thành công.",
      nonce: Date.now(),
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        ok: false,
        message: "Slug đã tồn tại trong loại danh mục này.",
        nonce: Date.now(),
      };
    }

    return {
      ok: false,
      message: "Có lỗi xảy ra khi tạo danh mục.",
      nonce: Date.now(),
    };
  }
}

async function deleteCategory(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const params = await searchParams;

  const q = params.q?.trim() || "";
  const type = params.type || "";

  const categories = await prisma.category.findMany({
    where: {
      ...(type ? { type: type as CategoryType } : {}),
      ...(q
        ? {
            OR: [
              { nameVi: { contains: q, mode: "insensitive" } },
              { nameEn: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      _count: {
        select: {
          posts: true,
          products: true,
          services: true,
          projects: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const stats = await prisma.category.groupBy({
    by: ["type"],
    _count: {
      id: true,
    },
  });

  return (
    <CategoriesClient
      categories={categories}
      stats={stats}
      q={q}
      activeType={type}
      action={createCategory}
      deleteAction={deleteCategory}
    />
  );
}