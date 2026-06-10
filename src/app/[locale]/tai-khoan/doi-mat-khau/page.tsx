import styles from "../account.module.css";
import { PasswordForm } from "./password-form";

export default function ChangePasswordPage() {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h1>Đổi Mật Khẩu</h1>
        <p>Quản lý mật khẩu để bảo mật tài khoản</p>
      </div>

      <PasswordForm />
    </section>
  );
}