"use client";

import { useState } from "react";
import { createAddress, updateAddress } from "@/server/account/account.action";
import { useToast } from "@/components/ui/toast-provider";

type AddressItem = {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  ward: string;
  street: string | null;
  isDefault: boolean;
};

export function AddressModal({ address }: { address?: AddressItem }) {
  const { showToast } = useToast();

  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setPending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const result = address
      ? await updateAddress(formData)
      : await createAddress(formData);

    showToast(result.ok ? "success" : "error", result.message);
    setPending(false);

    if (result.ok) {
      setOpen(false);

      if (!address) {
        form.reset();
      }
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          address
            ? "text-sm text-blue-600 hover:text-blue-700"
            : "rounded bg-[#ee4d2d] px-5 py-3 text-sm font-medium text-white"
        }
      >
        {address ? "Cập nhật" : "＋ Thêm địa chỉ"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold">
                {address ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
              </h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-2xl leading-none text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {address && <input type="hidden" name="id" value={address.id} />}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="fullName"
                    defaultValue={address?.fullName || ""}
                    placeholder="Nguyễn Văn A"
                    className="w-full rounded border px-4 py-3 text-sm outline-none focus:border-[#ee4d2d]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phone"
                    defaultValue={address?.phone || ""}
                    placeholder="0901234567"
                    className="w-full rounded border px-4 py-3 text-sm outline-none focus:border-[#ee4d2d]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Tỉnh / Thành phố <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="city"
                    defaultValue={address?.city || ""}
                    placeholder="TP. Hồ Chí Minh"
                    className="w-full rounded border px-4 py-3 text-sm outline-none focus:border-[#ee4d2d]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Quận / Huyện <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="district"
                    defaultValue={address?.district || ""}
                    placeholder="Quận 1"
                    className="w-full rounded border px-4 py-3 text-sm outline-none focus:border-[#ee4d2d]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phường / Xã <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="ward"
                    defaultValue={address?.ward || ""}
                    placeholder="Phường Bến Nghé"
                    className="w-full rounded border px-4 py-3 text-sm outline-none focus:border-[#ee4d2d]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Địa chỉ cụ thể
                  </label>
                  <input
                    name="street"
                    defaultValue={address?.street || ""}
                    placeholder="25 Nguyễn Huệ"
                    className="w-full rounded border px-4 py-3 text-sm outline-none focus:border-[#ee4d2d]"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded border px-5 py-3 text-sm"
                >
                  Trở lại
                </button>

                <button
                  type="submit"
                  disabled={pending}
                  className="rounded bg-[#ee4d2d] px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
                >
                  {pending ? "Đang lưu..." : address ? "Cập nhật" : "Hoàn thành"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}