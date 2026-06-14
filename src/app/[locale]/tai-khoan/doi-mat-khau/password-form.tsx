"use client";

import { useState } from "react";
import { updatePassword } from "@/server/account/account.action";
import { useToast } from "@/components/ui/toast-provider";
import styles from "../account.module.css";

type Locale = "vi" | "en";

const passwordFormContent = {
  vi: {
    currentPassword: "Mật khẩu hiện tại",
    newPassword: "Mật khẩu mới",
    confirmPassword: "Nhập lại mật khẩu",
    updating: "Đang cập nhật...",
    submit: "Cập nhật",
  },
  en: {
    currentPassword: "Current password",
    newPassword: "New password",
    confirmPassword: "Confirm password",
    updating: "Updating...",
    submit: "Update",
  },
};

export function PasswordForm({ locale = "vi" }: { locale?: Locale }) {
  const { showToast } = useToast();
  const [pending, setPending] = useState(false);
  const content = passwordFormContent[locale];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setPending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await updatePassword(formData);

    showToast(result.ok ? "success" : "error", result.message);
    setPending(false);

    if (result.ok) {
      form.reset();
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label>
          {content.currentPassword} <span className="text-red-500">*</span>
        </label>
        <input name="currentPassword" type="password" />
      </div>

      <div className={styles.field}>
        <label>
          {content.newPassword} <span className="text-red-500">*</span>
        </label>
        <input name="newPassword" type="password" />
      </div>

      <div className={styles.field}>
        <label>
          {content.confirmPassword} <span className="text-red-500">*</span>
        </label>
        <input name="confirmPassword" type="password" />
      </div>

      <button type="submit" className={styles.saveButton} disabled={pending}>
        {pending ? content.updating : content.submit}
      </button>
    </form>
  );
}