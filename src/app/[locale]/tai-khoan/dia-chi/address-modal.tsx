"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiRotateCcw } from "react-icons/fi";
import { createAddress, updateAddress } from "@/server/account/account.action";
import { useToast } from "@/components/ui/toast-provider";

type Locale = "vi" | "en";

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

type Province = { code: number; name: string };
type Ward = { code: number; name: string };

const API_BASE = "https://provinces.open-api.vn/api/v2";

const addressModalContent = {
  vi: {
    updateTitle: "Cập nhật địa chỉ",
    createTitle: "Địa chỉ mới",
    loadProvinceError: "Không tải được danh sách tỉnh/thành.",
    loadWardError: "Không tải được danh sách phường/xã.",
    checkInfoError: "Vui lòng kiểm tra lại thông tin địa chỉ.",
    fullNameLabel: "Họ và tên",
    fullNamePlaceholder: "Họ và tên",
    phoneLabel: "Số điện thoại",
    phonePlaceholder: "Số điện thoại",
    areaLabel: "Tỉnh / Phường",
    areaPlaceholder: "Chọn Tỉnh/Thành phố, Phường/Xã",
    selectedArea: "Khu vực được chọn",
    reset: "Thiết lập lại",
    provincePlaceholder: "Chọn Tỉnh/Thành phố",
    wardPlaceholder: "Chọn Phường/Xã",
    loading: "Đang tải...",
    streetLabel: "Địa chỉ cụ thể",
    streetPlaceholder: "Số nhà, tên đường...",
    warning: "⚠ Vui lòng ghi địa chỉ chính xác để PAC Stone giao hàng thuận lợi.",
    defaultAddress: "Đặt làm địa chỉ mặc định",
    back: "Trở Lại",
    saving: "Đang lưu...",
    complete: "Hoàn thành",
    updateButton: "Cập nhật",
    addButton: "＋ Thêm địa chỉ",
    errors: {
      fullName: "Vui lòng nhập họ và tên.",
      phone: "Vui lòng nhập số điện thoại.",
      phoneInvalid: "Số điện thoại không hợp lệ.",
      city: "Vui lòng chọn Tỉnh/Thành phố.",
      ward: "Vui lòng chọn Phường/Xã.",
      street: "Vui lòng nhập địa chỉ cụ thể.",
    },
  },
  en: {
    updateTitle: "Update address",
    createTitle: "New address",
    loadProvinceError: "Unable to load province/city list.",
    loadWardError: "Unable to load ward list.",
    checkInfoError: "Please check your address information again.",
    fullNameLabel: "Full name",
    fullNamePlaceholder: "Full name",
    phoneLabel: "Phone number",
    phonePlaceholder: "Phone number",
    areaLabel: "Province / Ward",
    areaPlaceholder: "Select Province/City, Ward",
    selectedArea: "Selected area",
    reset: "Reset",
    provincePlaceholder: "Select Province/City",
    wardPlaceholder: "Select Ward",
    loading: "Loading...",
    streetLabel: "Detailed address",
    streetPlaceholder: "House number, street name...",
    warning: "⚠ Please enter the correct address so PAC Stone can deliver smoothly.",
    defaultAddress: "Set as default address",
    back: "Back",
    saving: "Saving...",
    complete: "Complete",
    updateButton: "Update",
    addButton: "＋ Add address",
    errors: {
      fullName: "Please enter your full name.",
      phone: "Please enter your phone number.",
      phoneInvalid: "Invalid phone number.",
      city: "Please select Province/City.",
      ward: "Please select Ward.",
      street: "Please enter your detailed address.",
    },
  },
};

