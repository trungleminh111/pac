"use client";

import { useEffect, useRef, useTransition } from "react";
import { LuUpload, LuX } from "react-icons/lu";
import { useToast } from "@/components/ui/Toast provider";
import { sendContactEmailAction } from "@/server/contact/contact.action";

type Props = {
  locale: string;
  productId: string;
  productTitle: string;
  productUrl: string;
  turnstileSiteKey: string;
  fileSizeAlert: string;
  captchaAlert: string;
  errorMessage: string;
  uploadText: string;
  submitText: string;
  formTitle: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  messagePlaceholder: string;
};

const CONTACT_FILE_MAX_MB = 10;
const CONTACT_FILE_MAX_SIZE = CONTACT_FILE_MAX_MB * 1024 * 1024;
const CONTACT_FILE_ACCEPT = ".pdf,.doc,.docx,.dwg,.dxf,.jpg,.jpeg,.png,.webp";

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: { sitekey: string }) => string;
      reset: (widgetId?: string) => void;
    };
    __contactTurnstileWidgetId?: string;
  }
}

export default function ContactForm({
  locale,
  productId,
  productTitle,
  productUrl,
  turnstileSiteKey,
  fileSizeAlert,
  captchaAlert,
  errorMessage,
  uploadText,
  submitText,
  formTitle,
  namePlaceholder,
  emailPlaceholder,
  phonePlaceholder,
  messagePlaceholder,
}: Props) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const isSubmittingRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileLabelRef = useRef<HTMLSpanElement>(null);

  // ── Turnstile loader ──────────────────────────────────────────────────────

  const turnstileBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!turnstileSiteKey) return;

    function renderTurnstile() {
      const box = turnstileBoxRef.current;
      if (!box || !window.turnstile) return false;
      if (box.getAttribute("data-rendered") === "true") return true;

      const widgetId = window.turnstile.render(box, { sitekey: turnstileSiteKey });
      window.__contactTurnstileWidgetId = widgetId;
      box.setAttribute("data-rendered", "true");
      return true;
    }

    const existingScript = document.querySelector(
      'script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
    );

    if (existingScript) {
      renderTurnstile();
    } else {
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = renderTurnstile;
      document.body.appendChild(script);
    }

    // Retry until script is ready
    const interval = window.setInterval(() => {
      if (renderTurnstile()) window.clearInterval(interval);
    }, 300);

    return () => window.clearInterval(interval);
  }, [turnstileSiteKey]);

  // ── File helpers ───────────────────────────────────────────────────────────

  function resetFileUpload() {
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (fileLabelRef.current) fileLabelRef.current.textContent = uploadText;
    const up = document.getElementById("contact-upload-icon");
    const rm = document.getElementById("contact-remove-icon");
    if (up) up.style.display = "";
    if (rm) rm.style.display = "none";
  }

  function setSelectedFileName(fileName: string) {
    if (fileLabelRef.current)
      fileLabelRef.current.textContent = fileName || uploadText;
    const up = document.getElementById("contact-upload-icon");
    const rm = document.getElementById("contact-remove-icon");
    if (up) up.style.display = "none";
    if (rm) rm.style.display = "";
  }

  // ── Turnstile ──────────────────────────────────────────────────────────────

  function resetTurnstile() {
    window.turnstile?.reset(window.__contactTurnstileWidgetId);
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleFileButtonClick(e: React.MouseEvent) {
    e.preventDefault();
    const hasFile =
      fileInputRef.current?.files && fileInputRef.current.files.length > 0;

    if (hasFile) {
      resetFileUpload();
    } else {
      fileInputRef.current?.click();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      resetFileUpload();
      return;
    }

    if (file.size > CONTACT_FILE_MAX_SIZE) {
      showToast("error", fileSizeAlert);
      resetFileUpload();
      return;
    }

    setSelectedFileName(file.name);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmittingRef.current || isPending) return;

    const form = e.currentTarget;

    // Turnstile đôi khi inject input ra ngoài form — query rộng hơn
    const tokenInput =
      (form.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement | null) ??
      (document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement | null);

    if (turnstileBoxRef.current && !tokenInput?.value) {
      showToast("error", captchaAlert);
      return;
    }

    isSubmittingRef.current = true;

    startTransition(async () => {
      try {
        const formData = new FormData(form);

        // DEBUG — xóa sau khi fix xong
        console.log("cf-token in formData:", formData.get("cf-turnstile-response"));
        console.log("productId:", formData.get("productId"));
        console.log("productTitle:", formData.get("productTitle"));

        const result = await sendContactEmailAction(formData);

        console.log("action result:", result);

        showToast(result.ok ? "success" : "error", result.message);

        if (result.ok) {
          form.reset();
          resetFileUpload();
        }

        resetTurnstile();
      } catch (err) {
        console.error("CONTACT_SUBMIT_ERROR", err);
        showToast("error", errorMessage);
        resetTurnstile();
      } finally {
        isSubmittingRef.current = false;
      }
    });
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="contact-one__form contact-form-validated form-one"
      style={{ opacity: isPending ? 0.6 : undefined, pointerEvents: isPending ? "none" : undefined }}
    >
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="productTitle" value={productTitle} />
      <input type="hidden" name="productUrl" value={productUrl} />

      <div
        className="contact-one__form__bg"
        style={{
          backgroundImage:
            "url('/assets/images/shapes/contact-info-form-bg.png')",
        }}
      />

      <div className="contact-one__form__top">
        <h2 className="contact-one__form__title">{formTitle}</h2>
      </div>

      <div className="form-one__group form-one__group--grid">
        <div className="form-one__control form-one__control--input form-one__control--full">
          <input
            type="text"
            name="name"
            placeholder={namePlaceholder}
            autoComplete="name"
            required
          />
        </div>

        <div className="form-one__control form-one__control--full">
          <input
            type="email"
            name="email"
            placeholder={emailPlaceholder}
            autoComplete="email"
            required
          />
        </div>

        <div className="form-one__control form-one__control--full">
          <input
            type="text"
            name="phone"
            placeholder={phonePlaceholder}
            autoComplete="tel"
            inputMode="tel"
            required
          />
        </div>

        <div className="form-one__control form-one__control--mesgae form-one__control--full">
          <textarea name="message" placeholder={messagePlaceholder} required />

          <div className="button-upload">
            <button
              type="button"
              id="contact-file-button"
              onClick={handleFileButtonClick}
            >
              <span ref={fileLabelRef}>{uploadText}</span>{" "}
              <LuUpload id="contact-upload-icon" />
              <LuX
                id="contact-remove-icon"
                style={{ display: "none" }}
              />
            </button>

            <input
              ref={fileInputRef}
              id="contact-file"
              type="file"
              name="attachment"
              accept={CONTACT_FILE_ACCEPT}
              data-max-size={CONTACT_FILE_MAX_SIZE}
              aria-label={uploadText}
              hidden
              onChange={handleFileChange}
            />
          </div>
        </div>

        {turnstileSiteKey ? (
          <div
            ref={turnstileBoxRef}
            id="contact-turnstile"
            data-sitekey={turnstileSiteKey}
          />
        ) : null}

        <div className="form-one__control form-one__control--full">
          <button type="submit" className="floens-btn" disabled={isPending}>
            <span>{submitText}</span>
            <i className="icon-right-arrow sm-none">→</i>
          </button>
        </div>
      </div>
    </form>
  );
}