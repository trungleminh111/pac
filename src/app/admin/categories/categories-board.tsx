"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  deleteCategoryAction,
  reorderCategoriesAction,
} from "./category-actions";
import type { AdminCategoryListItem } from "./category.type";

type Props = {
  categories: AdminCategoryListItem[];
};

type DragState = {
  id: string;
  bucketKey: string;
} | null;

const GROUPS = [
  {
    type: "PRODUCT",
    title: "Sản phẩm",
    helper: "Đá, gạch, vật tư, thiết bị ngành đá",
    tone: "blue",
  },
  {
    type: "POST",
    title: "Bài viết",
    helper: "Tin tức, kiến thức, hướng dẫn",
    tone: "green",
  },
  {
    type: "PROJECT",
    title: "Dự án",
    helper: "Công trình, case study, portfolio",
    tone: "purple",
  },
  {
    type: "SERVICE",
    title: "Dịch vụ",
    helper: "Thi công, tư vấn, gia công",
    tone: "amber",
  },
  {
    type: "PAGE",
    title: "Trang",
    helper: "Nhóm trang tĩnh nếu cần",
    tone: "gray",
  },
] as const;

function getGroupMeta(type: string) {
  return (
    GROUPS.find((group) => group.type === type) || {
      type,
      title: type,
      helper: "Nhóm category khác",
      tone: "gray",
    }
  );
}

function getBucketKey(item: AdminCategoryListItem) {
  return `${item.type}::${item.parentId || "root"}`;
}

function sortCategories(items: AdminCategoryListItem[]) {
  return [...items].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;

    const aName = a.nameVi || a.slug;
    const bName = b.nameVi || b.slug;

    return aName.localeCompare(bName, "vi");
  });
}

function getTemplateLabel(detailTemplate: string) {
  if (detailTemplate === "page2") return "Giao diện nổi bật";
  return "Giao diện mặc định";
}

function getTemplateTone(detailTemplate: string) {
  if (detailTemplate === "page2") return "purple";
  return "gray";
}

