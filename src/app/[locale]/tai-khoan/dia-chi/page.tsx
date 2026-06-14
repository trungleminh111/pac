import {
  deleteAddress,
  setDefaultAddress,
} from "@/server/account/account.action";
import { getAccountAddresses } from "@/server/account/account.query";
import styles from "../account.module.css";
import { AddressModal } from "./address-modal";

type Locale = "vi" | "en";

const addressPageContent = {
  vi: {
    title: "Địa chỉ của tôi",
    defaultText: "Mặc định",
    deleteText: "Xóa",
    setDefaultText: "Thiết lập mặc định",
    emptyText: "Chưa có địa chỉ.",
  },
  en: {
    title: "My Addresses",
    defaultText: "Default",
    deleteText: "Delete",
    setDefaultText: "Set as default",
    emptyText: "No addresses yet.",
  },
};

export default async function AddressPage({
  params,
}: {
  params: {
    locale: Locale;
  };
}) {
  const locale = params.locale === "en" ? "en" : "vi";
  const content = addressPageContent[locale];

  const addresses = await getAccountAddresses();

  return (
    <section className={styles.card}>
      <div className={styles.addressHeader}>
        <h1>{content.title}</h1>
        <AddressModal locale={locale} />
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

              {address.isDefault && <em>{content.defaultText}</em>}
            </div>

            <div className={styles.addressActions}>
              <AddressModal address={address} locale={locale} />

              {!address.isDefault && (
                <form action={deleteAddress}>
                  <input type="hidden" name="id" value={address.id} />
                  <button type="submit">{content.deleteText}</button>
                </form>
              )}

              {!address.isDefault && (
                <form action={setDefaultAddress}>
                  <input type="hidden" name="id" value={address.id} />
                  <button type="submit">{content.setDefaultText}</button>
                </form>
              )}
            </div>
          </div>
        ))}

        {addresses.length === 0 && <p>{content.emptyText}</p>}
      </div>
    </section>
  );
}