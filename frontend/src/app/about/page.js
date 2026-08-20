import MainLayout from "@/components/Layout/MainLayout";
import Link from "next/link";
import {
  BuildingIcon,
  AcademicCapIcon,
  AwardIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
  PhoneIcon,
  InfoIcon,
} from "@/components/Icons";

export default function About() {
  return (
    <MainLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
          <BuildingIcon className="w-4 h-4 text-blue-600" />
          <span>درباره دانشگاه و مرکز آموزش</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          درباره مدرسه آموزش‌های تخصصی
        </h1>
        <p className="text-slate-600 text-sm">
          آشنایی با رسالت، اهداف و اعتبار مدارک صادر شده از دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر
        </p>
      </div>

      {/* Introduction Card */}
      <section className="mb-10">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
            معرفی مدرسه تخصصی مهندسی کامپیوتر امیرکبیر
          </h2>
          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <p>
              «مدرسه تخصصی مهندسی کامپیوتر دانشگاه امیرکبیر» با هدف ارائه‌ی آموزش‌های استاندارد، عمیق و مهارت‌محور در مرزهای دانش مهندسی کامپیوتر، هوش مصنوعی و نرم‌افزار برگزار می‌شود. تمرکز اصلی این برنامه‌ها، توانمندسازی علمی و عملی فراگیران جهت حل مسائل پیچیده صنعتی و فعالیت در پروژه‌های پیشرفته است.
            </p>
            <p>
              سرفصل‌های هر دوره منطبق بر دروس رسمی و مصوب دانشگاهی و با بازنگری مطابق آخرین فناوری‌های روز دنیا تدوین شده و توسط اعضای هیئت‌علمی دانشکده تدریس می‌شوند.
            </p>
            <p>
              در پایان دوره، برای فراگیرانی که در ارزیابی‌ها و آزمون پایانی حدنصاب قبولی را کسب نمایند، گواهینامه رسمی و دوزبانه دانشگاه صنعتی امیرکبیر (پلی‌تکنیک تهران) همراه با کد استعلام آنلاین و اعتبارسنجی صادر می‌گردد.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars / Goals Grid */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-6">
          ارکان و رویکردهای اصلی برنامه
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              استاندارد علمی دانشگاهی
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              ارائه محتوای معتبر و نظام‌مند تحت نظارت مستقیم اساتید هیئت علمی دانشکده مهندسی کامپیوتر.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <AwardIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              گواهینامه رسمی و دوزبانه
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              اعطای مدرک معتبر با سربرگ دانشگاه صنعتی امیرکبیر مناسب برای ارتقای شغلی و رزومه بین‌المللی.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              شیوه آموزشی منعطف
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              ترکیب جلسات تعاملی آنلاین با پروژه‌های عملی و ارزیابی نهایی جهت تضمین کیفیت یادگیری.
            </p>
          </div>
        </div>
      </section>

      {/* Regulations Card */}
      <section className="mb-10">
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-8 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">
              آیین‌نامه، قوانین و ضوابط آموزشی
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed max-w-2xl">
              برای آگاهی کامل از مقررات حضور در کلاس‌ها، شیوه انصراف و بازگشت وجه، تخفیف‌های دانشجویی و معیار نمره‌دهی، بخش آیین‌نامه را مطالعه فرمایید.
            </p>
          </div>
          <Link
            href="/terms"
            className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-3 px-5 rounded-xl transition-all shrink-0"
          >
            <span>مطالعه شرایط و مقررات</span>
            <ChevronLeftIcon className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Support & Contact Quick Actions */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm text-center">
        <h2 className="text-base font-bold text-slate-900 mb-2">
          نیاز به راهنمایی یا مشاوره دارید؟
        </h2>
        <p className="text-slate-600 text-xs mb-6 max-w-md mx-auto">
          کارشناسان آموزش دانشکده مهندسی کامپیوتر آماده پاسخگویی به پرسش‌های شما هستند.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all"
          >
            <PhoneIcon className="w-4 h-4" />
            <span>راه‌های ارتباطی و تماس</span>
          </Link>
          <Link
            href="/info"
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium py-2.5 px-5 rounded-xl transition-all"
          >
            <InfoIcon className="w-4 h-4" />
            <span>پرسش‌های متداول</span>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
