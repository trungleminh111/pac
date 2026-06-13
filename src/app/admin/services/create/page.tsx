import { ServiceForm } from "../service-form";
import { getServiceFormOptions } from "../service-query";
import { ServiceToast } from "../service-toast";

type Props = {
  searchParams?: {
    success?: string;
    error?: string;
  };
};

export default async function CreateServicePage({ searchParams }: Props) {
  const options = await getServiceFormOptions();

  return (
    <div className="space-y-6">
      <ServiceToast
        success={searchParams?.success}
        error={searchParams?.error}
      />

      <ServiceForm
        mode="create"
        activeLocale="vi"
        service={null}
        categories={options.categories}
      />
    </div>
  );
}