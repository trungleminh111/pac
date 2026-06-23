"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
} from "react";
import {
  Check,
  Crop,
  ImagePlus,
  Minus,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";

type Media = {
  id: string;
  filename: string;
  url: string;
};

export type ProductImageCrop = {
  url: string;
  imageLeftPct: number;
  imageTopPct: number;
  imageWidthPct: number;
  imageHeightPct: number;
};

type ProductMediaPickerProps = {
  value: string;
  onChange: (url: string) => void;
  cropValue?: ProductImageCrop | null;
  onCropChange?: (crop: ProductImageCrop | null) => void;
  requiredWidth?: number;
  requiredHeight?: number;
  tolerance?: number;
  variant?: "default" | "compact";
  buttonText?: string;
};

type CropToolProps = {
  src: string;
  aspectRatio: number;
  initialCrop?: ProductImageCrop | null;
  onConfirm: (crop: ProductImageCrop) => void;
  onCancel: () => void;
};

type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

function sizeLabel(w: number, h: number) {
  return `${w} × ${h} px`;
}

function isDataOrBlobUrl(src: string) {
  return src.startsWith("data:") || src.startsWith("blob:");
}

function shouldSetCrossOrigin(src: string) {
  if (!src || isDataOrBlobUrl(src) || src.startsWith("/")) return false;

  try {
    return new URL(src).origin !== window.location.origin;
  } catch {
    return false;
  }
}

function loadImageForSize(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Không đọc được ảnh."));

    img.src = src;
  });
}

function loadImageForCanvas(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    if (shouldSetCrossOrigin(src)) {
      img.crossOrigin = "anonymous";
    }

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Không đọc được ảnh."));

    img.src = src;
  });
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Đọc file thất bại."));

    reader.readAsDataURL(file);
  });
}

async function convertToWebp(file: File): Promise<File> {
  const canConvert = ["image/jpeg", "image/jpg", "image/png"].includes(
    file.type
  );

  if (!canConvert) return file;

  let objectUrl = "";

  try {
    objectUrl = URL.createObjectURL(file);

    const img = await loadImageForCanvas(objectUrl);

    const maxWidth = 1920;
    const scale = img.naturalWidth > maxWidth ? maxWidth / img.naturalWidth : 1;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);

    const ctx = canvas.getContext("2d");

    if (!ctx) return file;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/webp", 0.78);
    });

    if (!blob) return file;

    return new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

function getCropBox(stageW: number, stageH: number, aspectRatio: number): Rect {
  const padding = stageW < 640 ? 28 : 56;
  const availableW = Math.max(120, stageW - padding * 2);
  const availableH = Math.max(120, stageH - padding * 2);
  const availableRatio = availableW / availableH;

  let w = availableW;
  let h = availableH;

  if (aspectRatio >= availableRatio) {
    w = availableW;
    h = w / aspectRatio;
  } else {
    h = availableH;
    w = h * aspectRatio;
  }

  return {
    x: (stageW - w) / 2,
    y: (stageH - h) / 2,
    w,
    h,
  };
}

function getImageBox(
  stageW: number,
  stageH: number,
  naturalW: number,
  naturalH: number
): Rect {
  const imageRatio = naturalW / naturalH;
  const stageRatio = stageW / stageH;

  let w = stageW;
  let h = stageH;

  if (imageRatio >= stageRatio) {
    w = stageW;
    h = stageW / imageRatio;
  } else {
    h = stageH;
    w = stageH * imageRatio;
  }

  return {
    x: (stageW - w) / 2,
    y: (stageH - h) / 2,
    w,
    h,
  };
}

function roundCropNumber(value: number) {
  return Math.round(value * 1000000) / 1000000;
}

function isValidCrop(crop?: ProductImageCrop | null, src?: string) {
  if (!crop) return false;
  if (src && crop.url !== src) return false;

  return (
    typeof crop.imageLeftPct === "number" &&
    typeof crop.imageTopPct === "number" &&
    typeof crop.imageWidthPct === "number" &&
    typeof crop.imageHeightPct === "number" &&
    Number.isFinite(crop.imageLeftPct) &&
    Number.isFinite(crop.imageTopPct) &&
    Number.isFinite(crop.imageWidthPct) &&
    Number.isFinite(crop.imageHeightPct) &&
    crop.imageWidthPct > 0 &&
    crop.imageHeightPct > 0
  );
}

