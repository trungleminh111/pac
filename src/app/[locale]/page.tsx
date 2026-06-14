import { SiteHeader as Header } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/HeroSlider";
import { ClientCarousel } from "@/components/site/ClientCarousel";
import { Services } from "@/components/site/Services";
import { About } from "@/components/site/About";
import { Products } from "@/components/site/Products";
import { Projects } from "@/components/site/Projects";
import { News } from "@/components/site/News";
import { Footer } from "@/components/site/Footer";
import type { Locale } from "@/server/services/service.type";

export default function HomePage({
  params,
}: {
  params: {
    locale: Locale;
  };
}) {
  return (
    <div className="page-wrapper">
      <Header locale={params.locale} />
      <Hero locale={params.locale}/>
      <ClientCarousel />
      <Services locale={params.locale} />

      <div className="home-shared-bg">
        <About locale={params.locale}/>
        <Products locale={params.locale} />
        <Projects locale={params.locale} />
      </div>

      <News locale={params.locale} />
      <Footer locale={params.locale}/>
    </div>
  );
}