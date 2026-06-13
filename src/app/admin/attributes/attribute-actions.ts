"use server";

import { prisma } from "@/lib/prisma";
import { AttributeInputType, Locale } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { attributeFormSchema } from "./attribute.schema";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getBoolean(formData: FormData, key: string) {
  const value = formData.get(key);

  return value === "on" || value === "true" || value === "1";
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

function successUrl(message: string) {
  return `/admin/attributes?success=${encodeURIComponent(message)}`;
}

function errorUrl(message: string) {
  return `/admin/attributes?error=${encodeURIComponent(message)}`;
}

export async function saveAttributeAction(formData: FormData) {
  const rawValues = parseValuesJson(getString(formData, "valuesJson"));

  const parsed = attributeFormSchema.safeParse({
    id: getString(formData, "id") || null,
    locale: Locale.vi,
    code: getString(formData, "code"),
    type: getString(formData, "type") as AttributeInputType,
    nameVi: getString(formData, "nameVi"),
    nameEn: getString(formData, "nameEn"),
    isFilter: getBoolean(formData, "isFilter"),
    isVariantOption: getBoolean(formData, "isVariantOption"),
    sortOrder: getString(formData, "sortOrder") || 0,
    values: rawValues,
  });

  if (!parsed.success) {
    redirect(
      errorUrl(
        parsed.error.issues[0]?.message ||
          "Dữ liệu thuộc tính chưa hợp lệ. Vui lòng kiểm tra lại."
      )
    );
  }

  const data = parsed.data;
  const id = data.id || "";

  const shouldManageValues =
    data.type === AttributeInputType.SELECT ||
    data.type === AttributeInputType.MULTI_SELECT ||
    data.type === AttributeInputType.COLOR;

  let savedAttributeId = "";

  try {
    const savedAttribute = await prisma.$transaction(async (tx) => {
      const attribute = id
        ? await tx.attribute.update({
            where: {
              id,
            },
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

      if (data.nameEn?.trim()) {
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
            name: data.nameEn.trim(),
          },
          update: {
            name: data.nameEn.trim(),
          },
        });
      }

      if (!shouldManageValues) {
        const valueIds = await tx.attributeValue.findMany({
          where: {
            attributeId: attribute.id,
          },
          select: {
            id: true,
          },
        });

        const ids = valueIds.map((item) => item.id);

        if (ids.length) {
          const productUsageCount = await tx.productAttributeValue.count({
            where: {
              attributeValueId: {
                in: ids,
              },
            },
          });

          const variantUsageCount = await tx.productVariantAttributeValue.count({
            where: {
              attributeValueId: {
                in: ids,
              },
            },
          });

          if (productUsageCount === 0 && variantUsageCount === 0) {
            await tx.attributeValueTranslation.deleteMany({
              where: {
                attributeValueId: {
                  in: ids,
                },
              },
            });

            await tx.attributeValue.deleteMany({
              where: {
                id: {
                  in: ids,
                },
              },
            });
          }
        }

        return attribute;
      }

      const incomingValues = data.values || [];
      const incomingExistingIds = incomingValues
        .map((item) => item.id || "")
        .filter(Boolean);

      if (id) {
        const existingValues = await tx.attributeValue.findMany({
          where: {
            attributeId: attribute.id,
          },
          select: {
            id: true,
          },
        });

        const removedIds = existingValues
          .map((item) => item.id)
          .filter((valueId) => !incomingExistingIds.includes(valueId));

        if (removedIds.length) {
          const productUsageCount = await tx.productAttributeValue.count({
            where: {
              attributeValueId: {
                in: removedIds,
              },
            },
          });

          const variantUsageCount = await tx.productVariantAttributeValue.count({
            where: {
              attributeValueId: {
                in: removedIds,
              },
            },
          });

          if (productUsageCount > 0 || variantUsageCount > 0) {
            throw new Error(
              "Không thể xoá option đang được sản phẩm hoặc biến thể sử dụng."
            );
          }

          await tx.attributeValueTranslation.deleteMany({
            where: {
              attributeValueId: {
                in: removedIds,
              },
            },
          });

          await tx.attributeValue.deleteMany({
            where: {
              id: {
                in: removedIds,
              },
            },
          });
        }
      }

      for (const value of incomingValues) {
        const valueId = value.id || "";

        const savedValue = valueId
          ? await tx.attributeValue.update({
              where: {
                id: valueId,
              },
              data: {
                code: value.code,
                colorHex: value.colorHex?.trim() || null,
                image: value.image?.trim() || null,
                sortOrder: value.sortOrder,
              },
            })
          : await tx.attributeValue.create({
              data: {
                attributeId: attribute.id,
                code: value.code,
                colorHex: value.colorHex?.trim() || null,
                image: value.image?.trim() || null,
                sortOrder: value.sortOrder,
              },
            });

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

        if (value.nameEn?.trim()) {
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
              name: value.nameEn.trim(),
            },
            update: {
              name: value.nameEn.trim(),
            },
          });
        }
      }

      return attribute;
    });

    savedAttributeId = savedAttribute.id;
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Lưu thuộc tính thất bại. Có thể mã thuộc tính hoặc mã option đã tồn tại.";

    redirect(errorUrl(message));
  }

  revalidatePath("/admin/attributes");
  revalidatePath(`/admin/attributes/${savedAttributeId}/edit`);
  redirect(successUrl(id ? "Đã cập nhật thuộc tính." : "Đã tạo thuộc tính."));
}

