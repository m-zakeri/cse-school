"use client";

import { useEffect } from "react";
import Link from "next/link";
import MainLayout from "@/components/Layout/MainLayout";

export default function GlobalRouteError({ error, reset }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") console.error(error);
  }, [error]);

  return (
    <MainLayout>
      <div role="alert" className="max-w-lg mx-auto my-16 bg-white rounded-3xl border border-slate-200/80 p-10 text-center shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 text-2xl" aria-hidden="true">
          !
        </div>
        <h1 className="text-lg font-bold text-slate-900 mb-2">مشکلی پیش آمد</h1>
        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          صفحه به‌درستی بارگذاری نشد. می‌توانید دوباره تلاش کنید یا به فهرست دوره‌ها برگردید.
          اگر مشکل ادامه داشت، از صفحهٔ تماس با دبیرخانه خبر دهید.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all"
          >
            تلاش مجدد
          </button>
          <Link
            href="/courses"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 px-6 rounded-xl transition-all"
          >
            دوره‌های آموزشی
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
