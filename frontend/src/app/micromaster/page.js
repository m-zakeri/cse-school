import MainLayout from "@/components/Layout/MainLayout";
import Link from "next/link";
import {
  LayersIcon,
  AcademicCapIcon,
  AwardIcon,
  ShieldCheckIcon,
  SparklesIcon,
  PhoneIcon,
  CheckCircleIcon,
} from "@/components/Icons";

export default function Micromaster() {
  const futurePackages = [
    {
      id: 1,
      title: "میکرومستر مهندسی نرم‌افزار و معماری سیستم",
      courses: [
        "برنامه‌نویسی شی‌گرا (جاوا)",
        "مهندسی نرم‌افزار",
        "آزمون و تضمین کیفیت نرم‌افزار",
        "اصول و الگوها در مهندسی نرم‌افزار",
      ],
      description: "مسیر جامع تسلط بر اصول تحلیل، طراحی الگوها، معماری کلین و آزمون خودکار نرم‌افزار.",
      units: "۱۲ واحد معادل",
    },
    {
      id: 2,
      title: "میکرومستر هوش مصنوعی و رایانش ابری",
      courses: [
        "یادگیری ماشین",
        "اصول رایانش ابری",
        "پردازش هوشمند داده‌ها",
      ],
      description: "مسیر تخصصی یادگیری ماشین، مدل‌های هوشمند و استقرار مقیاس‌پذیر در زیرساخت‌های ابری.",
      units: "۹ واحد معادل",
    },
  ];

  return (
    <MainLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
          <LayersIcon className="w-4 h-4 text-blue-600" />
          <span>مسیرهای تخصصی پیوسته</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          بسته‌های تخصصی میکرومستر (Micro-Masters)
        </h1>
        <p className="text-slate-600 text-sm">
          مجموعه‌ای از دوره‌های به‌هم‌پیوسته برای کسب تخصص جامع و دریافت گواهی ویژه مهارت‌های پیشرفته
        </p>
      </div>

      {/* Package Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {futurePackages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm hover:border-blue-200 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start gap-4 mb-4">
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
                  {pkg.units}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  پذیرش فعال
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 mb-2">
                {pkg.title}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed mb-5">
                {pkg.description}
              </p>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
                <p className="text-xs font-bold text-slate-900 mb-3">عناوین درسی بسته:</p>
                <ul className="space-y-2 text-xs text-slate-700">
                  {pkg.courses.map((course, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{course}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link
              href="/register"
              className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-xs shadow-sm transition-all"
            >
              ثبت‌نام در بسته میکرومستر
            </Link>
          </div>
        ))}
      </section>

      {/* Benefits Grid */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm mb-12">
        <h2 className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
          مزایای تحصیل در دوره‌های میکرومستر
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">تخصص متمرکز</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              تسلط بر یک حوزه شغلی مشخص از مبانی تا سطوح پیشرفته
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <AwardIcon className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">گواهینامه تجمیعی</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              اعطای مدرک ویژه میکرومستر علاوه بر گواهی تک‌تک دروس
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <SparklesIcon className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">شهریه ترجیحی</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              تخفیف ویژه بسته‌ای برای ثبت‌نام در کل دروس پکیج
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">پروژه پایانی یکپارچه</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              پیاده‌سازی یک پروژه جامع صنعتی تحت نظارت مستقیم اساتید
            </p>
          </div>
        </div>
      </section>

      {/* Support Card */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm text-center">
        <h3 className="text-base font-bold text-slate-900 mb-2">
          نیاز به مشاوره در انتخاب پکیج مناسب دارید؟
        </h3>
        <p className="text-xs text-slate-600 mb-5 max-w-md mx-auto">
          برای مشاوره تخصصی در زمینه انتخاب مسیرهای یادگیری با کارشناسان آموزشی تماس حاصل فرمایید.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-6 rounded-xl transition-all"
        >
          <PhoneIcon className="w-4 h-4" />
          <span>مشاوره و پشتیبانی</span>
        </Link>
      </section>
    </MainLayout>
  );
}
