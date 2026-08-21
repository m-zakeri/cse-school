/**
 * Unified Persian formatting utilities for numbers, currencies, dates, and codes.
 */

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const ENGLISH_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * Converts English digits in a string or number to Persian digits.
 */
export function toPersianDigits(val) {
  if (val === null || val === undefined) return "";
  const str = String(val);
  return str.replace(/[0-9]/g, (w) => PERSIAN_DIGITS[+w]);
}

/**
 * Converts Persian digits to standard English digits.
 */
export function toEnglishDigits(str) {
  if (!str) return "";
  let result = String(str);
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(PERSIAN_DIGITS[i], "g"), ENGLISH_DIGITS[i]);
  }
  return result;
}

/**
 * Formats a numeric price (in Tomans or Rials) to clean Persian formatted Tomans.
 * Example: 2500000 -> "۲,۵۰۰,۰۰۰ تومان"
 */
export function formatPriceToman(amount) {
  if (!amount && amount !== 0) return "رایگان / هماهنگ با دانشکده";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num) || num <= 0) return "رایگان";
  
  // Format with commas and convert to Persian numbers
  const formattedWithCommas = num.toLocaleString("en-US");
  return `${toPersianDigits(formattedWithCommas)} تومان`;
}

/**
 * Formats an ISO or standard date to Persian date string.
 * Example: "2025-10-02" -> "۱۰ مهر ۱۴۰۴"
 */
export function formatDateShamsi(dateInput) {
  if (!dateInput) return "ترم پاییز ۱۴۰۴";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  } catch {
    return String(dateInput);
  }
}

/**
 * Cleanly formats a tracking code ensuring mono display and direction.
 */
export function formatTrackingCode(code) {
  if (!code) return "AUT-1404-000000";
  return String(code).trim().toUpperCase();
}
