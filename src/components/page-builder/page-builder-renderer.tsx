import type { BuilderBlock } from "./page-builder";

type Props = {
  sections: unknown;
};

function normalizeSections(sections: unknown): BuilderBlock[] {
  if (!Array.isArray(sections)) return [];

  return sections.filter((item) => {
    if (!item || typeof item !== "object") return false;

    const block = item as Partial<BuilderBlock>;

    return (
      block.type === "hero" ||
      block.type === "text" ||
      block.type === "image" ||
      block.type === "cta" ||
      block.type === "faq"
    );
  }) as BuilderBlock[];
}

export function PageBuilderRenderer({ sections }: Props) {
  const blocks = normalizeSections(sections);

  if (blocks.length === 0) return null;

  return (
    <div>
      {blocks.map((block) => {
        if (block.type === "hero") {
          return (
            <section
              key={block.id}
              className={`bg-slate-950 px-4 py-24 text-white ${
                block.props.align === "center" ? "text-center" : "text-left"
              }`}
            >
              <div className="container mx-auto">
                <h1 className="text-4xl font-bold md:text-6xl">
                  {block.props.title}
                </h1>

                {block.props.subtitle ? (
                  <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
                    {block.props.subtitle}
                  </p>
                ) : null}

                {block.props.buttonText ? (
                  <a
                    href={block.props.buttonUrl || "#"}
                    className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950"
                  >
                    {block.props.buttonText}
                  </a>
                ) : null}
              </div>
            </section>
          );
        }

        if (block.type === "text") {
          return (
            <section key={block.id} className="container mx-auto px-4 py-14">
              {block.props.title ? (
                <h2 className="text-3xl font-bold text-slate-950">
                  {block.props.title}
                </h2>
              ) : null}

              {block.props.content ? (
                <div className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">
                  {block.props.content}
                </div>
              ) : null}
            </section>
          );
        }

        if (block.type === "image") {
          return (
            <section key={block.id} className="container mx-auto px-4 py-14">
              {block.props.src ? (
                <img
                  src={block.props.src}
                  alt={block.props.alt || ""}
                  className="w-full rounded-3xl object-cover"
                />
              ) : null}

              {block.props.caption ? (
                <p className="mt-3 text-center text-sm text-slate-500">
                  {block.props.caption}
                </p>
              ) : null}
            </section>
          );
        }

        if (block.type === "cta") {
          return (
            <section key={block.id} className="container mx-auto px-4 py-14">
              <div className="rounded-3xl bg-blue-50 p-10 text-center">
                {block.props.title ? (
                  <h2 className="text-3xl font-bold text-slate-950">
                    {block.props.title}
                  </h2>
                ) : null}

                {block.props.description ? (
                  <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                    {block.props.description}
                  </p>
                ) : null}

                {block.props.buttonText ? (
                  <a
                    href={block.props.buttonUrl || "#"}
                    className="mt-7 inline-flex rounded-xl bg-[#2271b1] px-6 py-3 text-sm font-semibold text-white"
                  >
                    {block.props.buttonText}
                  </a>
                ) : null}
              </div>
            </section>
          );
        }

        if (block.type === "faq") {
          return (
            <section key={block.id} className="container mx-auto px-4 py-14">
              {block.props.title ? (
                <h2 className="text-3xl font-bold text-slate-950">
                  {block.props.title}
                </h2>
              ) : null}

              <div className="mt-6 rounded-2xl border p-6">
                {block.props.question ? (
                  <h3 className="font-semibold text-slate-950">
                    {block.props.question}
                  </h3>
                ) : null}

                {block.props.answer ? (
                  <p className="mt-3 leading-7 text-slate-600">
                    {block.props.answer}
                  </p>
                ) : null}
              </div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}