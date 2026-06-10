import { getAccountProfile } from "@/server/account/account.query";
import styles from "../account.module.css";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const account = await getAccountProfile();

  if (!account) {
    return <div className={styles.card}>Không tìm thấy tài khoản.</div>;
  }

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h1>Hồ Sơ Của Tôi</h1>
        <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>

      <div className={styles.profileGrid}>
        <ProfileForm account={account} />

        <div className={styles.avatarBox}>
          <div className={styles.bigAvatar}>
            {account.image ? (
              <img src={account.image} alt={account.name || account.email} />
            ) : (
              "👤"
            )}
          </div>

          <button>Chọn Ảnh</button>
          <p>Dung lượng file tối đa 1 MB</p>
          <p>Định dạng: JPEG, PNG</p>
        </div>
      </div>
    </section>
  );
}