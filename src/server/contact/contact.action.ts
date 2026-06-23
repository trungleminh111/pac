"use server";

import nodemailer from "nodemailer";
import type { SendMailOptions } from "nodemailer";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  buildContactEmailHtml,
  buildContactEmailText,
} from "@/lib/contact-email-template";

type ContactActionResult = {
  ok: boolean;
  message: string;
};

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "dwg",
  "dxf",
  "jpg",
  "jpeg",
  "png",
  "webp",
];

function cleanText(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase().trim() || "";
}

function absoluteSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

function normalizeProductUrl(productUrl: string) {
  if (!productUrl) return "";

  if (productUrl.startsWith("http://") || productUrl.startsWith("https://")) {
    return productUrl;
  }

  if (productUrl.startsWith("/")) {
    return `${absoluteSiteUrl()}${productUrl}`;
  }

  return `${absoluteSiteUrl()}/${productUrl}`;
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  if (!token) return false;

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: ip,
      }),
    }
  );

  const data = (await response.json()) as {
    success?: boolean;
  };

  return Boolean(data.success);
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("Missing SMTP config");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendContactEmailAction(
  formData: FormData
): Promise<ContactActionResult> {
  try {
    const requestHeaders = await headers();

    const ip =
      requestHeaders.get("cf-connecting-ip") ||
      requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      requestHeaders.get("x-real-ip") ||
      "unknown";

    const name = cleanText(formData.get("name"));
    const email = cleanText(formData.get("email"));
    const phone = cleanText(formData.get("phone"));
    const message = cleanText(formData.get("message"));
    const productId = cleanText(formData.get("productId"));
    const locale = cleanText(formData.get("locale")) || "vi";
    const turnstileToken = cleanText(formData.get("cf-turnstile-response"));

    const productTitleFromForm = cleanText(formData.get("productTitle"));
    const productUrlFromForm = cleanText(formData.get("productUrl"));

    if (!name || !email || !phone || !message) {
      return {
        ok: false,
        message: "Vui lòng nhập đầy đủ thông tin.",
      };
    }

    const captchaOk = await verifyTurnstile(turnstileToken, ip);

    if (!captchaOk) {
      return {
        ok: false,
        message: "Xác thực bảo mật thất bại. Vui lòng thử lại.",
      };
    }

    let productTitle = productTitleFromForm;
    let productSku = "";
    let productUrl = normalizeProductUrl(productUrlFromForm);

    if (productId && !productTitle) {
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
        select: {
          id: true,
          sku: true,
          translations: {
            where: {
              locale: locale === "en" ? "en" : "vi",
            },
            select: {
              title: true,
              slug: true,
            },
            take: 1,
          },
        },
      });

      const translation = product?.translations?.[0];

      if (product && translation) {
        productTitle = translation.title;
        productSku = product.sku || "";

        productUrl = `${absoluteSiteUrl()}/${
          locale === "en" ? "en/products" : "vi/san-pham"
        }/${translation.slug}`;
      }
    }

    const fileEntry = formData.get("attachment");
    const file =
      fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;

    const attachments: NonNullable<SendMailOptions["attachments"]> = [];

    let fileName = "";
    let fileSizeKb = 0;

    if (file) {
      const ext = getFileExtension(file.name);

      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return {
          ok: false,
          message: `File không hợp lệ. Chỉ cho phép: ${ALLOWED_EXTENSIONS.join(
            ", "
          )}.`,
        };
      }

      if (file.size > MAX_FILE_SIZE) {
        return {
          ok: false,
          message: `File không được vượt quá ${MAX_FILE_SIZE_MB}MB.`,
        };
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      fileName = file.name;
      fileSizeKb = Math.round(file.size / 1024);

      attachments.push({
        filename: file.name,
        content: buffer,
        contentType: file.type || "application/octet-stream",
      });
    }

    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER;
    const fromName = process.env.CONTACT_FROM_NAME || "Website Contact";

    if (!receiverEmail || !fromEmail) {
      throw new Error("Missing CONTACT_RECEIVER_EMAIL or CONTACT_FROM_EMAIL");
    }

    const subject = productTitle
      ? `[P.A.C STONE] Khách liên hệ sản phẩm: ${productTitle}`
      : `[P.A.C STONE] Khách gửi liên hệ mới`;

    const sourceUrl = requestHeaders.get("referer") || "";

    const emailData = {
      name,
      email,
      phone,
      message,
      productTitle,
      productSku,
      productUrl,
      fileName,
      fileSizeKb,
      sourceUrl,
    };

    const transporter = createTransporter();

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: receiverEmail,
      replyTo: email,
      subject,
      html: buildContactEmailHtml(emailData),
      text: buildContactEmailText(emailData),
      attachments,
    });

    console.log("CONTACT_MAIL_SENT", {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
      envelope: info.envelope,
    });

    return {
      ok: true,
      message: "Gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm nhất!",
    };
  } catch (error) {
    console.error("CONTACT_SEND_EMAIL_ERROR", error);

    return {
      ok: false,
      message: "Gửi liên hệ thất bại. Vui lòng thử lại sau.",
    };
  }
}