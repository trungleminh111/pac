"use server";

import { prisma } from "@/lib/prisma";
import { AttributeInputType, Locale } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { attributeFormSchema } from "./attribute.schema";

function getBooleanValue(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function parseValuesJson(value: string) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function upsertAttributeTranslation({
  attributeId,
  locale,
  name,
}: {
  attributeId: string;
  locale: Locale;
  name: string;
}) {
  await prisma.attributeTranslation.upsert({
    where: {
      attributeId_locale: {
        attributeId,
        locale,
      },
    },
    create: {
      attributeId,
      locale,
      name,
    },
    update: {
      name,
    },
  });
}

async function upsertAttributeValueTranslation({
  attributeValueId,
  locale,
  name,
}: {
  attributeValueId: string;
  locale: Locale;
  name: string;
}) {
  await prisma.attributeValueTranslation.upsert({
    where: {
      attributeValueId_locale: {
        attributeValueId,
        locale,
      },
    },
    create: {
      attributeValueId,
      locale,
      name,
    },
    update: {
      name,
    },
  });
}

export async function saveAttributeAction(formData: FormData) {
  const locale = getStringValue(formData, "locale") || Locale.vi;
  const mode = getStringValue(formData, "mode");
  const id = getStringValue(formData, "id");
  const valuesJson = getStringValue(formData, "valuesJson");

  const parsed = attributeFormSchema.safeParse({
    id: id || undefined,
    locale,
    code: getStringValue(formData, "code"),
    type: getStringValue(formData, "type") as AttributeInputType,
    nameVi: getStringValue(formData, "nameVi"),
    nameEn: getStringValue(formData, "nameEn"),
    isFilter: getBooleanValue(formData, "isFilter"),
    isVariantOption: getBooleanValue(formData, "isVariantOption"),
    sortOrder: getStringValue(formData, "sortOrder"),
    values: parseValuesJson(valuesJson),
  });

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => issue.message)
      .join(", ");

    throw new Error(message || "Dữ liệu thuộc tính không hợp lệ");
  }

  const data = parsed.data;

  const savedAttribute = await prisma.$transaction(async (tx) => {
    const attribute =
      mode === "edit" && data.id
        ? await tx.attribute.update({
            where: { id: data.id },
            data: {
              code: data.code,
              type: data.type,
              isFilter: data.isFilter,
              isVariantOption: data.isVariantOption,
              sortOrder: data.sortOrder,
            },
          })
        : await tx.attribute.create({
            data: {
              code: data.code,
              type: data.type,
              isFilter: data.isFilter,
              isVariantOption: data.isVariantOption,
              sortOrder: data.sortOrder,
            },
          });

    await tx.attributeTranslation.upsert({
      where: {
        attributeId_locale: {
          attributeId: attribute.id,
          locale: Locale.vi,
        },
      },
      create: {
        attributeId: attribute.id,
        locale: Locale.vi,
        name: data.nameVi,
      },
      update: {
        name: data.nameVi,
      },
    });

    await tx.attributeTranslation.upsert({
      where: {
        attributeId_locale: {
          attributeId: attribute.id,
          locale: Locale.en,
        },
      },
      create: {
        attributeId: attribute.id,
        locale: Locale.en,
        name: data.nameEn || data.nameVi,
      },
      update: {
        name: data.nameEn || data.nameVi,
      },
    });

    const existingValues = await tx.attributeValue.findMany({
      where: {
        attributeId: attribute.id,
      },
      select: {
        id: true,
      },
    });

    const keptValueIds: string[] = [];

    for (const [index, value] of data.values.entries()) {
      const sortOrder = value.sortOrder || index + 1;

      const savedValue =
        value.id && existingValues.some((item) => item.id === value.id)
          ? await tx.attributeValue.update({
              where: {
                id: value.id,
              },
              data: {
                code: value.code,
                colorHex:
                  data.type === AttributeInputType.COLOR
                    ? value.colorHex || null
                    : null,
                image: value.image || null,
                sortOrder,
              },
            })
          : await tx.attributeValue.upsert({
              where: {
                attributeId_code: {
                  attributeId: attribute.id,
                  code: value.code,
                },
              },
              create: {
                attributeId: attribute.id,
                code: value.code,
                colorHex:
                  data.type === AttributeInputType.COLOR
                    ? value.colorHex || null
                    : null,
                image: value.image || null,
                sortOrder,
              },
              update: {
                colorHex:
                  data.type === AttributeInputType.COLOR
                    ? value.colorHex || null
                    : null,
                image: value.image || null,
                sortOrder,
              },
            });

      keptValueIds.push(savedValue.id);

      await tx.attributeValueTranslation.upsert({
        where: {
          attributeValueId_locale: {
            attributeValueId: savedValue.id,
            locale: Locale.vi,
          },
        },
        create: {
          attributeValueId: savedValue.id,
          locale: Locale.vi,
          name: value.nameVi,
        },
        update: {
          name: value.nameVi,
        },
      });

      await tx.attributeValueTranslation.upsert({
        where: {
          attributeValueId_locale: {
            attributeValueId: savedValue.id,
            locale: Locale.en,
          },
        },
        create: {
          attributeValueId: savedValue.id,
          locale: Locale.en,
          name: value.nameEn || value.nameVi,
        },
        update: {
          name: value.nameEn || value.nameVi,
        },
      });
    }

    const removedValues = existingValues.filter(
      (item) => !keptValueIds.includes(item.id)
    );

    for (const removedValue of removedValues) {
      const productUsageCount = await tx.productAttributeValue.count({
        where: {
          attributeValueId: removedValue.id,
        },
      });

      const variantUsageCount = await tx.productVariantAttributeValue.count({
        where: {
          attributeValueId: removedValue.id,
        },
      });

      if (productUsageCount > 0 || variantUsageCount > 0) {
        throw new Error(
          "Không thể xoá giá trị thuộc tính đang được sản phẩm hoặc biến thể sử dụng"
        );
      }

      await tx.attributeValue.delete({
        where: {
          id: removedValue.id,
        },
      });
    }

    return attribute;
  });

  revalidatePath(`/admin/attributes`);
  revalidatePath(`/admin/attributes/${savedAttribute.id}/edit`);

  redirect(`/admin/attributes`);
}