function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "green" | "blue" | "gray" | "red" | "amber" | "purple";
}) {
  const className =
    tone === "green"
      ? "border-green-200 bg-green-50 text-green-700"
      : tone === "blue"
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : tone === "red"
          ? "border-red-200 bg-red-50 text-red-700"
          : tone === "amber"
            ? "border-amber-200 bg-amber-50 text-amber-700"
            : tone === "purple"
              ? "border-purple-200 bg-purple-50 text-purple-700"
              : tone === "gray"
                ? "border-gray-200 bg-gray-50 text-gray-600"
                : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

function CategoryCard({
  item,
  bucketKey,
  draggedId,
  onDragStart,
  onDropOnItem,
}: {
  item: AdminCategoryListItem;
  bucketKey: string;
  draggedId: string | null;
  onDragStart: (id: string, bucketKey: string) => void;
  onDropOnItem: (targetId: string, bucketKey: string) => void;
}) {
  const isDragging = draggedId === item.id;

  return (
    <div
      draggable
      onDragStart={() => onDragStart(item.id, bucketKey)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={() => onDropOnItem(item.id, bucketKey)}
      className={`group grid gap-3 rounded-xl border bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md md:grid-cols-[34px_1fr_100px_150px] md:items-center ${
        isDragging ? "opacity-40 ring-2 ring-blue-300" : ""
      }`}
    >
      <div
        title="Kéo để đổi thứ tự"
        className="flex h-8 w-8 cursor-grab items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 group-active:cursor-grabbing"
      >
        ⋮⋮
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="font-semibold text-slate-900">
            {item.nameVi || item.slug}
          </div>

          {!item.isActive && <Badge tone="red">Tạm ẩn</Badge>}

          {item.childrenCount > 0 && (
            <Badge tone="gray">{item.childrenCount} danh mục con</Badge>
          )}

          <Badge tone={getTemplateTone(item.detailTemplate) as "gray" | "purple"}>
            {getTemplateLabel(item.detailTemplate)}
          </Badge>
        </div>

        <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
          <code className="rounded bg-slate-100 px-1.5 py-0.5">
            {item.slug}
          </code>

          {item.nameEn && <span>{item.nameEn}</span>}

          {item.parentName && <span>Cha: {item.parentName}</span>}
        </div>
      </div>

      <div className="text-sm text-slate-600">
        <div className="text-xs text-slate-400">Thứ tự</div>
        <div className="font-semibold text-slate-800">{item.sortOrder}</div>
      </div>

      <div className="flex justify-start gap-2 md:justify-end">
        <Link
          href={`/admin/categories/${item.id}/edit`}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
        >
          Sửa
        </Link>

        <form action={deleteCategoryAction}>
          <input type="hidden" name="id" value={item.id} />

          <button
            type="submit"
            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            Xoá
          </button>
        </form>
      </div>
    </div>
  );
}

function BucketSection({
  title,
  helper,
  bucketKey,
  items,
  draggedId,
  onDragStart,
  onDropOnItem,
  onDropToEnd,
}: {
  title: string;
  helper?: string;
  bucketKey: string;
  items: AdminCategoryListItem[];
  draggedId: string | null;
  onDragStart: (id: string, bucketKey: string) => void;
  onDropOnItem: (targetId: string, bucketKey: string) => void;
  onDropToEnd: (bucketKey: string) => void;
}) {
  const sortedItems = sortCategories(items);

  if (!sortedItems.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            {title}
          </h3>

          {helper && <p className="mt-1 text-xs text-slate-500">{helper}</p>}
        </div>

        <Badge tone="gray">{sortedItems.length} danh mục</Badge>
      </div>

      <div className="space-y-3">
        {sortedItems.map((item) => (
          <CategoryCard
            key={item.id}
            item={item}
            bucketKey={bucketKey}
            draggedId={draggedId}
            onDragStart={onDragStart}
            onDropOnItem={onDropOnItem}
          />
        ))}

        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => onDropToEnd(bucketKey)}
          className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-3 text-center text-xs text-slate-400"
        >
          Thả vào đây để đưa xuống cuối nhóm
        </div>
      </div>
    </div>
  );
}

export function CategoriesBoard({ categories }: Props) {
  const [items, setItems] = useState<AdminCategoryListItem[]>(categories);
  const [dragged, setDragged] = useState<DragState>(null);
  const [dirty, setDirty] = useState(false);

  const groupedTypes = useMemo(() => {
    const existingTypes = Array.from(new Set(items.map((item) => item.type)));

    const ordered = GROUPS.map((group) => group.type).filter((type) =>
      existingTypes.includes(type as any)
    );

    const rest = existingTypes.filter(
      (type) => !ordered.includes(type as any)
    );

    return [...ordered, ...rest];
  }, [items]);

  const reorderItemsJson = useMemo(
    () =>
      JSON.stringify(
        items.map((item) => ({
          id: item.id,
          sortOrder: item.sortOrder,
        }))
      ),
    [items]
  );

  function reorderInBucket({
    draggedId,
    targetId,
    bucketKey,
    mode,
  }: {
    draggedId: string;
    targetId?: string;
    bucketKey: string;
    mode: "before" | "end";
  }) {
    const draggedItem = items.find((item) => item.id === draggedId);
    if (!draggedItem) return;

    const draggedBucketKey = getBucketKey(draggedItem);
    if (draggedBucketKey !== bucketKey) return;

    const bucketItems = sortCategories(
      items.filter((item) => getBucketKey(item) === bucketKey)
    );

    const withoutDragged = bucketItems.filter((item) => item.id !== draggedId);

    if (mode === "before" && targetId) {
      const targetIndex = withoutDragged.findIndex(
        (item) => item.id === targetId
      );

      if (targetIndex < 0) return;

      withoutDragged.splice(targetIndex, 0, draggedItem);
    } else {
      withoutDragged.push(draggedItem);
    }

    const sortMap = new Map(
      withoutDragged.map((item, index) => [item.id, (index + 1) * 10])
    );

    setItems((current) =>
      current.map((item) => {
        const nextSortOrder = sortMap.get(item.id);

        if (!nextSortOrder) return item;

        return {
          ...item,
          sortOrder: nextSortOrder,
        };
      })
    );

    setDirty(true);
  }

  function handleDragStart(id: string, bucketKey: string) {
    setDragged({
      id,
      bucketKey,
    });
  }

  function handleDropOnItem(targetId: string, bucketKey: string) {
    if (!dragged) return;
    if (dragged.bucketKey !== bucketKey) return;
    if (dragged.id === targetId) return;

    reorderInBucket({
      draggedId: dragged.id,
      targetId,
      bucketKey,
      mode: "before",
    });

    setDragged(null);
  }

  function handleDropToEnd(bucketKey: string) {
    if (!dragged) return;
    if (dragged.bucketKey !== bucketKey) return;

    reorderInBucket({
      draggedId: dragged.id,
      bucketKey,
      mode: "end",
    });

    setDragged(null);
  }

  function resetOrder() {
    setItems(categories);
    setDirty(false);
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="text-base font-semibold text-slate-900">
          Chưa có category nào
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Tạo category đầu tiên cho sản phẩm, bài viết, dự án hoặc dịch vụ.
        </p>

        <Link
          href="/admin/categories/create"
          className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Thêm category
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-800">
        <div className="font-semibold">Sắp xếp danh mục</div>
        <div className="mt-1">
          Kéo thả trong cùng nhóm để đổi thứ tự. Muốn đổi danh mục cha thì bấm{" "}
          <strong>Sửa</strong>.
        </div>
      </div>

      {groupedTypes.map((type) => {
        const meta = getGroupMeta(type);
        const groupItems = items.filter((item) => item.type === type);

        const rootItems = groupItems.filter((item) => !item.parentId);

        const childParentIds = Array.from(
          new Set(
            groupItems
              .filter((item) => item.parentId)
              .map((item) => item.parentId as string)
          )
        );

        const activeCount = groupItems.filter((item) => item.isActive).length;

        return (
          <section
            key={type}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    {meta.title}
                  </h2>
                  <Badge tone={meta.tone as any}>{type}</Badge>
                </div>

                <p className="mt-1 text-sm text-slate-500">{meta.helper}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge tone="gray">{groupItems.length} danh mục</Badge>
                <Badge tone="green">{activeCount} đang hiện</Badge>
              </div>
            </div>

            <div className="space-y-5">
              <BucketSection
                title="Cấp chính"
                helper="Các danh mục không có danh mục cha."
                bucketKey={`${type}::root`}
                items={rootItems}
                draggedId={dragged?.id || null}
                onDragStart={handleDragStart}
                onDropOnItem={handleDropOnItem}
                onDropToEnd={handleDropToEnd}
              />

              {childParentIds.map((parentId) => {
                const childItems = groupItems.filter(
                  (item) => item.parentId === parentId
                );

                const parent = items.find((item) => item.id === parentId);
                const firstChild = childItems[0];

                const parentName =
                  parent?.nameVi ||
                  parent?.slug ||
                  firstChild?.parentName ||
                  "Danh mục cha";

                return (
                  <BucketSection
                    key={`${type}-${parentId}`}
                    title={`Con của: ${parentName}`}
                    helper="Kéo thả để sắp xếp các danh mục con cùng cấp."
                    bucketKey={`${type}::${parentId}`}
                    items={childItems}
                    draggedId={dragged?.id || null}
                    onDragStart={handleDragStart}
                    onDropOnItem={handleDropOnItem}
                    onDropToEnd={handleDropToEnd}
                  />
                );
              })}
            </div>
          </section>
        );
      })}

      {dirty && (
        <div className="sticky bottom-0 z-30 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <div className="font-semibold text-slate-900">
                Bạn đã thay đổi thứ tự danh mục
              </div>
              <div className="text-sm text-slate-500">
                Bấm lưu để ghi thứ tự mới vào database.
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetOrder}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Hoàn tác
              </button>

              <form action={reorderCategoriesAction}>
                <input type="hidden" name="itemsJson" value={reorderItemsJson} />

                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                >
                  Lưu thứ tự
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}