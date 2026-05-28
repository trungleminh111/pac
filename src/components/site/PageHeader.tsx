type PageHeaderProps = {
  title: string;
  bgImage?: string;
};

export function PageHeader({
  title,
  bgImage,
}: PageHeaderProps) {
  return (
    <section className="page-header">
      <div
        className="page-header__bg"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundPosition: "center center",
        }}
      />

      <div className="container">
        <h2 className="page-header__title">{title}</h2>
      </div>
    </section>
  );
}