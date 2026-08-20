import MainLayout from "@/components/Layout/MainLayout";
import Link from "next/link";
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  AwardIcon,
  AcademicCapIcon,
  PhoneIcon,
} from "@/components/Icons";

export default function Terms() {
  return (
    <MainLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
          <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
          <span>آیین‌نامه و قوانین آموزشی</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          شرایط، ضوابط و مقررات آموزشی
        </h1>
        <p className="text-slate-600 text-sm">
          آیین‌نامه جامع ثبت‌نام، حضور در کلاس، ارزیابی پایان‌ترم، شرایط انصراف و تخفیف‌های دانشجویی
        </p>
      </div>

      <div className="space-y-8 mb-12">
        {/* General Regulations */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2.5">
            <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
            <span>۱. مقررات عمومی و ثبت‌نام</span>
          </h2>
          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <p>
              ثبت‌نام در دوره‌های تخصصی دانشکده مهندسی کامپیوتر دانشگاه امیرکبیر به منزله پذیرش کامل ضوابط آموزشی دانشگاه است.
            </p>
            <p>
              فراگیران موظف به درج اطلاعات صحیح هویتی (کد ملی و مشخصات شناسنامه‌ای) جهت صدور گواهی رسمی هستند. مسئولیت هرگونه مغایرت اطلاعات متوجه متقاضی خواهد بود.
            </p>
          </div>
        </section>

        {/* Attendance & Delivery Structure */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2.5">
            <AcademicCapIcon className="w-5 h-5 text-indigo-600" />
            <span>۲. ساختار جلسات و حضور در کلاس</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                جلسات برخط (آنلاین)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                کلاس‌ها در بستر پرتال آموزش الکترونیکی برگزار شده و ویدیوهای ضبط‌شده تا پایان ترم در دسترس دانشجویان قرار می‌گیرد.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                ارزیابی و آزمون پایانی
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                آزمون نهایی به صورت استاندارد و حضوری در دانشکده مهندسی کامپیوتر برگزار می‌گردد.
              </p>
            </div>
          </div>
        </section>

        {/* Cancellation & Refund Policies */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2.5">
            <ShieldCheckIcon className="w-5 h-5 text-amber-600" />
            <span>۳. ضوابط انصراف و عودت شهریه</span>
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-100 flex items-start gap-3">
              <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">انصراف تا ۷ روز قبل از شروع دوره:</span>
                <p className="text-emerald-800 mt-0.5">عودت ۱۰۰٪ مبلغ شهریه بدون هیچ‌گونه کسر وجه.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 text-amber-900 border border-amber-100 flex items-start gap-3">
              <CheckCircleIcon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">انصراف تا پیش از تشکیل جلسه دوم:</span>
                <p className="text-amber-800 mt-0.5">عودت ۷۰٪ مبلغ شهریه یا انتقال اعتبار به دوره ترم بعد.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 flex items-start gap-3">
              <CheckCircleIcon className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">پس از جلسه دوم:</span>
                <p className="text-slate-600 mt-0.5">به دلیل تکمیل ظرفیت، امکان عودت شهریه مقدور نمی‌باشد.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Discounts */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2.5">
            <AwardIcon className="w-5 h-5 text-blue-600" />
            <span>۴. تسهیلات و تخفیف‌های آموزشی</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
              <span className="font-bold text-blue-900 block mb-1">تخفیف دانشجویان امیرکبیر</span>
              <p className="text-blue-800 font-semibold text-base mb-1">۲۰٪ تخفیف</p>
              <p className="text-slate-600">ویژه دانشجویان در حال تحصیل دانشگاه صنعتی امیرکبیر</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
              <span className="font-bold text-indigo-900 block mb-1">ثبت‌نام زودهنگام</span>
              <p className="text-indigo-800 font-semibold text-base mb-1">۱۰٪ تخفیف</p>
              <p className="text-slate-600">ثبت‌نام در هفته اول بازگشایی سامانه پذیرش</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="font-bold text-emerald-900 block mb-1">ثبت‌نام گروهی و شرکتی</span>
              <p className="text-emerald-800 font-semibold text-base mb-1">۱۵٪ تخفیف</p>
              <p className="text-slate-600">معرفی بیش از ۳ فراگیر از یک سازمان یا دانشگاه</p>
            </div>
          </div>
        </section>
      </div>

      {/* Support Action */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm text-center">
        <h3 className="text-base font-bold text-slate-900 mb-2">
          نیاز به استعلام یا طرح شرایط ویژه دارید؟
        </h3>
        <p className="text-xs text-slate-600 mb-5 max-w-md mx-auto">
          جهت هماهنگی ثبت‌نام سازمانی و درخواست‌های ویژه با دبیرخانه آموزش تماس بگیرید.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-6 rounded-xl transition-all"
        >
          <PhoneIcon className="w-4 h-4" />
          <span>ارتباط با پشتیبانی</span>
        </Link>
      </section>
    </MainLayout>
  );
}
