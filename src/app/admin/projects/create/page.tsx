import { ProjectForm } from "../project-form";
import { getProjectFormOptions } from "../project-query";
import { ProjectToast } from "../project-toast";

type Props = {
  searchParams?: {
    success?: string;
    error?: string;
  };
};

export default async function CreateProjectPage({ searchParams }: Props) {
  const options = await getProjectFormOptions();

  return (
    <div className="space-y-6">
      <ProjectToast
        success={searchParams?.success}
        error={searchParams?.error}
      />

      <ProjectForm
        mode="create"
        activeLocale="vi"
        project={null}
        categories={options.categories}
      />
    </div>
  );
}