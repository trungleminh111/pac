export type VietnamProvince = {
  code: number;
  name: string;
};

export type VietnamWard = {
  code: number;
  name: string;
};

const API_BASE = "https://provinces.open-api.vn/api/v2";

export async function fetchVietnamProvinces(): Promise<VietnamProvince[]> {
  const res = await fetch(`${API_BASE}/p/`, {
    cache: "force-cache",
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();

  return Array.isArray(data) ? data : [];
}

export async function fetchVietnamWardsByProvince(
  provinceCode: number
): Promise<VietnamWard[]> {
  const res = await fetch(`${API_BASE}/p/${provinceCode}?depth=2`, {
    cache: "force-cache",
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();

  return Array.isArray(data?.wards) ? data.wards : [];
}