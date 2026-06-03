import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditCategoryForm from "./edit-category-form";

export type EditCategoryState = {
  ok: boolean;
  message: string;
};

type CategoryType = "POST" | "PAGE" | "PRODUCT" | "SERVICE" | "PROJECT";

function getType(value: FormDataEntryValue | null): CategoryType {
  const type = String(value || "POST");

  if (["POST", "PAGE", "PRODUCT", "SERVICE", "PROJECT"].includes(type)) {
    return type as CategoryType;
  }

  return "POST";
}

async function updateCategory(
  id: string,
  _prevState: EditCategoryState,
  formData: FormData
): Promise<EditCategoryState> {
  "use server";

  const type = getType(formData.get("type"));
  const nameVi = String(formData.get("nameVi") || "").trim();
  const nameEn = String(formData.get("nameEn") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const detailTemplate = String(
    formData.get("detailTemplate") || "default"
  ).trim();

  if (!nameVi || !slug) {
    return { ok: false, message: "Vui lòng nhập tên danh mục và slug." };
  }

  try {
    await prisma.category.update({
      where: { id },
      data: {
        type,
        nameVi,
        nameEn: nameEn || null,
        slug,
        detailTemplate: type === "PRODUCT" ? detailTemplate : "default",
        parentId: null,
        sortOrder: 0,
      },
    });

    return { ok: true, message: "Cập nhật danh mục thành công." };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { ok: false, message: "Slug đã tồn tại trong loại danh mục này." };
    }

    return { ok: false, message: "Có lỗi xảy ra khi cập nhật danh mục." };
  }
}

export default async function EditCategoryPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) notFound();

  return (
    <EditCategoryForm
      category={category}
      action={updateCategory.bind(null, id)}
    />
  );
}