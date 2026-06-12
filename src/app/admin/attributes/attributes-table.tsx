import Link from "next/link";
import type { Locale } from "@prisma/client";
import type { AdminAttributeItem } from "./attribute.type";
import {
  deleteAttributeAction,
  toggleAttributeFilterAction,
  toggleAttributeVariantAction,
} from "./attribute-actions";

type Props = {
  locale: Locale;
  attributes: AdminAttributeItem[];
};

function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "green" | "blue" | "gray";
}) {
  const className =
    tone === "green"
      ? "border-green-200 bg-green-50 text-green-700"
      : tone === "blue"
        ? "border-blue-200 bg-blue-50 text-blue-700"
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

export function AttributesTable({ locale, attributes }: Props) {
  if (!attributes.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h3 className="text-base font-semibold text-slate-900">
          Chưa có thuộc tính nào
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Tạo thuộc tính đầu tiên như Màu sắc, Loại vân đá, Bề mặt.
        </p>
        <Link
          href={`/admin/attributes/create`}
          className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Thêm thuộc tính
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Tên</th>
              <th className="px-5 py-3">Code</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Filter</th>
              <th className="px-5 py-3">Variant</th>
              <th className="px-5 py-3">Values</th>
              <th className="px-5 py-3">Sort</th>
              <th className="px-5 py-3 text-right">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {attributes.map((attribute) => (
              <tr key={attribute.id} className="hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <div className="font-medium text-slate-900">
                    {attribute.nameVi || attribute.code}
                  </div>
                  <div className="text-xs text-slate-500">
                    {attribute.nameEn || "—"}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">
                    {attribute.code}
                  </code>
                </td>

                <td className="px-5 py-4">
                  <Badge tone="blue">{attribute.type}</Badge>
                </td>

                <td className="px-5 py-4">
                  {attribute.isFilter ? (
                    <Badge tone="green">Filter</Badge>
                  ) : (
                    <Badge tone="gray">Off</Badge>
                  )}
                </td>

                <td className="px-5 py-4">
                  {attribute.isVariantOption ? (
                    <Badge tone="green">Variant</Badge>
                  ) : (
                    <Badge tone="gray">Off</Badge>
                  )}
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {attribute.valuesCount}
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {attribute.sortOrder}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <form action={toggleAttributeFilterAction}>
                      <input type="hidden" name="id" value={attribute.id} />
                      <input type="hidden" name="locale" value={locale} />
                      <button
                        type="submit"
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Filter
                      </button>
                    </form>

                    <form action={toggleAttributeVariantAction}>
                      <input type="hidden" name="id" value={attribute.id} />
                      <input type="hidden" name="locale" value={locale} />
                      <button
                        type="submit"
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Variant
                      </button>
                    </form>

                    <Link
                      href={`/admin/attributes/${attribute.id}/edit`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Sửa
                    </Link>

                    <form action={deleteAttributeAction}>
                      <input type="hidden" name="id" value={attribute.id} />
                      <input type="hidden" name="locale" value={locale} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Xoá
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}