export async function deleteAttributeAction(formData: FormData) {
  const id = String(formData.get("id") || "");

  if (!id) {
    redirect(errorUrl("Thiếu ID thuộc tính cần xoá."));
  }

  const attribute = await prisma.attribute.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      code: true,
      translations: {
        select: {
          locale: true,
          name: true,
        },
      },
    },
  });

  if (!attribute) {
    redirect(errorUrl("Thuộc tính không tồn tại hoặc đã bị xoá."));
  }

  const [productUsageCount, variantUsageCount, categoryUsageCount] =
    await Promise.all([
      prisma.productAttributeValue.count({
        where: {
          attributeId: id,
        },
      }),
      prisma.productVariantAttributeValue.count({
        where: {
          attributeValue: {
            attributeId: id,
          },
        },
      }),
      prisma.categoryAttribute.count({
        where: {
          attributeId: id,
        },
      }),
    ]);

  if (
    productUsageCount > 0 ||
    variantUsageCount > 0 ||
    categoryUsageCount > 0
  ) {
    const details = [
      categoryUsageCount > 0 ? `${categoryUsageCount} danh mục` : "",
      productUsageCount > 0 ? `${productUsageCount} sản phẩm` : "",
      variantUsageCount > 0 ? `${variantUsageCount} biến thể` : "",
    ]
      .filter(Boolean)
      .join(", ");

    redirect(
      errorUrl(
        `Không thể xoá thuộc tính này vì đang được sử dụng bởi ${details}. Hãy gỡ thuộc tính khỏi danh mục/sản phẩm trước.`
      )
    );
  }

  await prisma.$transaction(async (tx) => {
    const values = await tx.attributeValue.findMany({
      where: {
        attributeId: id,
      },
      select: {
        id: true,
      },
    });

    const valueIds = values.map((item) => item.id);

    if (valueIds.length) {
      await tx.attributeValueTranslation.deleteMany({
        where: {
          attributeValueId: {
            in: valueIds,
          },
        },
      });

      await tx.attributeValue.deleteMany({
        where: {
          id: {
            in: valueIds,
          },
        },
      });
    }

    await tx.attributeTranslation.deleteMany({
      where: {
        attributeId: id,
      },
    });

    await tx.attribute.delete({
      where: {
        id,
      },
    });
  });

  revalidatePath("/admin/attributes");
  redirect(successUrl("Đã xoá thuộc tính."));
}

export async function toggleAttributeFilterAction(formData: FormData) {
  const id = String(formData.get("id") || "");

  if (!id) {
    redirect(errorUrl("Thiếu ID thuộc tính cần cập nhật."));
  }

  const attribute = await prisma.attribute.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      isFilter: true,
    },
  });

  if (!attribute) {
    redirect(errorUrl("Thuộc tính không tồn tại hoặc đã bị xoá."));
  }

  await prisma.attribute.update({
    where: {
      id,
    },
    data: {
      isFilter: !attribute.isFilter,
    },
  });

  revalidatePath("/admin/attributes");
  redirect(successUrl("Đã cập nhật trạng thái lọc."));
}

export async function toggleAttributeVariantAction(formData: FormData) {
  const id = String(formData.get("id") || "");

  if (!id) {
    redirect(errorUrl("Thiếu ID thuộc tính cần cập nhật."));
  }

  const attribute = await prisma.attribute.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      isVariantOption: true,
    },
  });

  if (!attribute) {
    redirect(errorUrl("Thuộc tính không tồn tại hoặc đã bị xoá."));
  }

  await prisma.attribute.update({
    where: {
      id,
    },
    data: {
      isVariantOption: !attribute.isVariantOption,
    },
  });

  revalidatePath("/admin/attributes");
  redirect(successUrl("Đã cập nhật trạng thái biến thể."));
}