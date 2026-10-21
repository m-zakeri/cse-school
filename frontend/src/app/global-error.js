"use client";

// Last resort: used only when the root layout itself fails, so it cannot rely on
// any shared component or stylesheet.
export default function GlobalError({ reset }) {
  return (
    <html lang="fa" dir="rtl">
      <body style={{ fontFamily: "sans-serif", background: "#f8fafc", color: "#0f172a", margin: 0 }}>
        <div style={{ maxWidth: 420, margin: "20vh auto", padding: 32, textAlign: "center" }}>
          <h1 style={{ fontSize: 18 }}>مشکلی پیش آمد</h1>
          <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.8 }}>
            سامانه موقتاً در دسترس نیست. چند لحظه بعد دوباره تلاش کنید.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{ background: "#2563eb", color: "#fff", border: 0, borderRadius: 12, padding: "10px 24px", fontSize: 13, cursor: "pointer" }}
          >
            تلاش مجدد
          </button>
        </div>
      </body>
    </html>
  );
}
