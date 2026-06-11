"use client";

import { useState } from "react";
import { updateProfile } from "@/server/account/account.action";
import { useToast } from "@/components/ui/toast-provider";
import styles from "../account.module.css";

export function ProfileForm({
  account,
}: {
  account: {
    name: string;
    email: string;
    image: string;
    role: string;
    createdAt: Date;
  };
}) {
  const { showToast } = useToast();
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    showToast(result.ok ? "success" : "error", result.message);
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>

      <div className={styles.field}>
        <label>Tên đăng nhập</label>
        <input value={account.email.split("@")[0]} readOnly />
      </div>

      <div className={styles.field}>
        <label>
          Tên <span className="text-red-500">*</span>
        </label>
        <input name="name" defaultValue={account.name} />
      </div>

      <div className={styles.field}>
        <label>Email</label>
        <input value={account.email} readOnly />
      </div>
      <div className={styles.field}>
        <label>Ngày tham gia</label>
        <input value={account.createdAt.toLocaleDateString("vi-VN")} readOnly />
      </div>

      <button type="submit" className={styles.saveButton} disabled={pending}>
        {pending ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </form>
  );
}