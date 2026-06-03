import { getHomeServices } from "@/server/services/service.query";
import type { Locale } from "@/server/services/service.type";
import { ServicesSlider } from "./ServicesSlider";

export async function Services({ locale }: { locale: Locale }) {
  const services = await getHomeServices(locale);

  return <ServicesSlider locale={locale} services={services} />;
}