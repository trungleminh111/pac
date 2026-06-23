"use client";

import { useEffect, useRef, useTransition } from "react";
import { useToast } from "@/components/ui/Toast provider";
import { sendContactEmailAction } from "@/server/contact/contact.action";

type Props = {
  fileSizeAlert: string;
  captchaAlert: string;
  errorMessage: string;
  uploadText: string;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
        }
      ) => string;
      reset: (widgetId?: string) => void;
    };
    __contactTurnstileWidgetId?: string;
  }
}

export default function ContactAjaxSubmit({
  fileSizeAlert,
  captchaAlert,
  errorMessage,
  uploadText,
}: Props) {
  const { showToast } = useToast();
  const [, startTransition] = useTransition();
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    function getForm() {
      return document.getElementById("contact-form") as HTMLFormElement | null;
    }

    function getFileInput() {
      return document.getElementById("contact-file") as HTMLInputElement | null;
    }

    function getFileLabel() {
      return document.getElementById("contact-file-label");
    }

    function getUploadIcon() {
      return document.getElementById("contact-upload-icon");
    }

    function getRemoveIcon() {
      return document.getElementById("contact-remove-icon");
    }

    function resetFileUpload() {
      const fileInput = getFileInput();
      const fileLabel = getFileLabel();
      const uploadIcon = getUploadIcon();
      const removeIcon = getRemoveIcon();

      if (fileInput) {
        fileInput.value = "";
      }

      if (fileLabel) {
        fileLabel.textContent = uploadText;
      }

      if (uploadIcon) {
        uploadIcon.style.display = "";
      }

      if (removeIcon) {
        removeIcon.style.display = "none";
      }
    }

    function setSelectedFileName(fileName: string) {
      const fileLabel = getFileLabel();
      const uploadIcon = getUploadIcon();
      const removeIcon = getRemoveIcon();

      if (fileLabel) {
        fileLabel.textContent = fileName || uploadText;
      }

      if (uploadIcon) {
        uploadIcon.style.display = "none";
      }

      if (removeIcon) {
        removeIcon.style.display = "";
      }
    }

    function resetTurnstile() {
      if (window.turnstile) {
        window.turnstile.reset(window.__contactTurnstileWidgetId);
      }
    }

    function setSubmitLoading(isLoading: boolean) {
      const form = getForm();

      if (!form) return;

      const submitButton = form.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement | null;

      const submitText = submitButton?.querySelector("span");

      if (!submitButton) return;

      if (!submitButton.dataset.originalText && submitText?.textContent) {
        submitButton.dataset.originalText = submitText.textContent;
      }

      if (isLoading) {
        submitButton.disabled = true;
        submitButton.style.opacity = "0.6";
        submitButton.style.pointerEvents = "none";

        if (submitText) {
          const originalText = submitButton.dataset.originalText || "";

          submitText.textContent =
            originalText.toLowerCase().includes("send")
              ? "Sending..."
              : "Đang gửi...";
        }

        return;
      }

      submitButton.disabled = false;
      submitButton.style.opacity = "";
      submitButton.style.pointerEvents = "";

      if (submitText && submitButton.dataset.originalText) {
        submitText.textContent = submitButton.dataset.originalText;
      }
    }

    function renderTurnstile() {
      const box = document.getElementById("contact-turnstile");

      if (!box) return false;

      const sitekey = box.getAttribute("data-sitekey");

      if (!sitekey) return false;

      if (!window.turnstile) return false;

      if (box.getAttribute("data-rendered") === "true") {
        return true;
      }

      const widgetId = window.turnstile.render(box, {
        sitekey,
      });

      window.__contactTurnstileWidgetId = widgetId;
      box.setAttribute("data-rendered", "true");

      return true;
    }

    function loadTurnstileScript() {
      const box = document.getElementById("contact-turnstile");

      if (!box) return;

      const existedScript = document.querySelector(
        'script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
      );

      if (existedScript) {
        renderTurnstile();
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = renderTurnstile;

      document.body.appendChild(script);
    }

    function handleDocumentClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const fileButton = target?.closest("#contact-file-button");

      if (!fileButton) return;

      event.preventDefault();

      const fileInput = getFileInput();
      const hasFile = fileInput?.files && fileInput.files.length > 0;

      if (hasFile) {
        resetFileUpload();
        return;
      }

      fileInput?.click();
    }

    function handleDocumentChange(event: Event) {
      const target = event.target as HTMLInputElement | null;

      if (!target || target.id !== "contact-file") return;

      const file = target.files?.[0];
      const maxSize = Number(target.getAttribute("data-max-size") || "0");

      if (!file) {
        resetFileUpload();
        return;
      }

      if (maxSize && file.size > maxSize) {
        showToast("error", fileSizeAlert);
        resetFileUpload();
        return;
      }

      setSelectedFileName(file.name);
    }

    function handleDocumentSubmit(event: SubmitEvent) {
      const form = event.target as HTMLFormElement | null;

      if (!form || form.id !== "contact-form") return;

      event.preventDefault();
      event.stopPropagation();

      if (isSubmittingRef.current) return;

      const tokenInput = form.querySelector(
        'input[name="cf-turnstile-response"]'
      ) as HTMLInputElement | null;

      const captchaBox = document.getElementById("contact-turnstile");

      if (captchaBox && (!tokenInput || !tokenInput.value)) {
        showToast("error", captchaAlert);
        return;
      }

      isSubmittingRef.current = true;
      setSubmitLoading(true);

      startTransition(async () => {
        try {
          const formData = new FormData(form);
          const result = await sendContactEmailAction(formData);

          showToast(result.ok ? "success" : "error", result.message);

          if (result.ok) {
            form.reset();
            resetFileUpload();
          }

          resetTurnstile();
        } catch (error) {
          console.error("CONTACT_SUBMIT_ERROR", error);
          showToast("error", errorMessage);
          resetTurnstile();
        } finally {
          isSubmittingRef.current = false;
          setSubmitLoading(false);
        }
      });
    }

    loadTurnstileScript();

    const turnstileRetry = window.setInterval(() => {
      const rendered = renderTurnstile();

      if (rendered) {
        window.clearInterval(turnstileRetry);
      }
    }, 300);

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("change", handleDocumentChange);
    document.addEventListener("submit", handleDocumentSubmit, true);

    return () => {
      window.clearInterval(turnstileRetry);

      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("change", handleDocumentChange);
      document.removeEventListener("submit", handleDocumentSubmit, true);
    };
  }, [
    captchaAlert,
    errorMessage,
    fileSizeAlert,
    showToast,
    startTransition,
    uploadText,
  ]);

  return null;
}