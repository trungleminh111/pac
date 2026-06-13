import { notFound } from "next/navigation";
import { ProjectForm } from "../../project-form";
import { getAdminProjectById, getProjectFormOptions } from "../../project-query";
import { ProjectToast } from "../../project-toast";
import type { AdminLocale } from "../../project.type";

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

export default async function EditProjectPage({ params, searchParams }: Props) {
  const activeLocale = normalizeLocale(searchParams?.locale);

  const [project, options] = await Promise.all([
    getAdminProjectById(params.id, activeLocale),
    getProjectFormOptions(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ProjectToast
        success={searchParams?.success}
        error={searchParams?.error}
      />

      <ProjectForm
        key={`${params.id}-${activeLocale}`}
        mode="edit"
        activeLocale={activeLocale}
        project={project}
        categories={options.categories}
      />
    </div>
  );
}