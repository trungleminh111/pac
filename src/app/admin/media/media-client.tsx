"use client";

import { useMemo, useState } from "react";
import { Copy, Search, Trash2, Upload } from "lucide-react";

type Media = {
  id: string;
  filename: string;
  url: string;
  mimeType: string | null;
  size: number | null;
  altVi: string | null;
  altEn: string | null;
  createdAt: Date;
};

function formatSize(size?: number | null) {
  if (!size) return "—";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

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
    file.type === "image/png" ||
    file.type === "image/jpg";

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

export default function MediaClient({
  media,
  q,
  deleteAction,
}: {
  media: Media[];
  q: string;
  deleteAction: (formData: FormData) => void;
}) {
  const [items, setItems] = useState(media);
  const [selected, setSelected] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const allIds = useMemo(() => items.map((item) => item.id), [items]);
  const checkedAll = allIds.length > 0 && selected.length === allIds.length;

  function toggleAll() {
    setSelected(checkedAll ? [] : allIds);
  }

  function toggleOne(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  async function reloadMedia() {
    const res = await fetch("/api/admin/media");
    const data = await res.json();
    setItems(data.media || []);
  }

  async function uploadFiles(files: FileList | null) {
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

      await reloadMedia();

      if (data.failed?.length) {
        setMessage(
          `${data.message}\n${data.failed.map((x: any) => x.error).join("\n")}`
        );
      } else {
        setMessage(data.message || "Upload thành công.");
      }
    } catch (error) {
      console.error("UPLOAD_ERROR", error);
      setMessage(error instanceof Error ? error.message : "Upload thất bại.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Media</h1>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white hover:bg-[#195f96]">
          <Upload className="h-4 w-4" />
          {uploading ? "Đang upload..." : "Upload ảnh"}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            multiple
            hidden
            disabled={uploading}
            onChange={async (e) => {
              await uploadFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {message && (
        <div className="whitespace-pre-line rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          {message}
        </div>
      )}

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <form className="grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Tìm theo tên file hoặc alt..."
              className="w-full rounded-xl border px-10 py-3 text-sm outline-none focus:border-[#2271b1]"
            />
          </div>

          <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
            Tìm kiếm
          </button>
        </form>
      </div>

      <form action={deleteAction}>
        {selected.map((id) => (
          <input key={id} type="hidden" name="ids" value={id} />
        ))}

        <div className="mb-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-500">
            <input type="checkbox" checked={checkedAll} onChange={toggleAll} />
            Chọn tất cả
          </label>

          <button
            type="submit"
            disabled={selected.length === 0}
            onClick={(e) => {
              if (!confirm(`Xóa ${selected.length} media đã chọn?`)) {
                e.preventDefault();
              }
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
            Xóa đã chọn
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm"
            >
              <div className="relative">
                <img
                  src={item.url}
                  alt={item.altVi || item.filename}
                  className="aspect-square w-full object-cover"
                />

                <input
                  type="checkbox"
                  checked={selected.includes(item.id)}
                  onChange={() => toggleOne(item.id)}
                  className="absolute left-3 top-3 h-4 w-4"
                />
              </div>

              <div className="space-y-2 p-4">
                <div className="truncate text-sm font-semibold text-slate-900">
                  {item.filename}
                </div>

                <div className="text-xs text-slate-500">
                  {item.mimeType || "—"} • {formatSize(item.size)}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(item.url);
                    setMessage("Đã copy URL ảnh.");
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#2271b1]"
                >
                  <Copy className="h-3 w-3" />
                  Copy URL
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="rounded-2xl border bg-white px-5 py-10 text-center text-sm text-slate-500">
            Chưa có media nào.
          </div>
        )}
      </form>
    </div>
  );
}