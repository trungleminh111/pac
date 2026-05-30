"use client";

import dynamic from "next/dynamic";

const PostEditorClient = dynamic(() => import("./post-editor-client"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[520px] rounded-xl border bg-white p-6 text-sm text-slate-500">
      Đang tải trình soạn thảo...
    </div>
  ),
});

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function PostEditor(props: Props) {
  return <PostEditorClient {...props} />;
}