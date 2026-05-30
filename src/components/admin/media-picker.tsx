"use client";

import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";

type Media = {
  id: string;
  filename: string;
  url: string;
};

export function MediaPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Media[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadMedia() {
    const res = await fetch("/api/admin/media");
    const data = await res.json();
    setItems(data.media || []);
  }

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;

    setUploading(true);
    setMessage("");

    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append("upload", file);
    });

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || data.failed?.[0]?.error || "Upload thất bại.");
      setUploading(false);
      return;
    }

    if (data.url) {
      onChange(data.url);
    }

    if (data.failed?.length) {
      setMessage(
        `${data.message}\n${data.failed.map((x: any) => x.error).join("\n")}`
      );
    } else {
      setMessage(data.message || "Upload thành công.");
    }

    await loadMedia();
    setUploading(false);
  }

  useEffect(() => {
    if (open) loadMedia();
  }, [open]);

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative overflow-hidden rounded-xl border">
          <img src={value} alt="" className="aspect-video w-full object-cover" />

          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed text-sm text-slate-400">
          Chưa chọn ảnh
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-slate-50"
      >
        <ImagePlus className="h-4 w-4" />
        Chọn ảnh / Upload mới
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 p-6">
          <div className="mx-auto max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-semibold">Chọn ảnh</h2>

              <button type="button" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center justify-between border-b p-5">
              <label className="inline-flex cursor-pointer rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white">
                {uploading ? "Đang upload..." : "Upload nhiều ảnh"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  disabled={uploading}
                  onChange={(e) => uploadFiles(e.target.files)}
                />
              </label>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
              >
                Xong
              </button>
            </div>

            {message && (
              <div className="m-5 whitespace-pre-line rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                {message}
              </div>
            )}

            <div className="grid max-h-[60vh] grid-cols-2 gap-4 overflow-y-auto p-5 md:grid-cols-4 lg:grid-cols-6">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onChange(item.url);
                    setOpen(false);
                  }}
                  className={`overflow-hidden rounded-xl border text-left hover:ring-2 hover:ring-[#2271b1] ${
                    value === item.url ? "ring-2 ring-[#2271b1]" : ""
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}