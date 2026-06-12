import { Locale } from "@prisma/client";
import { notFound } from "next/navigation";
import { AttributeForm } from "../../attribute-form";
import { getAdminAttributeById } from "../../attribute-query";

type Props = {
  params: {
    locale: Locale;
    id: string;
  };
};

export default async function EditAttributePage({ params }: Props) {
  const locale = params.locale || Locale.vi;
  const attribute = await getAdminAttributeById(params.id);

  if (!attribute) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Sửa thuộc tính
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Cập nhật thông tin thuộc tính và các giá trị bên trong.
        </p>
      </div>

      <AttributeForm locale={locale} mode="edit" initialData={attribute} />
    </div>
  );
}