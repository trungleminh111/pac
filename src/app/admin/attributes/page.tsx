import Link from "next/link";
import { getAdminAttributes } from "./attribute-query";
import { AttributesTable } from "./attributes-table";

type Props = {
  searchParams?: {
    success?: string;
    error?: string;
  };
};

export default async function AdminAttributesPage({ searchParams }: Props) {
  const attributes = await getAdminAttributes();

  const total = attributes.length;
  const filterCount = attributes.filter((item) => item.isFilter).length;
  const variantCount = attributes.filter(
    (item) => item.isVariantOption
  ).length;
  const valueCount = attributes.reduce(
    (totalValue, item) => totalValue + item.valuesCount,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý thuộc tính
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý thông số sản phẩm, bộ lọc, option màu sắc, kích thước,
            chất liệu và thông tin kỹ thuật.
          </p>
        </div>

        <Link
          href="/admin/attributes/create"
          className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Thêm thuộc tính
        </Link>
      </div>

      {searchParams?.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {searchParams.success}
        </div>
      )}

      {searchParams?.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {searchParams.error}
        </div>
      )}

      <AttributesTable attributes={attributes} locale="vi" />
    </div>
  );
}