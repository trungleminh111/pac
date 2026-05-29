import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/HeroSlider";
import { ClientCarousel } from "@/components/site/ClientCarousel";
import { Services } from "@/components/site/Services";
import { About } from "@/components/site/About";
import { Products } from "@/components/site/Products";
import { Projects } from "@/components/site/Projects";
import { News } from "@/components/site/News";
import { Footer } from "@/components/site/Footer";
import { Footer2 } from "@/components/site/Footer2";

export default function HomePage() {
  return (
    <>
      <div className="page-wrapper">
        <Header />
        <Hero />
        <ClientCarousel />
        <Services />
        <div className="home-shared-bg">
          <About />
          <Products />
          <Projects />
        </div>
        <News />
        <Footer2 />
      </div>
    </>
  );
}