export function AddressModal({ address, locale = "vi" }: { address?: AddressItem; locale?: Locale }) {
  const { showToast } = useToast();
  const content = addressModalContent[locale];

  const [areaPanelOpen, setAreaPanelOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const [fullName, setFullName] = useState(address?.fullName || "");
  const [phone, setPhone] = useState(address?.phone || "");
  const [city, setCity] = useState(address?.city || "");
  const [ward, setWard] = useState(address?.ward || "");
  const [street, setStreet] = useState(address?.street || "");

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loadingProvince, setLoadingProvince] = useState(false);
  const [loadingWard, setLoadingWard] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync state mỗi khi mở modal (quan trọng cho edit)
  useEffect(() => {
    if (open) {
      setFullName(address?.fullName || "");
      setPhone(address?.phone || "");
      setCity(address?.city || "");
      setWard(address?.ward || "");
      setStreet(address?.street || "");
      setErrors({});
      setAreaPanelOpen(false);
    }
  }, [open, address]);

  // Khoá scroll body khi modal mở
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    async function loadProvinces() {
      try {
        setLoadingProvince(true);
        const res = await fetch(`${API_BASE}/p/`);
        const data = await res.json();
        setProvinces(Array.isArray(data) ? data : []);
      } catch {
        showToast("error", content.loadProvinceError);
      } finally {
        setLoadingProvince(false);
      }
    }
    loadProvinces();
  }, [open, showToast, content.loadProvinceError]);

  async function handleProvinceSelect(province: Province) {
    try {
      setCity(province.name);
      setWard("");
      setWards([]);
      setLoadingWard(true);
      setErrors((c) => ({ ...c, city: "", ward: "" }));
      const res = await fetch(`${API_BASE}/p/${province.code}?depth=2`);
      const data = await res.json();
      setWards(Array.isArray(data?.wards) ? data.wards : []);
    } catch {
      showToast("error", content.loadWardError);
    } finally {
      setLoadingWard(false);
    }
  }

  function resetArea() {
    setCity(""); setWard(""); setWards([]);
    setErrors((c) => ({ ...c, city: "", ward: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = content.errors.fullName;
    if (!phone.trim()) e.phone = content.errors.phone;
    else if (!/^(0|\+84)[0-9]{9,10}$/.test(phone.trim())) e.phone = content.errors.phoneInvalid;
    if (!city) e.city = content.errors.city;
    if (!ward) e.ward = content.errors.ward;
    if (!street.trim()) e.street = content.errors.street;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) { showToast("error", content.checkInfoError); return; }
    setPending(true);
    const formData = new FormData(e.currentTarget);
    formData.set("fullName", fullName.trim());
    formData.set("phone", phone.trim());
    formData.set("city", city);
    formData.set("ward", ward);
    formData.set("district", city);
    formData.set("street", street.trim());
    const result = address ? await updateAddress(formData) : await createAddress(formData);
    showToast(result.ok ? "success" : "error", result.message);
    setPending(false);
    if (result.ok) {
      setOpen(false);
      if (!address) {
        setFullName(""); setPhone(""); setCity(""); setWard(""); setStreet(""); setWards([]); setErrors({});
      }
    }
  }

  const modal = (
    // Overlay — fixed, full screen, nền đen mờ
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      {/* Dialog */}
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-2xl">

        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            {address ? content.updateTitle : content.createTitle}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-2xl text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ×
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            {address && <input type="hidden" name="id" value={address.id} />}

            {/* Họ tên + SĐT */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm text-slate-600">
                  {content.fullNameLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={content.fullNamePlaceholder}
                  className="h-11 w-full rounded border border-slate-300 px-4 text-sm outline-none focus:border-[#ee4d2d]"
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-slate-600">
                  {content.phoneLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={content.phonePlaceholder}
                  className="h-11 w-full rounded border border-slate-300 px-4 text-sm outline-none focus:border-[#ee4d2d]"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>
            </div>

            {/* Chọn tỉnh/phường */}
            <div className="mt-4">
              <label className="mb-1.5 block text-sm text-slate-600">
                {content.areaLabel} <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setAreaPanelOpen((p) => !p)}
                className="flex h-11 w-full items-center justify-between rounded border border-slate-300 bg-white px-4 text-sm transition hover:border-[#ee4d2d]"
              >
                <span className={city && ward ? "text-slate-900" : "text-slate-400"}>
                  {city && ward ? `${city} — ${ward}` : content.areaPlaceholder}
                </span>
                <span className="text-slate-400">{areaPanelOpen ? "∧" : "∨"}</span>
              </button>
              {(errors.city || errors.ward) && (
                <p className="mt-1 text-xs text-red-500">{errors.city || errors.ward}</p>
              )}

              {areaPanelOpen && (
                <div className="mt-2 rounded border bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b px-4 py-2.5">
                    <span className="text-xs text-slate-400">{content.selectedArea}</span>
                    <button type="button" onClick={resetArea} className="flex items-center gap-1 text-xs text-[#ee4d2d]">
                      <FiRotateCcw size={12} /> {content.reset}
                    </button>
                  </div>
                  <div className="p-3">
                    <div className={`flex items-center gap-2 rounded border px-3 py-2.5 text-sm ${city ? "border-[#ee4d2d] text-[#ee4d2d]" : "border-slate-200 text-slate-400"}`}>
                      <span>◉</span><span>{city || content.provincePlaceholder}</span>
                    </div>
                    {city && (
                      <>
                        <div className="ml-4 h-4 w-px bg-slate-200" />
                        <div className={`flex items-center gap-2 rounded border px-3 py-2.5 text-sm ${ward ? "border-[#ee4d2d] text-[#ee4d2d]" : "border-slate-200 text-slate-400"}`}>
                          <span>◉</span><span>{ward || content.wardPlaceholder}</span>
                        </div>
                      </>
                    )}
                    <div className="mt-3 max-h-52 overflow-y-auto border-t pt-2">
                      {!city && loadingProvince && <p className="p-2 text-sm text-slate-400">{content.loading}</p>}
                      {!city && !loadingProvince && provinces.map((item) => (
                        <button key={item.code} type="button" onClick={() => handleProvinceSelect(item)}
                          className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-orange-50 hover:text-[#ee4d2d]">
                          {item.name}
                        </button>
                      ))}
                      {city && !ward && loadingWard && <p className="p-2 text-sm text-slate-400">{content.loading}</p>}
                      {city && !ward && !loadingWard && wards.map((item) => (
                        <button key={item.code} type="button"
                          onClick={() => { setWard(item.name); setAreaPanelOpen(false); setErrors((c) => ({ ...c, ward: "" })); }}
                          className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-orange-50 hover:text-[#ee4d2d]">
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Địa chỉ cụ thể */}
            <div className="mt-4">
              <label className="mb-1.5 block text-sm text-slate-600">
                {content.streetLabel} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                rows={3}
                placeholder={content.streetPlaceholder}
                className="w-full resize-none rounded border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#ee4d2d]"
              />
              {errors.street && <p className="mt-1 text-xs text-red-500">{errors.street}</p>}
            </div>

            <div className="mt-3 rounded bg-orange-50 p-3 text-sm text-orange-600">
              {content.warning}
            </div>

            <label className="mt-3 flex items-center gap-2 text-sm text-slate-500">
              <input type="checkbox" name="isDefault" value="true" defaultChecked={address?.isDefault} />
              {content.defaultAddress}
            </label>

            {/* Hidden */}
            <input type="hidden" name="city" value={city} />
            <input type="hidden" name="district" value={city} />
            <input type="hidden" name="ward" value={ward} />
            <input type="hidden" name="street" value={street} />

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3 border-t pt-5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="min-w-[120px] rounded border border-slate-300 bg-white px-6 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                {content.back}
              </button>
              <button
                type="submit"
                disabled={pending}
                className="min-w-[140px] rounded bg-[#ee4d2d] px-8 py-2.5 text-sm font-medium text-white disabled:opacity-60 hover:bg-[#d73211]"
              >
                {pending ? content.saving : content.complete}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          address
            ? "text-sm text-blue-600 hover:text-blue-700"
            : "rounded bg-[#ee4d2d] px-3 py-3 text-sm font-medium text-white"
        }
      >
        {address ? content.updateButton : content.addButton}
      </button>

      {/* Portal ra ngoài DOM tree để tránh bị clip bởi overflow/z-index cha */}
      {open && typeof document !== "undefined" && createPortal(modal, document.body)}
    </>
  );
}