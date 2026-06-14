import { getAccountProfile } from "@/server/account/account.query";
import styles from "../account.module.css";
import { ProfileForm } from "./profile-form";

type Locale = "vi" | "en";

const profilePageContent = {
  vi: {
    notFound: "Không tìm thấy tài khoản.",
    title: "Hồ Sơ Của Tôi",
    description: "Quản lý thông tin hồ sơ để bảo mật tài khoản",
  },
  en: {
    notFound: "Account not found.",
    title: "My Profile",
    description: "Manage your profile information to secure your account",
  },
};

export default async function ProfilePage({
  params,
}: {
  params: {
    locale: Locale;
  };
}) {
  const locale = params.locale === "en" ? "en" : "vi";
  const content = profilePageContent[locale];

  const account = await getAccountProfile();

  if (!account) {
    return <div className={styles.card}>{content.notFound}</div>;
  }

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
      </div>

      <div className={styles.profileGrid}>
        <ProfileForm account={account} locale={locale} />
      </div>
    </section>
  );
}