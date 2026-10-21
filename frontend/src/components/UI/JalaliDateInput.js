"use client";

import { useEffect, useRef, useState } from "react";
import { isoToJalaliText, parseJalaliText } from "@/lib/jalali";
import { toPersianDigits } from "@/lib/formatters";

/**
 * Date field that is typed in the Persian calendar ("۱۴۰۵/۰۷/۱۰") and reports an
 * ISO date to the form.
 *
 * onChange receives "" when the field is empty, an ISO string when valid, and
 * null while the text is not a real date, so the form can refuse to submit.
 */
export default function JalaliDateInput({ value, onChange, placeholder = "۱۴۰۵/۰۷/۱۰", className = "" }) {
  const [text, setText] = useState(value ? isoToJalaliText(value) : "");
  const [touched, setTouched] = useState(false);
  const lastEmitted = useRef(value || "");

  // The form can replace the value (switching to edit another term); follow it,
  // but not our own echoes while the admin is mid-typing.
  useEffect(() => {
    if ((value || "") !== lastEmitted.current) {
      lastEmitted.current = value || "";
      setText(value ? isoToJalaliText(value) : "");
      setTouched(false);
    }
  }, [value]);

  const handleChange = (raw) => {
    const shown = toPersianDigits(raw);
    setText(shown);
    let next;
    if (!shown.trim()) next = "";
    else next = parseJalaliText(shown);
    lastEmitted.current = next === null ? "" : next;
    onChange(next);
  };

  const invalid = touched && text.trim() !== "" && parseJalaliText(text) === null;

  return (
    <div>
      <input
        type="text"
        inputMode="numeric"
        dir="ltr"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        className={`w-full p-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden text-right ${
          invalid ? "border-red-400" : "border-slate-200"
        } ${className}`}
      />
      {invalid && (
        <p className="mt-1 text-[11px] text-red-600">
          تاریخ معتبر نیست؛ قالب درست مثل «۱۴۰۵/۰۷/۱۰» است.
        </p>
      )}
    </div>
  );
}
