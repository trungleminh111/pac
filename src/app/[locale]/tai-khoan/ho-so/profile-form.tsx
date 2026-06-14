"use client";

import { useState } from "react";
import { updateProfile } from "@/server/account/account.action";
import { useToast } from "@/components/ui/toast-provider";
import styles from "../account.module.css";

type Locale = "vi" | "en";

const profileFormContent = {
  vi: {
    username: "Tên đăng nhập",
    name: "Tên",
    email: "Email",
    joinedDate: "Ngày tham gia",
    saving: "Đang lưu...",
    save: "Lưu thay đổi",
    dateLocale: "vi-VN",
  },
  en: {
    username: "Username",
    name: "Name",
    email: "Email",
    joinedDate: "Joined date",
    saving: "Saving...",
    save: "Save changes",
    dateLocale: "en-US",
  },
};

export function ProfileForm({
  account,
  locale = "vi",
}: {
  account: {
    name: string;
    email: string;
    image: string;
    role: string;
    createdAt: Date;
  };
  locale?: Locale;
}) {
  const { showToast } = useToast();
  const [pending, setPending] = useState(false);
  const content = profileFormContent[locale];

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
        <label>{content.username}</label>
        <input value={account.email.split("@")[0]} readOnly />
      </div>

      <div className={styles.field}>
        <label>
          {content.name} <span className="text-red-500">*</span>
        </label>
        <input name="name" defaultValue={account.name} />
      </div>

      <div className={styles.field}>
        <label>{content.email}</label>
        <input value={account.email} readOnly />
      </div>
      <div className={styles.field}>
        <label>{content.joinedDate}</label>
        <input value={account.createdAt.toLocaleDateString(content.dateLocale)} readOnly />
      </div>

      <button type="submit" className={styles.saveButton} disabled={pending}>
        {pending ? content.saving : content.save}
      </button>
    </form>
  );
}