export async function deleteAttributeAction(formData: FormData) {
  const id = getStringValue(formData, "id");
  const locale = getStringValue(formData, "locale") || Locale.vi;

  if (!id) {
    throw new Error("Thiếu ID thuộc tính");
  }

  const productUsageCount = await prisma.productAttributeValue.count({
    where: {
      attributeId: id,
    },
  });

  const variantUsageCount = await prisma.productVariantAttributeValue.count({
    where: {
      attributeId: id,
    },
  });

  const categoryUsageCount = await prisma.categoryAttribute.count({
    where: {
      attributeId: id,
    },
  });

  if (productUsageCount > 0 || variantUsageCount > 0 || categoryUsageCount > 0) {
    throw new Error(
      "Không thể xoá thuộc tính đang được category, sản phẩm hoặc biến thể sử dụng"
    );
  }

  await prisma.attribute.delete({
    where: {
      id,
    },
  });

  revalidatePath(`/admin/attributes`);
  redirect(`/admin/attributes`);
}

export async function toggleAttributeFilterAction(formData: FormData) {
  const id = getStringValue(formData, "id");
  const locale = getStringValue(formData, "locale") || Locale.vi;

  const attribute = await prisma.attribute.findUnique({
    where: { id },
    select: {
      isFilter: true,
    },
  });

  if (!attribute) {
    throw new Error("Không tìm thấy thuộc tính");
  }

  await prisma.attribute.update({
    where: { id },
    data: {
      isFilter: !attribute.isFilter,
    },
  });

  revalidatePath(`/admin/attributes`);
}

export async function toggleAttributeVariantAction(formData: FormData) {
  const id = getStringValue(formData, "id");
  const locale = getStringValue(formData, "locale") || Locale.vi;

  const attribute = await prisma.attribute.findUnique({
    where: { id },
    select: {
      isVariantOption: true,
    },
  });

  if (!attribute) {
    throw new Error("Không tìm thấy thuộc tính");
  }

  await prisma.attribute.update({
    where: { id },
    data: {
      isVariantOption: !attribute.isVariantOption,
    },
  });

  revalidatePath(`/admin/attributes`);
}