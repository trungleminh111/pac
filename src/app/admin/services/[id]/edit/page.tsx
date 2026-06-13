import { notFound } from "next/navigation";
import { ServiceForm } from "../../service-form";
import { getAdminServiceById, getServiceFormOptions } from "../../service-query";
import { ServiceToast } from "../../service-toast";
import type { AdminLocale } from "../../service.type";

type Props = {
  params: {
    id: string;
  };
  searchParams?: {
    locale?: string;
    success?: string;
    error?: string;
  };
};

function normalizeLocale(locale?: string): AdminLocale {
  return locale === "en" ? "en" : "vi";
}

export default async function EditServicePage({ params, searchParams }: Props) {
  const activeLocale = normalizeLocale(searchParams?.locale);

  const [service, options] = await Promise.all([
    getAdminServiceById(params.id, activeLocale),
    getServiceFormOptions(),
  ]);

  if (!service) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ServiceToast
        success={searchParams?.success}
        error={searchParams?.error}
      />

      <ServiceForm
        key={`${params.id}-${activeLocale}`}
        mode="edit"
        activeLocale={activeLocale}
        service={service}
        categories={options.categories}
      />
    </div>
  );
}