import Link from "next/link";
import { getAdminTags } from "./tag-query";
import { TagsTable } from "./tags-table";
import { TagToast } from "./tag-toast";

type Props = {
  searchParams?: {
    success?: string;
    error?: string;
  };
};

export default async function AdminTagsPage({ searchParams }: Props) {
  const tags = await getAdminTags();

  const total = tags.length;
  const activeCount = tags.filter((item) => item.isActive).length;
  const usedCount = tags.filter((item) => item.postsCount > 0).length;
  const hiddenCount = total - activeCount;

  return (
    <div className="space-y-6">
      <TagToast success={searchParams?.success} error={searchParams?.error} />

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý tag
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý tag cho bài viết/tin tức, hỗ trợ Tiếng Việt và English.
          </p>
        </div>

        <Link
          href="/admin/tags/create"
          className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Thêm tag
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Tổng tag</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{total}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Đang hiện</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {activeCount}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Đang dùng</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {usedCount}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-500">Tạm ẩn</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {hiddenCount}
          </div>
        </div>
      </div>

      <TagsTable tags={tags} />
    </div>
  );
}