"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Trash2, X } from "lucide-react";

type Media = {
  id: string;
  filename: string;
  url: string;
};

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Không đọc được ảnh."));
    };

    img.src = url;
  });
}

async function convertToWebp(file: File) {
  const shouldConvert =
    file.type === "image/jpeg" ||
    file.type === "image/jpg" ||
    file.type === "image/png";

  if (!shouldConvert) return file;

  try {
    const img = await loadImage(file);

    const maxWidth = 1920;
    const quality = 0.75;

    const scale = img.width > maxWidth ? maxWidth / img.width : 1;
    const width = Math.round(img.width * scale);
    const height = Math.round(img.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", quality);
    });

    if (!blob) return file;

    const name = file.name.replace(/\.[^/.]+$/, "");

    return new File([blob], `${name}.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("CONVERT_WEBP_ERROR", file.name, error);
    return file;
  }
}

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
  const [message, setMessage] = useState("");

  async function loadMedia() {
    const res = await fetch("/api/admin/media");
    const data = await res.json();
    setItems(data.media || []);
  }

  async function upload(files: FileList | null) {
    if (!files?.length || uploading) return;

    try {
      setUploading(true);
      setMessage("Đang nén ảnh sang WebP...");

      const formData = new FormData();

      for (const file of Array.from(files)) {
        const optimizedFile = await convertToWebp(file);
        formData.append("upload", optimizedFile);
      }

      setMessage("Đang upload ảnh...");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(
          data.error || data.failed?.[0]?.error || "Upload thất bại."
        );
        return;
      }

      const uploadedUrls = Array.isArray(data.success)
        ? data.success
            .map((item: { url?: string }) => item.url)
            .filter((url: string | undefined): url is string => Boolean(url))
        : data.url
          ? [data.url]
          : [];

      if (uploadedUrls.length) {
        onChange(Array.from(new Set([...value, ...uploadedUrls])));
      }

      if (data.failed?.length) {
        setMessage(
          `${data.message}\n${data.failed
            .map((x: { error: string }) => x.error)
            .join("\n")}`
        );
      } else {
        setMessage(data.message || "Upload thành công.");
      }

      await loadMedia();
    } catch (error) {
      console.error("UPLOAD_ERROR", error);
      setMessage(error instanceof Error ? error.message : "Upload thất bại.");
    } finally {
      setUploading(false);
    }
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
            <div
              key={url}
              className="group relative overflow-hidden rounded-xl border"
            >
              <img
                src={url}
                alt=""
                className="aspect-square w-full object-cover"
              />

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
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                  multiple
                  hidden
                  disabled={uploading}
                  onChange={async (e) => {
                    await upload(e.target.files);
                    e.target.value = "";
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

            {message && (
              <div className="m-5 whitespace-pre-line rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                {message}
              </div>
            )}

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