/**
 * Jalali (Shamsi) <-> ISO date helpers for term dates.
 *
 * The API stores plain ISO dates ("2026-10-02"). Admins think and type in the
 * Persian calendar, so conversion goes through Intl's persian calendar, which is
 * exact (leap years included) and needs no hand-rolled arithmetic.
 */

import { toEnglishDigits, toPersianDigits } from "./formatters";

const PERSIAN_PARTS = new Intl.DateTimeFormat("en-US-u-ca-persian-nu-latn", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  timeZone: "UTC",
});

const DISPLAY = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

const DAY_MS = 24 * 60 * 60 * 1000;

function isoToDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || "")) return null;
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function jalaliParts(date) {
  const out = {};
  for (const p of PERSIAN_PARTS.formatToParts(date)) {
    if (p.type === "year" || p.type === "month" || p.type === "day") {
      out[p.type] = Number(p.value);
    }
  }
  return out.year && out.month && out.day
    ? { jy: out.year, jm: out.month, jd: out.day }
    : null;
}

/** "2026-10-02" -> { jy: 1405, jm: 7, jd: 10 } */
export function isoToJalali(iso) {
  const d = isoToDate(iso);
  return d ? jalaliParts(d) : null;
}

/** (1405, 7, 10) -> "2026-10-02", or null when that day does not exist. */
export function jalaliToIso(jy, jm, jd) {
  if (![jy, jm, jd].every(Number.isInteger) || jm < 1 || jm > 12 || jd < 1 || jd > 31) {
    return null;
  }
  // Nowruz falls on 20/21 March; start from an estimate and let Intl correct it.
  const ordinal = (m, d) => (m <= 6 ? (m - 1) * 31 + d - 1 : 186 + (m - 7) * 30 + d - 1);
  let guess = Date.UTC(jy + 621, 2, 21) + ordinal(jm, jd) * DAY_MS;

  for (let i = 0; i < 6; i += 1) {
    const parts = jalaliParts(new Date(guess));
    if (!parts) return null;
    if (parts.jy === jy && parts.jm === jm && parts.jd === jd) {
      return new Date(guess).toISOString().slice(0, 10);
    }
    if (parts.jy !== jy) {
      // Across a New Year boundary: step one day towards the wanted year.
      guess += (parts.jy > jy ? -1 : 1) * DAY_MS;
      continue;
    }
    const delta = ordinal(jm, jd) - ordinal(parts.jm, parts.jd);
    // No movement left means this day does not exist (e.g. 31 Mehr).
    if (delta === 0) return null;
    guess += delta * DAY_MS;
  }
  return null;
}

/** "1405/07/10" (Persian or ASCII digits) -> ISO date, or null if invalid. */
export function parseJalaliText(text) {
  const clean = toEnglishDigits(String(text || ""))
    .trim()
    .replace(/[-.]/g, "/");
  const m = clean.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (!m) return null;
  return jalaliToIso(Number(m[1]), Number(m[2]), Number(m[3]));
}

/** ISO date -> "۱۴۰۵/۰۷/۱۰" for editing. */
export function isoToJalaliText(iso) {
  const p = isoToJalali(iso);
  if (!p) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return toPersianDigits(`${p.jy}/${pad(p.jm)}/${pad(p.jd)}`);
}

/** ISO date -> "۱۰ مهر ۱۴۰۵" for display; "" when there is no date. */
export function formatIsoShamsi(iso) {
  const d = isoToDate(iso);
  return d ? DISPLAY.format(d) : "";
}

/** Two ISO dates -> "۱۰ الی ۱۵ آذر ۱۴۰۴" style range; either may be missing. */
export function formatIsoRange(startIso, endIso) {
  if (startIso && endIso && startIso !== endIso) {
    return `${formatIsoShamsi(startIso)} تا ${formatIsoShamsi(endIso)}`;
  }
  return formatIsoShamsi(startIso || endIso);
}
