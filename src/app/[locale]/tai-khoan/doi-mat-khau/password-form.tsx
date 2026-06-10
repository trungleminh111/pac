"use client";

import { useState } from "react";
import { updatePassword } from "@/server/account/account.action";
import { useToast } from "@/components/ui/toast-provider";
import styles from "../account.module.css";

export function PasswordForm() {
  const { showToast } = useToast();
  const [pending, setPending] = useState(false);

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
          Mật khẩu hiện tại <span className="text-red-500">*</span>
        </label>
        <input name="currentPassword" type="password" />
      </div>

      <div className={styles.field}>
        <label>
          Mật khẩu mới <span className="text-red-500">*</span>
        </label>
        <input name="newPassword" type="password" />
      </div>

      <div className={styles.field}>
        <label>
          Nhập lại mật khẩu <span className="text-red-500">*</span>
        </label>
        <input name="confirmPassword" type="password" />
      </div>

      <button type="submit" className={styles.saveButton} disabled={pending}>
        {pending ? "Đang cập nhật..." : "Cập nhật"}
      </button>
    </form>
  );
}