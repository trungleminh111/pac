type Section =
  | {
      type: "hero";
      title?: string;
      subtitle?: string;
    }
  | {
      type: "richText";
      title?: string;
      content?: string;
    }
  | {
      type: "faq";
      title?: string;
      items?: {
        question: string;
        answer: string;
      }[];
    }
  | {
      type: "cta";
      title?: string;
      description?: string;
      label?: string;
      url?: string;
    };

type SectionRendererProps = {
  sections?: unknown;
};

export function SectionRenderer({ sections }: SectionRendererProps) {
  if (!Array.isArray(sections)) return null;

  return (
    <div className="space-y-12">
      {(sections as Section[]).map((section, index) => {
        if (section.type === "hero") {
          return (
            <section key={index} className="rounded-2xl bg-muted p-8">
              {section.title ? (
                <h2 className="text-4xl font-bold">{section.title}</h2>
              ) : null}

              {section.subtitle ? (
                <p className="mt-4 text-lg text-muted-foreground">
                  {section.subtitle}
                </p>
              ) : null}
            </section>
          );
        }

        if (section.type === "richText") {
          return (
            <section key={index}>
              {section.title ? (
                <h2 className="text-2xl font-semibold">{section.title}</h2>
              ) : null}

              {section.content ? (
                <div className="mt-4 whitespace-pre-line leading-7">
                  {section.content}
                </div>
              ) : null}
            </section>
          );
        }

        if (section.type === "faq") {
          return (
            <section key={index}>
              {section.title ? (
                <h2 className="text-2xl font-semibold">{section.title}</h2>
              ) : null}

              <div className="mt-4 space-y-4">
                {section.items?.map((item, itemIndex) => (
                  <div key={itemIndex} className="rounded-xl border p-4">
                    <h3 className="font-semibold">{item.question}</h3>
                    <p className="mt-2 text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === "cta") {
          return (
            <section key={index} className="rounded-2xl border p-8">
              {section.title ? (
                <h2 className="text-2xl font-semibold">{section.title}</h2>
              ) : null}

              {section.description ? (
                <p className="mt-3 text-muted-foreground">
                  {section.description}
                </p>
              ) : null}

              {section.label && section.url ? (
                <a
                  href={section.url}
                  className="mt-5 inline-flex rounded-lg bg-primary px-5 py-3 text-primary-foreground"
                >
                  {section.label}
                </a>
              ) : null}
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}