import { notFound } from "next/navigation";
import { Locale } from "@prisma/client";
import { getPolicyPageBySlug } from "@/server/pages/page.query";
import { PageBuilderV2Renderer } from "@/components/page-builder-v2/page-builder-v2-renderer";

type PolicyPageProps = {
  params: {
    locale: string;
    slug: string;
  };
};

export default async function PolicyPage({ params }: PolicyPageProps) {
  const locale = params.locale as Locale;

  const page = await getPolicyPageBySlug(params.slug, locale);
  const translation = page?.translations?.[0];

  if (!page || !translation) {
    notFound();
  }

  return (
    <main className="w-full overflow-x-hidden">
      <PageBuilderV2Renderer value={page.sections} />

      {translation.contentHtml ? (
        <article
          className="prose prose-slate mx-auto max-w-4xl px-4 py-16"
          dangerouslySetInnerHTML={{
            __html: translation.contentHtml,
          }}
        />
      ) : null}
    </main>
  );
}