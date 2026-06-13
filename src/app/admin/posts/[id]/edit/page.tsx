import { notFound } from "next/navigation";
import { PostForm } from "../../post-form";
import { getAdminPostById, getPostFormOptions } from "../../post-query";
import { PostToast } from "../../post-toast";
import type { AdminLocale } from "../../post.type";

type Props = {
  params: {
    id: string;
  };
  searchParams?: {
    locale?: string;
    success?: string;
    error?: string;
  };
};

function normalizeLocale(locale?: string): AdminLocale {
  return locale === "en" ? "en" : "vi";
}

export default async function EditPostPage({ params, searchParams }: Props) {
  const activeLocale = normalizeLocale(searchParams?.locale);

  const [post, options] = await Promise.all([
    getAdminPostById(params.id, activeLocale),
    getPostFormOptions(activeLocale),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PostToast success={searchParams?.success} error={searchParams?.error} />

      <PostForm
        key={`${params.id}-${activeLocale}`}
        mode="edit"
        activeLocale={activeLocale}
        post={post}
        categories={options.categories}
        tags={options.tags}
      />
    </div>
  );
}