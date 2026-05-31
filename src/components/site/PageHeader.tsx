import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  bgImage?: string;
  children?: ReactNode;
};

export function PageHeader({ title, bgImage, children }: PageHeaderProps) {
  return (
    <section className="page-header">
      <div
        className="page-header__bg"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundPosition: "center center",
        }}
      />

      <div className="container page-header__inner">
        {title && <h2 className="page-header__title">{title}</h2>}

        {children}
      </div>
    </section>
  );
}