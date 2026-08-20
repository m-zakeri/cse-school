import MainLayout from "@/components/Layout/MainLayout";
import Link from "next/link";
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  PhoneIcon,
  ChevronLeftIcon,
} from "@/components/Icons";

export default function Calendar() {
  return (
    <MainLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
          <CalendarIcon className="w-4 h-4 text-blue-600" />
          <span>زمان‌بندی و تقویم آموزشی</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          تقویم آموزشی و تاریخ‌های مهم
        </h1>
        <p className="text-slate-600 text-sm">
          برنامه زمانی فرآیند ثبت‌نام، برگزاری کلاس‌ها و ارزیابی پایان‌ترم دانشکده مهندسی کامپیوتر
        </p>
      </div>

      {/* Active Term Card */}
      <section className="mb-10">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                تقویم آموزشی ترم پاییز ۱۴۰۴
              </h2>
              <p className="text-xs text-slate-500">مدرسه آموزش‌های تخصصی امیرکبیر</p>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
              ترم در حال ثبت‌نام
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <ClockIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">شروع فرآیند ثبت‌نام</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">۱۵ شهریور ۱۴۰۴</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <ClockIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">مهلت نهایی ثبت‌نام</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">۵ مهر ۱۴۰۴</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircleIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">افتتاحیه و آغاز کلاس‌ها</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">۱۰ مهر ۱۴۰۴</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <ClockIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">جلسات رفع اشکال و جبرانی</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">۱۰ الی ۱۵ آذر ۱۴۰۴</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <ClockIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">آزمون و ارزیابی پایانی</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">۲۰ الی ۲۵ آذر ۱۴۰۴</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                <CheckCircleIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">صدور گواهینامه‌های رسمی</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">۱۰ دی ۱۴۰۴</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subsequent Terms Timeline */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-6">
          برنامه ترم‌های آتی
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
              ترم زمستان ۱۴۰۴
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-3 mb-2">
              مدرسه زمستانه آموزش‌های تخصصی
            </h3>
            <div className="space-y-2 text-xs text-slate-600">
              <p>شروع ثبت‌نام: <span className="font-semibold text-slate-800">۱۵ دی ۱۴۰۴</span></p>
              <p>آغاز کلاس‌ها: <span className="font-semibold text-slate-800">۱۰ بهمن ۱۴۰۴</span></p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-100">
              ترم بهار ۱۴۰۵
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-3 mb-2">
              مدرسه بهاره آموزش‌های تخصصی
            </h3>
            <div className="space-y-2 text-xs text-slate-600">
              <p>شروع ثبت‌نام: <span className="font-semibold text-slate-800">۱۵ اسفند ۱۴۰۴</span></p>
              <p>آغاز کلاس‌ها: <span className="font-semibold text-slate-800">۲۵ فروردین ۱۴۰۵</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Card */}
      <section className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-8 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-base font-bold text-white mb-1">
            پرسشی درباره زمان‌بندی یا تداخل کلاس‌ها دارید؟
          </h3>
          <p className="text-xs text-slate-300">
            کارشناسان آموزش آماده راهنمایی شما جهت انتخاب بهینه دوره‌ها هستند.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-3 px-5 rounded-xl transition-all shrink-0"
        >
          <PhoneIcon className="w-4 h-4" />
          <span>تماس با دبیرخانه</span>
        </Link>
      </section>
    </MainLayout>
  );
}
