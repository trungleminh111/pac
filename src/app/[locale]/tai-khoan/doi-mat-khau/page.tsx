import styles from "../account.module.css";
import { PasswordForm } from "./password-form";

type Locale = "vi" | "en";

const changePasswordContent = {
  vi: {
    title: "Đổi Mật Khẩu",
    description: "Quản lý mật khẩu để bảo mật tài khoản",
  },
  en: {
    title: "Change Password",
    description: "Manage your password to secure your account",
  },
};

export default function ChangePasswordPage({
  params,
}: {
  params: {
    locale: Locale;
  };
}) {
  const locale = params.locale === "en" ? "en" : "vi";
  const content = changePasswordContent[locale];

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
      </div>

      <PasswordForm locale={locale} />
    </section>
  );
}