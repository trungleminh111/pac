import crypto from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { r2 } from "@/lib/r2";
import { prisma } from "@/lib/prisma";
import { getAdminSettings } from "@/lib/settings";

// 👈 Bỏ "import sharp from 'sharp'" ở đầu file đi

function cleanFileName(name: string) {
  return name
    .replace(/\.[^/.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-");
}

async function handleUploadFile(
  file: File,
  maxSizeMb: number,
  allowedTypes: string[]
) {
  if (!allowedTypes.includes(file.type)) {
    return {
      ok: false,
      filename: file.name,
      error: `File "${file.name}" không đúng định dạng.`,
    };
  }

  if (file.size > maxSizeMb * 1024 * 1024) {
    return {
      ok: false,
      filename: file.name,
      error: `File "${file.name}" vượt quá ${maxSizeMb}MB.`,
    };
  }

  const arrayBuffer = await file.arrayBuffer();
  const originalBuffer = Buffer.from(arrayBuffer) as Buffer<ArrayBuffer>;

  const hash = crypto
    .createHash("sha256")
    .update(originalBuffer)
    .digest("hex");

  const existed = await prisma.media.findFirst({
    where: { hash },
  });

  if (existed) {
    return {
      ok: true,
      reused: true,
      filename: file.name,
      url: existed.url,
      media: existed,
    };
  }

  const baseName = cleanFileName(file.name) || "image";

  let uploadBuffer: Buffer<ArrayBuffer> = originalBuffer;
  let contentType = file.type;
  let filename = file.name;
  let ext = file.name.split(".").pop() || "file";

  if (file.type !== "image/gif" && file.type !== "image/svg+xml") {
    // 👇 Dynamic import thay vì static import
    const sharp = (await import("sharp")).default;

    uploadBuffer = (await sharp(originalBuffer)
      .rotate()
      .resize({
        width: 1920,
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toBuffer()) as Buffer<ArrayBuffer>;

    contentType = "image/webp";
    filename = `${baseName}.webp`;
    ext = "webp";
  }

  const key = `media/${new Date().getFullYear()}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.CF_R2_BUCKET_NAME!,
      Key: key,
      Body: uploadBuffer,
      ContentType: contentType,
    })
  );

  const url = `${process.env.NEXT_PUBLIC_CDN_URL}/${key}`;

  const media = await prisma.media.create({
    data: {
      filename,
      key,
      url,
      mimeType: contentType,
      size: uploadBuffer.length,
      hash,
    },
  });

  return {
    ok: true,
    reused: false,
    filename,
    url,
    media,
  };
}

export async function POST(req: Request) {
  try {
    const settings = await getAdminSettings();

    const maxSizeMb = Number(settings.uploadMaxSizeMb || 30);

    const allowedTypes = String(
      settings.uploadAllowedTypes ||
        "image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
    )
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const formData = await req.formData();

    const files = formData
      .getAll("upload")
      .filter((item): item is File => item instanceof File);

    if (!files.length) {
      return NextResponse.json(
        {
          uploaded: false,
          error: "Vui lòng chọn file để upload.",
        },
        { status: 400 }
      );
    }

    const results = [];

    for (const file of files) {
      try {
        results.push(await handleUploadFile(file, maxSizeMb, allowedTypes));
      } catch (error) {
        console.error("UPLOAD_FILE_ERROR", file.name, error);

        results.push({
          ok: false,
          filename: file.name,
          error: `Upload file "${file.name}" thất bại.`,
        });
      }
    }

    const success = results.filter((item) => item.ok);
    const failed = results.filter((item) => !item.ok);

    return NextResponse.json(
      {
        uploaded: success.length > 0,
        success,
        failed,
        url: success[0]?.url || null,
        default: success[0]?.url || null,
        media: success[0]?.media || null,
        message:
          failed.length > 0
            ? `Upload thành công ${success.length} file, lỗi ${failed.length} file.`
            : `Upload thành công ${success.length} file.`,
      },
      {
        status: failed.length > 0 && success.length === 0 ? 400 : 200,
      }
    );
  } catch (error) {
    console.error("UPLOAD_ERROR", error);

    return NextResponse.json(
      {
        uploaded: false,
        error:
          "Upload thất bại. Vui lòng kiểm tra cấu hình R2 hoặc dung lượng file.",
      },
      { status: 500 }
    );
  }
}