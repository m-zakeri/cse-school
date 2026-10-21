import Link from "next/link";
import MainLayout from "@/components/Layout/MainLayout";

export const metadata = { title: "صفحه یافت نشد" };

export default function NotFound() {
  return (
    <MainLayout>
      <div className="max-w-lg mx-auto my-16 bg-white rounded-3xl border border-slate-200/80 p-10 text-center shadow-sm">
        <p className="text-5xl font-extrabold text-blue-600 mb-3" aria-hidden="true">۴۰۴</p>
        <h1 className="text-lg font-bold text-slate-900 mb-2">صفحه‌ای که دنبالش بودید پیدا نشد</h1>
        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          ممکن است نشانی را اشتباه وارد کرده باشید یا صفحه جابه‌جا شده باشد.
        </p>
        <Link
          href="/courses"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all"
        >
          مشاهده دوره‌های آموزشی
        </Link>
      </div>
    </MainLayout>
  );
}
