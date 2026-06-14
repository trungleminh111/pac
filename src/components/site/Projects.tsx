import { getHomeProjectSlides } from "@/server/project/project.query";
import type { Locale } from "@/server/services/service.type";
import { ProjectsClient } from "./ProjectsClient";

export async function Projects({ locale }: { locale: Locale }) {
  const projects = await getHomeProjectSlides(locale);

  return <ProjectsClient projects={projects} locale={locale}/>;
}