import type { Metadata } from "next";
import { buildMetadata, SITE_URL } from "@/lib/seo";
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

export async function generateMetadata({
  params,
}: {
  params: {
    locale: Locale;
  };
}): Promise<Metadata> {
  return buildMetadata({
    locale: params.locale,
    path: `/${params.locale}`,
    title: "P.A.C STONE - Đá Ốp Lát Cao Cấp Nhập Khẩu TP.HCM",
    description: "Giới thiệu công ty, địa chỉ, hotline",
    image: "",
    type: "website",
  });
}

export default function HomePage({
  params,
}: {
  params: {
    locale: Locale;
  };
}) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "P.A.C STONE",
    url: SITE_URL,
    logo: "URL logo",
    telephone: "0962757475",
    address: "114C Hoàng Hoa Thám, Bảy Hiền, TP.HCM",
    sameAs: ["Facebook URL", "Zalo URL"],
  };

  return (
    <div className="page-wrapper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />

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