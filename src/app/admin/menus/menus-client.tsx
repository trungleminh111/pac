"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Save, Trash2, Pencil } from "lucide-react";

type MenuItem = {
  id: string;
  menuId: string;
  labelVi: string;
  labelEn: string | null;
  urlVi: string | null;
  urlEn: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  icon: string | null;
  target: string | null;
};

type TreeItem = MenuItem & {
  children: TreeItem[];
};

function buildTree(items: MenuItem[]) {
  const map = new Map<string, TreeItem>();

  items.forEach((item) => {
    map.set(item.id, {
      ...item,
      children: [],
    });
  });

  const roots: TreeItem[] = [];

  map.forEach((item) => {
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)?.children.push(item);
    } else {
      roots.push(item);
    }
  });

  const sort = (list: TreeItem[]) => {
    list.sort((a, b) => a.sortOrder - b.sortOrder);
    list.forEach((item) => sort(item.children));
  };

  sort(roots);

  return roots;
}

function flattenTree(items: TreeItem[]) {
  const result: {
    id: string;
    parentId: string | null;
    sortOrder: number;
  }[] = [];

  items.forEach((item, index) => {
    result.push({
      id: item.id,
      parentId: null,
      sortOrder: index,
    });

    item.children.forEach((child, childIndex) => {
      result.push({
        id: child.id,
        parentId: item.id,
        sortOrder: childIndex,
      });
    });
  });

  return result;
}

export default function MenusClient({
  items,
  reorderAction,
  deleteAction,
}: {
  items: MenuItem[];
  reorderAction: (formData: FormData) => void;
  deleteAction: (formData: FormData) => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tree, setTree] = useState<TreeItem[]>(() => buildTree(items));
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    setTree(buildTree(items));
  }, [items]);

  function moveRoot(fromId: string, toId: string) {
    setTree((prev) => {
      const copy = [...prev];
      const fromIndex = copy.findIndex((item) => item.id === fromId);
      const toIndex = copy.findIndex((item) => item.id === toId);

      if (fromIndex < 0 || toIndex < 0) return prev;

      const [removed] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, removed);

      return copy;
    });
  }

  function moveChild(parentId: string, fromId: string, toId: string) {
    setTree((prev) =>
      prev.map((root) => {
        if (root.id !== parentId) return root;

        const children = [...root.children];
        const fromIndex = children.findIndex((item) => item.id === fromId);
        const toIndex = children.findIndex((item) => item.id === toId);

        if (fromIndex < 0 || toIndex < 0) return root;

        const [removed] = children.splice(fromIndex, 1);
        children.splice(toIndex, 0, removed);

        return {
          ...root,
          children,
        };
      })
    );
  }

  function saveOrder() {
    const formData = new FormData();
    formData.set("items", JSON.stringify(flattenTree(tree)));

    startTransition(() => {
      reorderAction(formData);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          disabled={isPending}
          onClick={saveOrder}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {isPending ? "Đang lưu..." : "Lưu thứ tự"}
        </button>
      </div>

      <div className="space-y-4">
        {tree.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => setDragId(item.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragId) moveRoot(dragId, item.id);
              setDragId(null);
            }}
            className="rounded-2xl border bg-white p-4 shadow-sm"
          >
            <MenuItemRow item={item} deleteAction={deleteAction} isParent />

            {item.children.length > 0 && (
              <div className="mt-4 space-y-3 border-l-2 border-slate-200 pl-5">
                {item.children.map((child) => (
                  <div
                    key={child.id}
                    draggable
                    onDragStart={() => setDragId(child.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragId) moveChild(item.id, dragId, child.id);
                      setDragId(null);
                    }}
                    className="rounded-xl border bg-slate-50 p-4"
                  >
                    <MenuItemRow item={child} deleteAction={deleteAction} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {tree.length === 0 && (
          <div className="rounded-2xl border bg-white p-10 text-center text-sm text-slate-500">
            Chưa có menu item nào.
          </div>
        )}
      </div>
    </div>
  );
}

function MenuItemRow({
  item,
  deleteAction,
  isParent = false,
}: {
  item: MenuItem;
  deleteAction: (formData: FormData) => void;
  isParent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <GripVertical className="h-5 w-5 cursor-grab text-slate-400" />

        <div>
          <div className="flex items-center gap-2">
            <span
              className={`font-semibold ${
                isParent ? "text-slate-950" : "text-slate-700"
              }`}
            >
              {item.labelVi}
            </span>

            {!item.isActive && (
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                Ẩn
              </span>
            )}

            {item.target === "_blank" && (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
                Tab mới
              </span>
            )}
          </div>

          <div className="mt-1 text-xs text-slate-500">
            {item.urlVi || "Không có URL"} {item.labelEn ? `• ${item.labelEn}` : ""}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href={`/admin/menus/${item.id}/edit`}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#2271b1]"
        >
          <Pencil className="h-4 w-4" />
          Sửa
        </Link>

        <form action={deleteAction}>
          <input type="hidden" name="id" value={item.id} />
          <button
            type="submit"
            onClick={(e) => {
              if (!confirm(`Xóa menu "${item.labelVi}"?`)) {
                e.preventDefault();
              }
            }}
            className="inline-flex items-center gap-1 text-sm font-medium text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Xóa
          </button>
        </form>
      </div>
    </div>
  );
}