import {
  deleteAddress,
  setDefaultAddress,
} from "@/server/account/account.action";
import { getAccountAddresses } from "@/server/account/account.query";
import styles from "../account.module.css";
import { AddressModal } from "./address-modal";

export default async function AddressPage() {
  const addresses = await getAccountAddresses();

  return (
    <section className={styles.card}>
      <div className={styles.addressHeader}>
        <h1>Địa chỉ của tôi</h1>
        <AddressModal />
      </div>

      <div className={styles.addressList}>
        {addresses.map((address) => (
          <div className={styles.addressItem} key={address.id}>
            <div className={styles.addressInfo}>
              <div className={styles.addressName}>
                <strong>{address.fullName}</strong>
                <span>{address.phone}</span>
              </div>

              <p>
                {address.street}
                <br />
                {address.ward}, {address.district}, {address.city}
              </p>

              {address.isDefault && <em>Mặc định</em>}
            </div>

            <div className={styles.addressActions}>
              <AddressModal address={address} />

              {!address.isDefault && (
                <form action={deleteAddress}>
                  <input type="hidden" name="id" value={address.id} />
                  <button type="submit">Xóa</button>
                </form>
              )}

              {!address.isDefault && (
                <form action={setDefaultAddress}>
                  <input type="hidden" name="id" value={address.id} />
                  <button type="submit">Thiết lập mặc định</button>
                </form>
              )}
            </div>
          </div>
        ))}

        {addresses.length === 0 && <p>Chưa có địa chỉ.</p>}
      </div>
    </section>
  );
}