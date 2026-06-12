import Link from "next/link";
import { Locale } from "@prisma/client";
import { AttributesTable } from "./attributes-table";
import { getAdminAttributes } from "./attribute-query";

type Props = {
  params: {
    locale: Locale;
  };
};

export default async function AdminAttributesPage({ params }: Props) {
  const locale = params.locale || Locale.vi;
  const attributes = await getAdminAttributes(locale);

  const total = attributes.length;
  const filterCount = attributes.filter((item) => item.isFilter).length;
  const variantCount = attributes.filter((item) => item.isVariantOption).length;
  const valuesCount = attributes.reduce((sum, item) => sum + item.valuesCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý thuộc tính
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tạo bộ lọc sản phẩm như màu sắc, loại vân đá, bề mặt, độ dày.
          </p>
        </div>

        <Link
          href={`/admin/attributes/create`}
          className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Thêm thuộc tính
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Tổng thuộc tính</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{total}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Đang làm filter</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {filterCount}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Dùng làm variant</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {variantCount}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Tổng giá trị</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {valuesCount}
          </div>
        </div>
      </div>

      <AttributesTable locale={locale} attributes={attributes} />
    </div>
  );
}