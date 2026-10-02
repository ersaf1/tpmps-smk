import { test } from "node:test";
import assert from "node:assert/strict";
import {
  periodStatus,
  canWrite,
  safePreview,
  MAX_BYTES,
} from "../apps/web/src/domain.ts";
test("UI Jakarta midnight and role rules", () => {
  const period = { id: "p", starts_on: "2026-10-01", ends_on: "2026-10-02" };
  assert.equal(periodStatus(period, new Date("2026-10-02T16:59:59Z")), "Aktif");
  assert.equal(
    periodStatus(period, new Date("2026-10-02T17:00:00Z")),
    "Selesai",
  );
  assert.equal(
    periodStatus(period, new Date("2026-09-30T16:59:59Z")),
    "Belum dimulai",
  );
  const now = new Date("2026-10-02T10:00:00Z"),
    space = { id: "s", unit_id: "u", period_id: "p" };
  for (const role of [
    "superadmin",
    "kepala_sekolah",
    "ketua_tpmps",
    "kepala_unit",
  ]) {
    const p = { id: "x", role, unit_id: "u", active: true };
    assert.equal(
      canWrite(p, space, period, now),
      ["superadmin", "kepala_unit"].includes(role),
    );
    assert.equal(
      canWrite(p, space, period, new Date("2026-10-02T17:00:00Z")),
      false,
    );
  }
});
test("preview allowlist and consistent file limit", () => {
  assert.equal(MAX_BYTES, 50000000);
  for (const mime of [
    "text/html",
    "image/svg+xml",
    "application/javascript",
    "text/javascript",
  ])
    assert.equal(safePreview(mime), false);
  assert.equal(safePreview("application/pdf"), true);
  assert.equal(safePreview("image/png"), true);
});
