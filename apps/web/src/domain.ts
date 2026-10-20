export const MAX_BYTES = 50_000_000;
export const roles = {
  kepala_sekolah: "Kepala sekolah",
  ketua_tpmps: "Ketua TPMPS",
  kepala_unit: "Kepala unit",
  superadmin: "Superadmin",
};
export type Role = keyof typeof roles;
export interface Profile {
  id: string;
  email?: string;
  full_name: string;
  role: Role;
  unit_id: string | null;
  active: boolean;
}
export interface Period {
  id: string;
  name: string;
  starts_on: string;
  ends_on: string;
}
export interface Unit {
  id: string;
  name: string;
  active: boolean;
}
export interface Space {
  id: string;
  period_id: string;
  unit_id: string | null;
  name: string;
}
export interface Folder {
  id: string;
  space_id: string;
  parent_id: string | null;
  name: string;
  created_at: string;
}
export interface Doc {
  id: string;
  space_id: string;
  folder_id: string;
  name: string;
  size: number;
  mime_type: string;
  object_key: string;
  uploaded_by: string;
  created_at: string;
  status: string;
}
export function periodStatus(period: Period, now = new Date()) {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return today < period.starts_on
    ? "Belum dimulai"
    : today > period.ends_on
      ? "Selesai"
      : "Aktif";
}
export function canWrite(
  profile: Profile,
  space: Space | undefined,
  period: Period | undefined,
  now = new Date(),
) {
  return (
    !!space &&
    !!period &&
    profile.active &&
    periodStatus(period, now) === "Aktif" &&
    (profile.role === "superadmin" ||
      (profile.role === "ketua_tpmps" && !space.unit_id) ||
      (profile.role === "kepala_unit" && space.unit_id === profile.unit_id))
  );
}
export function bytes(n: number) {
  return n >= 1e6
    ? `${(n / 1e6).toFixed(1)} MB`
    : n >= 1e3
      ? `${(n / 1e3).toFixed(1)} KB`
      : `${n} B`;
}
export function safePreview(mime: string) {
  return [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
  ].includes(mime);
}
