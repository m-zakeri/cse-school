/**
 * Build and download an iCalendar (.ics) file for a term's key dates, so a
 * student can drop registration, exam and certificate dates into any calendar app.
 * Dates are all-day events, which is what the academic calendar contains.
 */

function icsDate(iso) {
  return iso.replace(/-/g, "");
}

// The day after `iso`; all-day events end on the next day (exclusive end).
function nextDay(iso) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function escapeText(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function buildTermEvents(term) {
  const range = (label, start, end) => (start || end ? { label, start: start || end, end: end || start } : null);
  return [
    range("شروع فرآیند ثبت‌نام", term.registration_start),
    range("مهلت نهایی ثبت‌نام", term.registration_end),
    range("افتتاحیه و آغاز کلاس‌ها", term.start_date),
    range("جلسات رفع اشکال و جبرانی", term.makeup_start, term.makeup_end),
    range("آزمون و ارزیابی پایانی", term.exam_start, term.exam_end),
    range("پایان ترم", term.end_date),
    range("صدور گواهینامه‌های رسمی", term.certificate_date),
  ].filter(Boolean);
}

export function termToIcs(term) {
  const events = buildTermEvents(term);
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Amirkabir CE School//Academic Calendar//FA",
    "CALSCALE:GREGORIAN",
    `X-WR-CALNAME:${escapeText(`تقویم آموزشی ${term.title}`)}`,
  ];
  events.forEach((ev, i) => {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${term.code}-${i}@ce-school`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(ev.start)}`,
      `DTEND;VALUE=DATE:${icsDate(nextDay(ev.end))}`,
      `SUMMARY:${escapeText(`${ev.label} — ${term.title}`)}`,
      "END:VEVENT"
    );
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadTermIcs(term) {
  const blob = new Blob([termToIcs(term)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ce-school-${term.code}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
