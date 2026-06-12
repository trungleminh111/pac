import { Locale } from "@prisma/client";
import { AttributeForm } from "../attribute-form";

type Props = {
  params: {
    locale: Locale;
  };
};

export default function CreateAttributePage({ params }: Props) {
  const locale = params.locale || Locale.vi;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Thêm thuộc tính</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tạo nhóm thuộc tính dùng cho filter sản phẩm.
        </p>
      </div>

      <AttributeForm locale={locale} mode="create" />
    </div>
  );
}