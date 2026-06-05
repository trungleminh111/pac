import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import ImportProductsForm from "./import-form";
import * as XLSX from "xlsx";

export type ImportState = {
  ok: boolean;
  message: string;
};

function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getText(row: Record<string, unknown>, key: string) {
  return String(row[key] || "").trim();
}

function getBool(row: Record<string, unknown>, key: string, defaultValue = false) {
  const value = String(row[key] || "").trim().toLowerCase();

  if (!value) return defaultValue;

  return ["true", "1", "yes", "y", "on", "có", "co"].includes(value);
}

async function importProducts(formData: FormData): Promise<ImportState> {
  "use server";

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return {
      ok: false,
      message: "Vui lòng chọn file Excel.",
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  if (!sheet) {
    return {
      ok: false,
      message: "Không tìm thấy sheet trong file Excel.",
    };
  }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
  });

  if (rows.length === 0) {
    return {
      ok: false,
      message: "File Excel không có dữ liệu.",
    };
  }

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const rowNumber = index + 2;

    const localeRaw = getText(row, "locale") || "vi";
    const locale = localeRaw === "en" ? "en" : "vi";

    const title = getText(row, "title");
    const slugRaw = getText(row, "slug");
    const slug = slugRaw ? toSlug(slugRaw) : toSlug(title);

    const excerpt = getText(row, "excerpt");
    const content = getText(row, "content");

    const sku = getText(row, "sku");
    const priceRaw = getText(row, "price").replace(/\D/g, "");
    const origin = getText(row, "origin");
    const color = getText(row, "color");
    const material = getText(row, "material");
    const size = getText(row, "size");
    const thickness = getText(row, "thickness");
    const density = getText(row, "density");
    const hardness = getText(row, "hardness");

    const seoTitle = getText(row, "seoTitle");
    const seoDescription = getText(row, "seoDescription");

    const statusRaw = getText(row, "status").toUpperCase();
    const status = ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(statusRaw)
      ? (statusRaw as "DRAFT" | "PUBLISHED" | "ARCHIVED")
      : "DRAFT";

    const categoryId = getText(row, "categoryId");
    const isFeatured = getBool(row, "isFeatured", false);
    const allowIndex = getBool(row, "allowIndex", true);

    if (!title || !slug) {
      errorCount++;
      errors.push(`Dòng ${rowNumber}: Thiếu title hoặc slug.`);
      continue;
    }

    try {
      const existed = await prisma.productTranslation.findFirst({
        where: {
          locale,
          slug,
        },
      });

      if (existed) {
        errorCount++;
        errors.push(`Dòng ${rowNumber}: Slug "${slug}" đã tồn tại.`);
        continue;
      }

      await prisma.product.create({
        data: {
          status,
          sku: sku || null,
          price: priceRaw ? new Prisma.Decimal(priceRaw) : null,
          thumbnail: null,
          gallery: [],
          origin: origin || null,
          color: color || null,
          material: material || null,
          size: size || null,
          thickness: thickness || null,
          density: density || null,
          hardness: hardness || null,
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
              content: content ? { html: content } : undefined,
              seoTitle: seoTitle || null,
              seoDescription: seoDescription || null,
            },
          },
        },
      });

      successCount++;
    } catch (error) {
      console.error(error);
      errorCount++;
      errors.push(`Dòng ${rowNumber}: Import thất bại.`);
    }
  }

  revalidatePath("/admin/products");

  return {
    ok: errorCount === 0,
    message: `Import thành công ${successCount} sản phẩm. Lỗi ${errorCount} dòng.${
      errors.length ? "\n" + errors.slice(0, 10).join("\n") : ""
    }`,
  };
}

export default function ImportProductsPage() {
  return <ImportProductsForm action={importProducts} />;
}