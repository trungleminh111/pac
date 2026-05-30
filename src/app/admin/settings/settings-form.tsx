import {
  CheckCircle2,
  Cloud,
  Save,
  ShieldCheck,
  UploadCloud,
  XCircle,
} from "lucide-react";

type Role = "ADMIN" | "EDITOR" | "AUTHOR";

type ModuleKey =
  | "dashboard"
  | "posts"
  | "products"
  | "services"
  | "projects"
  | "media"
  | "users"
  | "categories"
  | "settings";

type AdminSettings = {
  uploadMaxSizeMb: number;
  uploadAllowedTypes: string;
};

type PermissionSettings = Record<Role, Record<ModuleKey, boolean>>;

type R2Status = {
  accountId: boolean;
  accessKey: boolean;
  secretKey: boolean;
  bucket: string;
  cdnUrl: string;
};

const roles: { key: Role; label: string }[] = [
  { key: "ADMIN", label: "Admin" },
  { key: "EDITOR", label: "Editor" },
  { key: "AUTHOR", label: "Author" },
];

const modules: { key: ModuleKey; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "posts", label: "Bài viết" },
  { key: "products", label: "Sản phẩm" },
  { key: "services", label: "Dịch vụ" },
  { key: "projects", label: "Công trình" },
  { key: "media", label: "Media" },
  { key: "users", label: "Người dùng" },
  { key: "categories", label: "Danh mục" },
  { key: "settings", label: "Cài đặt" },
];

function StatusItem({
  label,
  ok,
  value,
}: {
  label: string;
  ok: boolean;
  value?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm">
      <div>
        <div className="font-medium text-slate-900">{label}</div>
        {value && <div className="mt-1 text-xs text-slate-500">{value}</div>}
      </div>

      {ok ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500" />
      )}
    </div>
  );
}

export default function SettingsForm({
  saved,
  adminSettings,
  permissionSettings,
  r2Status,
  action,
}: {
  saved: boolean;
  adminSettings: AdminSettings;
  permissionSettings: PermissionSettings;
  r2Status: R2Status;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Cài đặt hệ thống</h1>
        <p className="mt-1 text-sm text-slate-500">
          Cấu hình upload, Cloudflare R2 và phân quyền truy cập admin.
        </p>
      </div>

      {saved && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Đã lưu cài đặt.
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-2xl border bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b px-5 py-4">
              <UploadCloud className="h-5 w-5 text-[#2271b1]" />
              <h2 className="font-semibold">Cấu hình upload</h2>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Dung lượng tối đa mỗi file MB
                </label>
                <input
                  name="uploadMaxSizeMb"
                  type="number"
                  min={1}
                  max={50}
                  defaultValue={adminSettings.uploadMaxSizeMb}
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  MIME type cho phép
                </label>
                <textarea
                  name="uploadAllowedTypes"
                  rows={3}
                  defaultValue={adminSettings.uploadAllowedTypes}
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#2271b1]"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Ví dụ: image/jpeg,image/png,image/webp,image/gif
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b px-5 py-4">
              <ShieldCheck className="h-5 w-5 text-[#2271b1]" />
              <h2 className="font-semibold">Phân quyền truy cập admin</h2>
            </div>

            <div className="overflow-x-auto p-5">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="rounded-l-xl px-4 py-3">Module</th>
                    {roles.map((role) => (
                      <th key={role.key} className="px-4 py-3 text-center">
                        {role.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {modules.map((module) => (
                    <tr key={module.key}>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {module.label}
                      </td>

                      {roles.map((role) => {
                        const checked =
                          role.key === "ADMIN"
                            ? true
                            : Boolean(
                                permissionSettings?.[role.key]?.[module.key]
                              );

                        return (
                          <td key={role.key} className="px-4 py-3 text-center">
                            {role.key === "ADMIN" ? (
                              <>
                                <input
                                  type="hidden"
                                  name={`permission.${role.key}.${module.key}`}
                                  value="true"
                                />
                                <input type="checkbox" checked disabled readOnly />
                              </>
                            ) : (
                              <>
                                <input
                                  type="hidden"
                                  name={`permission.${role.key}.${module.key}`}
                                  value="false"
                                />
                                <input
                                  type="checkbox"
                                  name={`permission.${role.key}.${module.key}`}
                                  value="true"
                                  defaultChecked={checked}
                                />
                              </>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Admin luôn có toàn quyền. Editor và Author có thể bật/tắt theo
                từng module.
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b px-5 py-4">
              <Cloud className="h-5 w-5 text-[#2271b1]" />
              <h2 className="font-semibold">Cloudflare R2</h2>
            </div>

            <div className="space-y-3 p-5">
              <StatusItem label="CF_ACCOUNT_ID" ok={r2Status.accountId} />
              <StatusItem label="CF_ACCESS_KEY_ID" ok={r2Status.accessKey} />
              <StatusItem label="CF_SECRET_ACCESS_KEY" ok={r2Status.secretKey} />
              <StatusItem
                label="Bucket"
                ok={Boolean(r2Status.bucket)}
                value={r2Status.bucket || "Chưa cấu hình"}
              />
              <StatusItem
                label="CDN URL"
                ok={Boolean(r2Status.cdnUrl)}
                value={r2Status.cdnUrl || "Chưa cấu hình"}
              />

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Secret R2 chỉ nên để trong <code>.env</code>, không lưu vào DB.
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2271b1] px-4 py-3 text-sm font-semibold text-white"
          >
            <Save className="h-4 w-4" />
            Lưu cài đặt
          </button>
        </aside>
      </div>
    </form>
  );
}