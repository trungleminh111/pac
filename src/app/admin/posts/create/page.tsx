import { PostForm } from "../post-form";
import { getPostFormOptions } from "../post-query";
import { PostToast } from "../post-toast";

type Props = {
  searchParams?: {
    success?: string;
    error?: string;
  };
};

export default async function CreatePostPage({ searchParams }: Props) {
  const options = await getPostFormOptions("vi");

  return (
    <div className="space-y-6">
      <PostToast success={searchParams?.success} error={searchParams?.error} />

      <PostForm
        mode="create"
        activeLocale="vi"
        post={null}
        categories={options.categories}
        tags={options.tags}
      />
    </div>
  );
}