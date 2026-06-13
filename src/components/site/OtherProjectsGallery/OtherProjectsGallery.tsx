"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./OtherProjectsGallery.module.css";

type OtherProject = {
  slug: string;
  title: string;
  image: string;
  type?: string;
};

export default function OtherProjectsGallery({
  title,
  projects,
  locale,
}: {
  title: string;
  projects: OtherProject[];
  locale: "vi" | "en";
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const projectsPerSlide = 3;
  const totalSlides = Math.ceil(projects.length / projectsPerSlide);

  const detailHref = (slug: string) =>
    locale === "vi" ? `/vi/cong-trinh/${slug}` : `/en/projects/${slug}`;

  const visibleProjects = projects.slice(
    currentSlide * projectsPerSlide,
    (currentSlide + 1) * projectsPerSlide
  );

  if (!projects.length) return null;

  return (
    <section className={styles.wrapper}>
      <div className="container">
        <h3 className={styles.title}>{title}</h3>

        <div className={styles.grid}>
          {visibleProjects.map((item) => (
            <Link
              key={item.slug}
              href={detailHref(item.slug)}
              className={styles.card}
            >
              <img src={item.image} alt={item.title} className={styles.image} />

              <div className={styles.overlay} />

              <div className={styles.content}>
                {item.type && <span className={styles.type}>{item.type}</span>}

                <h4 className={styles.projectTitle}>{item.title}</h4>
              </div>
            </Link>
          ))}
        </div>

        {totalSlides > 1 && (
          <div className={styles.dots}>
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`${styles.dot} ${
                  currentSlide === index ? styles.activeDot : ""
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}