import MainLayout from "@/components/Layout/MainLayout";
import Link from "next/link";
import {
  InfoIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  PhoneIcon,
  AwardIcon,
  ClockIcon,
  AcademicCapIcon,
} from "@/components/Icons";

export default function Info() {
  const faqs = [
    {
      question: "تقویم و زمان‌بندی برگزاری ترم‌ها به چه صورت است؟",
      answer:
        "دوره‌های آموزشی در ترم‌های پاییز، زمستان و بهار ارائه می‌گردند. هر ترم آموزشی استاندارد شامل ۸ هفته جلسات درسی برخط (معادل ۱۶ جلسه ۹۰ دقیقه‌ای)، یک هفته جلسات رفع اشکال و پروژه‌محور و هفته پایانی اختصاص یافته به ارزیابی حضوری است.",
      icon: ClockIcon,
    },
    {
      question: "شیوه برگزاری کلاس‌ها و امتحانات چگونه است؟",
      answer:
        "جلسات تئوری و کارگاهی به صورت تعاملی برخط (آنلاین) در بستر سامانه آموزش الکترونیکی برگزار می‌شوند و ویدیوهای ضبط شده کلاس‌ها در اختیار دانشجویان قرار می‌گیرد. ارزیابی نهایی به صورت استاندارد و حضوری در محل دانشکده مهندسی کامپیوتر برگزار می‌شود.",
      icon: AcademicCapIcon,
    },
    {
      question: "شرایط دریافت گواهینامه رسمی و دوزبانه دانشگاه امیرکبیر چیست؟",
      answer:
        "فراگیرانی که در طول دوره تکالیف و پروژه‌های عملی را تحویل داده و در آزمون پایانی حداقل ۶۰ درصد نمره کل را کسب کنند، موفق به اخذ گواهینامه رسمی دو زبانه (فارسی و انگلیسی) از دانشگاه صنعتی امیرکبیر همراه با کد رهگیری آنلاین خواهند شد.",
      icon: AwardIcon,
    },
    {
      question: "آیا دانشجویان سایر دانشگاه‌ها یا شاغلین صنعت می‌توانند شرکت کنند؟",
      answer:
        "بله، شرکت در دوره‌ها برای عموم دانشجویان، دانش‌آموختگان و فعالان صنعت نرم‌افزار آزاد است و پیش‌نیازهای هر درس در صفحه اختصاصی آن عنوان شده است.",
      icon: CheckCircleIcon,
    },
  ];

  return (
    <MainLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
          <InfoIcon className="w-4 h-4 text-blue-600" />
          <span>راهنما و اطلاعات تکمیلی</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          پرسش‌های متداول و راهنما
        </h1>
        <p className="text-slate-600 text-sm">
          پاسخ به سوالات پرتکرار فراگیران درباره ساختار دوره‌ها، آزمون‌ها و مدارک
        </p>
      </div>

      {/* FAQ Grid */}
      <section className="space-y-4 mb-12">
        {faqs.map((faq, index) => {
          const Icon = faq.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:border-blue-200 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-2 flex-1">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    {faq.question}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Need more help */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm text-center">
        <h3 className="text-base font-bold text-slate-900 mb-2">
          پرسش دیگری دارید که در اینجا پاسخ داده نشده؟
        </h3>
        <p className="text-xs text-slate-600 mb-6 max-w-md mx-auto">
          همکاران ما در دبیرخانه آموزش دانشکده مهندسی کامپیوتر آماده پاسخگویی هستند.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-6 rounded-xl transition-all shadow-sm"
        >
          <PhoneIcon className="w-4 h-4" />
          <span>ارتباط با پشتیبانی آموزشی</span>
        </Link>
      </section>
    </MainLayout>
  );
}