export function CroppedProductImage({
  src,
  crop,
  alt = "",
  objectFit = "cover",
  className = "",
}: {
  src: string;
  crop?: ProductImageCrop | null;
  alt?: string;
  objectFit?: string;
  className?: string;
}) {
  if (!src) return null;

  if (isValidCrop(crop, src)) {
    return (
      <img
        src={crop!.url}
        alt={alt}
        draggable={false}
        className={`absolute max-h-none max-w-none select-none ${className}`}
        style={{
          left: `${crop!.imageLeftPct * 100}%`,
          top: `${crop!.imageTopPct * 100}%`,
          width: `${crop!.imageWidthPct * 100}%`,
          height: `${crop!.imageHeightPct * 100}%`,
          objectFit: "fill",
          display: "block",
        }}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className={`h-full w-full select-none ${className}`}
      style={{
        objectFit: objectFit as CSSProperties["objectFit"],
        display: "block",
      }}
    />
  );
}

function SizeBadge({
  ok,
  actual,
  required,
}: {
  ok: boolean;
  actual: string;
  required: string;
}) {
  return (
    <div
      className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
        ok
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {ok ? <Check size={13} /> : <Crop size={13} />}
      {ok
        ? `Đúng kích thước (${actual})`
        : `Ảnh ${actual} — yêu cầu ${required}`}
    </div>
  );
}

function CropTool({
  src,
  aspectRatio,
  initialCrop,
  onConfirm,
  onCancel,
}: CropToolProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const initialAppliedRef = useRef(false);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    startPanX: number;
    startPanY: number;
  } | null>(null);

  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [stageSize, setStageSize] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [ready, setReady] = useState(false);

  const cropBox = useMemo(() => {
    if (!stageSize.w || !stageSize.h) return null;
    return getCropBox(stageSize.w, stageSize.h, aspectRatio);
  }, [stageSize, aspectRatio]);

  const imageBox = useMemo(() => {
    if (!stageSize.w || !stageSize.h || !naturalSize.w || !naturalSize.h) {
      return null;
    }

    return getImageBox(
      stageSize.w,
      stageSize.h,
      naturalSize.w,
      naturalSize.h
    );
  }, [stageSize, naturalSize]);

  useEffect(() => {
    setReady(false);
    setLoadError(false);
    setNaturalSize({ w: 0, h: 0 });
    setPan({ x: 0, y: 0 });
    setZoom(1);
    imgRef.current = null;
    initialAppliedRef.current = false;
  }, [src]);

  useEffect(() => {
    if (!src) return;

    let disposed = false;

    const img = new Image();

    img.onload = () => {
      if (disposed) return;

      imgRef.current = img;
      setNaturalSize({
        w: img.naturalWidth,
        h: img.naturalHeight,
      });
      setReady(true);
    };

    img.onerror = () => {
      if (disposed) return;

      console.error("Crop image load failed:", src);
      setLoadError(true);
      setReady(false);
    };

    img.src = src;

    return () => {
      disposed = true;
    };
  }, [src]);

  useEffect(() => {
    if (!stageRef.current) return;

    const update = () => {
      if (!stageRef.current) return;

      setStageSize({
        w: stageRef.current.clientWidth,
        h: stageRef.current.clientHeight,
      });
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(stageRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (
      initialAppliedRef.current ||
      !ready ||
      !initialCrop ||
      initialCrop.url !== src ||
      !cropBox ||
      !imageBox ||
      !isValidCrop(initialCrop, src)
    ) {
      return;
    }

    const nextZoom = Math.min(
      4,
      Math.max(0.2, (initialCrop.imageWidthPct * cropBox.w) / imageBox.w)
    );

    const visualW = imageBox.w * nextZoom;
    const visualH = imageBox.h * nextZoom;

    const visualX = cropBox.x + initialCrop.imageLeftPct * cropBox.w;
    const visualY = cropBox.y + initialCrop.imageTopPct * cropBox.h;

    const nextPanX = visualX - imageBox.x + (visualW - imageBox.w) / 2;
    const nextPanY = visualY - imageBox.y + (visualH - imageBox.h) / 2;

    setZoom(Number(nextZoom.toFixed(2)));
    setPan({ x: nextPanX, y: nextPanY });

    initialAppliedRef.current = true;
  }, [ready, initialCrop, cropBox, imageBox, src]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (!dragRef.current) return;

      const dx = event.clientX - dragRef.current.startX;
      const dy = event.clientY - dragRef.current.startY;

      setPan({
        x: dragRef.current.startPanX + dx,
        y: dragRef.current.startPanY + dy,
      });
    };

    const onUp = () => {
      dragRef.current = null;
      setDragging(false);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!ready) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    event.preventDefault();

    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };

    setDragging(true);
  }

  function changeZoom(nextZoom: number) {
    const safeZoom = Math.min(4, Math.max(0.2, nextZoom));
    setZoom(Number(safeZoom.toFixed(2)));
  }

  function handleReset() {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  }

  function handleConfirm() {
    if (!imageBox || !cropBox || !naturalSize.w || !naturalSize.h) return;

    if (loadError) {
      alert("Không thể tải ảnh để cắt.");
      return;
    }

    const visualW = imageBox.w * zoom;
    const visualH = imageBox.h * zoom;

    const visualX = imageBox.x + pan.x - (visualW - imageBox.w) / 2;
    const visualY = imageBox.y + pan.y - (visualH - imageBox.h) / 2;

    const crop: ProductImageCrop = {
      url: src,
      imageLeftPct: roundCropNumber((visualX - cropBox.x) / cropBox.w),
      imageTopPct: roundCropNumber((visualY - cropBox.y) / cropBox.h),
      imageWidthPct: roundCropNumber(visualW / cropBox.w),
      imageHeightPct: roundCropNumber(visualH / cropBox.h),
    };

    onConfirm(crop);
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/90">
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#111827] shadow-2xl md:h-[720px] md:max-h-[100vh] md:w-[960px] md:max-w-[100vw] md:rounded-[18px]">
        <div className="grid min-h-[64px] grid-cols-[52px_1fr_52px] items-center bg-[#20252b] px-3 text-slate-50">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-12 w-12 items-center justify-center rounded-full text-slate-200 hover:bg-white/10"
          >
            <X size={30} />
          </button>

          <h2 className="text-[20px] font-extrabold leading-tight">Cắt ảnh</h2>

          <button
            type="button"
            onClick={onCancel}
            className="flex h-12 w-12 items-center justify-center rounded-full text-slate-200 hover:bg-white/10"
          >
            <X size={30} />
          </button>
        </div>

        <div
          ref={stageRef}
          onPointerDown={startDrag}
          className={`relative min-h-[320px] flex-1 touch-none select-none overflow-hidden bg-black ${
            dragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {loadError ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-white/60">
              <X size={38} className="text-red-400" />
              <p>Không tải được ảnh. Vui lòng upload ảnh mới.</p>
            </div>
          ) : !ready || !imageBox || !cropBox ? (
            <div className="flex h-full items-center justify-center gap-2 text-sm text-white/60">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              Đang tải ảnh...
            </div>
          ) : (
            <>
              <img
                src={src}
                alt=""
                draggable={false}
                className="pointer-events-none absolute z-[1] max-h-none max-w-none select-none"
                style={{
                  left: imageBox.x + pan.x,
                  top: imageBox.y + pan.y,
                  width: imageBox.w,
                  height: imageBox.h,
                  transform: `scale(${zoom})`,
                  transformOrigin: "center center",
                }}
              />

              <div
                className="pointer-events-none absolute left-0 right-0 top-0 z-[3] bg-black/60"
                style={{ height: cropBox.y }}
              />
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 z-[3] bg-black/60"
                style={{ top: cropBox.y + cropBox.h }}
              />
              <div
                className="pointer-events-none absolute left-0 z-[3] bg-black/60"
                style={{
                  top: cropBox.y,
                  width: cropBox.x,
                  height: cropBox.h,
                }}
              />
              <div
                className="pointer-events-none absolute right-0 z-[3] bg-black/60"
                style={{
                  top: cropBox.y,
                  left: cropBox.x + cropBox.w,
                  height: cropBox.h,
                }}
              />

              <div
                className="pointer-events-none absolute z-[4] border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.35),0_0_40px_rgba(0,0,0,0.25)]"
                style={{
                  left: cropBox.x,
                  top: cropBox.y,
                  width: cropBox.w,
                  height: cropBox.h,
                }}
              >
                <div className="absolute left-1/3 top-0 h-full border-l border-white/35" />
                <div className="absolute left-2/3 top-0 h-full border-l border-white/35" />
                <div className="absolute left-0 top-1/3 w-full border-t border-white/35" />
                <div className="absolute left-0 top-2/3 w-full border-t border-white/35" />
              </div>
            </>
          )}
        </div>

        <div className="border-t border-white/10 bg-[#20252b] px-4 py-4 text-white">
          <div className="mb-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={!ready}
              className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40"
            >
              <RotateCcw size={17} />
              Reset
            </button>

            <div className="rounded-full bg-black/25 px-3 py-1 text-xs font-bold text-slate-200">
              {Math.round(zoom * 100)}%
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!ready}
              onClick={() => changeZoom(zoom - 0.05)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-100 hover:bg-white/20 disabled:opacity-40"
            >
              <Minus size={18} />
            </button>

            <input
              type="range"
              min="0.2"
              max="4"
              step="0.01"
              value={zoom}
              disabled={!ready}
              onChange={(event) => changeZoom(Number(event.target.value))}
              className="h-2 w-full cursor-pointer accent-[#0ea5e9]"
            />

            <button
              type="button"
              disabled={!ready}
              onClick={() => changeZoom(zoom + 0.05)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-100 hover:bg-white/20 disabled:opacity-40"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-200 hover:bg-white/10"
            >
              Hủy
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!ready || loadError}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-emerald-600 disabled:opacity-40"
            >
              <Check size={18} />
              Xác nhận cắt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductMediaPicker({
  value,
  onChange,
  cropValue,
  onCropChange,
  requiredWidth = 270,
  requiredHeight = 180,
  tolerance = 10,
  variant = "default",
  buttonText = "Chọn ảnh / Upload mới",
}: ProductMediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Media[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [sizeOk, setSizeOk] = useState<boolean | null>(null);
  const [actualSize, setActualSize] = useState("");

  const isCompact = variant === "compact";
  const requiredLabel = sizeLabel(requiredWidth, requiredHeight);
  const aspectRatio = requiredWidth / requiredHeight;

  async function loadMedia() {
    try {
      const res = await fetch("/api/admin/media", {
        cache: "no-store",
      });

      const data = await res.json();

      setItems(data.media || []);
    } catch {
      setItems([]);
    }
  }

  async function checkSize(
    imgSrc: string
  ): Promise<{ ok: boolean; w: number; h: number }> {
    const img = await loadImageForSize(imgSrc);

    const ok =
      Math.abs(img.naturalWidth - requiredWidth) <= tolerance &&
      Math.abs(img.naturalHeight - requiredHeight) <= tolerance;

    return {
      ok,
      w: img.naturalWidth,
      h: img.naturalHeight,
    };
  }

  async function uploadToServer(file: File) {
    const formData = new FormData();
    const optimized = await convertToWebp(file);

    formData.append("upload", optimized);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Upload thất bại.");
      return null;
    }

    return data.url ?? null;
  }

  async function handleFileSelect(files: FileList | null) {
    if (!files?.length || uploading) return;

    const file = files[0];

    try {
      setUploading(true);
      setMessage("Đang kiểm tra kích thước...");

      const dataUrl = await fileToDataUrl(file);
      const { ok, w, h } = await checkSize(dataUrl);

      setActualSize(sizeLabel(w, h));
      setSizeOk(ok);

      setMessage("Đang upload ảnh gốc...");
      const uploadedUrl = await uploadToServer(file);

      if (!uploadedUrl) return;

      await loadMedia();

      if (ok) {
        onChange(uploadedUrl);
        onCropChange?.(null);
        setMessage("Upload thành công.");
        setOpen(false);
        return;
      }

      setMessage(
        `Ảnh ${sizeLabel(w, h)} không đúng kích thước. Vui lòng cắt ảnh.`
      );

      setCropSrc(uploadedUrl);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Lỗi không xác định.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSelectExisting(item: Media) {
    setMessage("Đang kiểm tra kích thước...");

    try {
      const { ok, w, h } = await checkSize(item.url);

      setActualSize(sizeLabel(w, h));
      setSizeOk(ok);

      if (ok) {
        onChange(item.url);
        onCropChange?.(null);
        setOpen(false);
        setMessage("");
        return;
      }

      setMessage(`Ảnh ${sizeLabel(w, h)} không đúng. Vui lòng cắt lại.`);
      setCropSrc(item.url);
    } catch {
      setMessage("Không kiểm tra được kích thước ảnh.");
    }
  }

  function handleCropConfirm(crop: ProductImageCrop) {
    setCropSrc(null);

    onChange(crop.url);
    onCropChange?.(crop);

    setActualSize(requiredLabel);
    setSizeOk(true);
    setMessage("");
    setOpen(false);
  }

  function handleCropCancel() {
    setCropSrc(null);
    setMessage("");
    setSizeOk(null);
  }

  function handleRemove() {
    onChange("");
    onCropChange?.(null);
  }

  function handleRecrop() {
    if (!value) return;
    setCropSrc(value);
  }

  useEffect(() => {
    if (!open) return;

    loadMedia();
    setMessage("");
    setSizeOk(null);
    setActualSize("");
  }, [open]);

  return (
    <>
      {cropSrc && (
        <CropTool
          src={cropSrc}
          aspectRatio={aspectRatio}
          initialCrop={cropValue?.url === cropSrc ? cropValue : null}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}

      <div className="space-y-3">
        {isCompact ? (
          <div className="flex items-center gap-3">
            {value ? (
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                <CroppedProductImage
                  src={value}
                  crop={cropValue}
                  alt=""
                  className="pointer-events-none"
                />

                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute right-1 top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-600 text-white"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-slate-400">
                <ImagePlus size={20} />
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                {value ? "Đổi ảnh" : "Chọn ảnh"}
              </button>

              {value && (
                <button
                  type="button"
                  onClick={handleRecrop}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cắt lại
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {value ? (
              <div
                className="relative overflow-hidden rounded-xl border bg-white"
                style={{ aspectRatio: `${requiredWidth} / ${requiredHeight}` }}
              >
                <CroppedProductImage
                  src={value}
                  crop={cropValue}
                  alt=""
                  className="pointer-events-none"
                />

                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white"
                >
                  <X size={16} />
                </button>

                <button
                  type="button"
                  onClick={handleRecrop}
                  className="absolute bottom-2 left-2 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-bold text-white hover:bg-black/85"
                >
                  Cắt lại
                </button>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-400"
                style={{ aspectRatio: `${requiredWidth} / ${requiredHeight}` }}
              >
                <ImagePlus size={26} />
                <span>Chưa chọn ảnh</span>
                <small>Yêu cầu: {requiredLabel}</small>
              </div>
            )}

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <ImagePlus size={17} />
              {buttonText}
            </button>
          </>
        )}

        {open && (
          <div className="fixed inset-0 z-50 bg-slate-950/45 p-4 md:p-6">
            <div className="mx-auto flex max-h-[90vh] max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">
                    Chọn ảnh sản phẩm
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Kích thước yêu cầu:{" "}
                    <strong className="text-slate-700">{requiredLabel}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 border-b p-4">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#2271b1] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#1a5a8f]">
                  {uploading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <ImagePlus size={17} />
                      Upload ảnh mới
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                    hidden
                    disabled={uploading}
                    onChange={(event) => {
                      handleFileSelect(event.target.files);
                      event.target.value = "";
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-slate-700"
                >
                  Xong
                </button>
              </div>

              {message && (
                <div
                  className={`mx-4 mt-4 whitespace-pre-line rounded-xl border px-4 py-3 text-sm ${
                    message.includes("thành công")
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : sizeOk === false
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-blue-200 bg-blue-50 text-blue-700"
                  }`}
                >
                  {message}

                  {sizeOk !== null && actualSize && (
                    <div>
                      <SizeBadge
                        ok={sizeOk}
                        actual={actualSize}
                        required={requiredLabel}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="grid max-h-[58vh] grid-cols-2 gap-3 overflow-y-auto p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectExisting(item)}
                    className={`group relative aspect-square w-full overflow-hidden rounded-xl border bg-slate-50 transition hover:ring-2 hover:ring-[#2271b1] ${
                      value === item.url ? "ring-2 ring-[#2271b1]" : ""
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="h-full w-full object-cover"
                    />

                    <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                      <span className="rounded-full bg-white/90 p-2 text-slate-700 shadow">
                        <Crop size={18} />
                      </span>
                    </span>

                    {value === item.url && (
                      <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#2271b1] text-white shadow">
                        <Check size={13} />
                      </span>
                    )}
                  </button>
                ))}

                {items.length === 0 && (
                  <div className="col-span-full flex min-h-[190px] flex-col items-center justify-center gap-2 text-slate-400">
                    <ImagePlus size={36} />
                    <p className="text-sm">
                      Chưa có ảnh nào. Upload ảnh đầu tiên!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}