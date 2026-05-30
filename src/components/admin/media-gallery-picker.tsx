"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Trash2, X } from "lucide-react";

type Media = {
  id: string;
  filename: string;
  url: string;
};

export function MediaGalleryPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Media[]>([]);
  const [uploading, setUploading] = useState(false);

  async function loadMedia() {
    const res = await fetch("/api/admin/media");
    const data = await res.json();
    setItems(data.media || []);
  }

  async function upload(file: File) {
    setUploading(true);

    const formData = new FormData();
    formData.append("upload", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.url) {
      onChange([...value, data.url]);
      await loadMedia();
    }

    setUploading(false);
  }

  function toggleImage(url: string) {
    if (value.includes(url)) {
      onChange(value.filter((item) => item !== url));
    } else {
      onChange([...value, url]);
    }
  }

  function removeImage(url: string) {
    onChange(value.filter((item) => item !== url));
  }

  useEffect(() => {
    if (open) loadMedia();
  }, [open]);

  return (
    <div className="space-y-4">
      {value.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {value.map((url) => (
            <div key={url} className="group relative overflow-hidden rounded-xl border">
              <img src={url} alt="" className="aspect-square w-full object-cover" />

              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-2 top-2 hidden rounded-full bg-red-600 p-1 text-white group-hover:block"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed text-slate-400">
          Chưa có ảnh gallery
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-slate-50"
      >
        <ImagePlus className="h-4 w-4" />
        Chọn nhiều ảnh / Upload mới
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 p-6">
          <div className="mx-auto max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-semibold">Chọn ảnh sản phẩm</h2>

              <button type="button" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center justify-between border-b p-5">
              <label className="inline-flex cursor-pointer rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white">
                {uploading ? "Đang upload..." : "Upload ảnh mới"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) upload(file);
                  }}
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

            <div className="grid max-h-[60vh] grid-cols-2 gap-4 overflow-y-auto p-5 md:grid-cols-4 lg:grid-cols-6">
              {items.map((item) => {
                const active = value.includes(item.url);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleImage(item.url)}
                    className={`overflow-hidden rounded-xl border text-left hover:ring-2 hover:ring-[#2271b1] ${
                      active ? "ring-2 ring-[#2271b1]" : ""
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}