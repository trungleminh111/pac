"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Save } from "lucide-react";
import type {
  Page,
  PageTemplate,
  PageTranslation,
  PageType,
  PublishStatus,
} from "@prisma/client";
import type { EditPageState } from "./page";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { PageBuilderV2 } from "@/components/page-builder-v2/page-builder-v2";
import type { BuilderDocument } from "@/components/page-builder-v2/types";

type PageWithTranslations = Page & {
  translations: PageTranslation[];
};

function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeBuilderDocument(value: unknown): BuilderDocument {
  if (
    value &&
    typeof value === "object" &&
    (value as BuilderDocument).version === 2 &&
    Array.isArray((value as BuilderDocument).blocks)
  ) {
    return value as BuilderDocument;
  }

  return {
    version: 2,
    blocks: [],
  };
}

export default function EditPageForm({
  page,
  action,
}: {
  page: PageWithTranslations;
  action: (
    prevState: EditPageState,
    formData: FormData
  ) => Promise<EditPageState>;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isRefreshing, startTransition] = useTransition();

  const vi = page.translations.find((item) => item.locale === "vi");

  const [state, setState] = useState<EditPageState>({
    ok: false,
    message: "",
  });

  const [pending, setPending] = useState(false);
  const [title, setTitle] = useState(vi?.title ?? "");
  const [slug, setSlug] = useState(vi?.slug ?? "");
  const [contentHtml, setContentHtml] = useState(vi?.contentHtml ?? "");
  const [builderDocument, setBuilderDocument] = useState<BuilderDocument>(
    normalizeBuilderDocument(page.sections)
  );

  useEffect(() => {
    if (!state.ok) return;

    startTransition(() => {
      router.refresh();
    });
  }, [state.ok, router]);

  async function handleSubmit(formData: FormData) {
    setPending(true);

    try {
      formData.set("contentHtml", contentHtml);
      formData.set("sections", JSON.stringify(builderDocument));

      const result = await action(state, formData);
      setState(result);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.push("/admin/pages")}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#2271b1] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại Pages
      </button>

      <form ref={formRef} action={handleSubmit} className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Sửa page</h1>
            <p className="mt-1 text-sm text-slate-500">
              Page Builder V2: Section, Container, Element, Core/Pro/VIP.
            </p>
          </div>

          <button
            disabled={pending || isRefreshing}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2271b1] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {pending || isRefreshing ? "Đang lưu..." : "Lưu page"}
          </button>
        </div>

        {state.message ? (
          <div
            className={`rounded-xl px-4 py-3 text-sm ${
              state.ok
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {state.message}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2271b1]">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-950">
                    Thông tin page
                  </h2>
                  <p className="text-sm text-slate-500">
                    Tiêu đề, slug và mô tả ngắn.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  name="title"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setSlug(toSlug(e.target.value));
                  }}
                  placeholder="Tiêu đề page"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                />

                <input
                  name="slug"
                  required
                  value={slug}
                  onChange={(e) => setSlug(toSlug(e.target.value))}
                  placeholder="slug-page"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                />

                <textarea
                  name="excerpt"
                  defaultValue={vi?.excerpt ?? ""}
                  placeholder="Mô tả ngắn"
                  rows={3}
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                />
              </div>
            </div>

            <PageBuilderV2
              value={builderDocument}
              onChange={setBuilderDocument}
              currentPlan="vip"
            />

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="font-semibold text-slate-950">
                  Nội dung phụ / SEO body
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Nội dung dài bổ sung bên dưới page builder.
                </p>
              </div>

              <input
                type="hidden"
                name="contentHtml"
                value={contentHtml}
                readOnly
              />

              <TiptapEditor value={contentHtml} onChange={setContentHtml} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-950">Cài đặt page</h2>

              <div className="mt-5 space-y-4">
                <select
                  name="type"
                  defaultValue={page.type as PageType}
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                >
                  <option value="NORMAL">Trang thường</option>
                  <option value="POLICY">Chính sách</option>
                  <option value="LANDING">Landing</option>
                </select>

                <select
                  name="template"
                  defaultValue={page.template as PageTemplate}
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                >
                  <option value="DEFAULT">Default</option>
                  <option value="POLICY">Policy</option>
                  <option value="LANDING">Landing</option>
                  <option value="CONTACT">Contact</option>
                  <option value="ABOUT">About</option>
                  <option value="FAQ">FAQ</option>
                </select>

                <select
                  name="status"
                  defaultValue={page.status as PublishStatus}
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-950">SEO</h2>

              <div className="mt-5 space-y-4">
                <input
                  name="seoTitle"
                  defaultValue={vi?.seoTitle ?? ""}
                  placeholder="SEO title"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                />

                <textarea
                  name="seoDescription"
                  defaultValue={vi?.seoDescription ?? ""}
                  placeholder="SEO description"
                  rows={4}
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}