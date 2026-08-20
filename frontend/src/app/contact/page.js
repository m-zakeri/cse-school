import MainLayout from "@/components/Layout/MainLayout";
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  BuildingIcon,
  ExternalLinkIcon,
  AcademicCapIcon,
} from "@/components/Icons";

export default function Contact() {
  return (
    <MainLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
          <PhoneIcon className="w-4 h-4 text-blue-600" />
          <span>پشتیبانی و راه‌های ارتباطی</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          تماس با ما
        </h1>
        <p className="text-slate-600 text-sm">
          راه‌های ارتباط مستقیم با دبیرخانه آموزش‌های تخصصی دانشکده مهندسی کامپیوتر دانشگاه امیرکبیر
        </p>
      </div>

      {/* Contact Information Cards */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Contact Channels */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
                راه‌های ارتباط مستقیم
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MailIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">پست الکترونیکی</p>
                    <p className="text-xs text-slate-600 font-sans mt-0.5">ce-school@aut.ac.ir</p>
                    <p className="text-[11px] text-slate-400 mt-1">پاسخگویی حداکثر ظرف ۲۴ ساعت کاری</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <PhoneIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">تلفن دبیرخانه</p>
                    <p className="text-xs text-slate-600 font-sans mt-0.5">۰۲۱-۶۴۵۴۰۰۰۰</p>
                    <p className="text-[11px] text-slate-400 mt-1">شنبه تا چهارشنبه از ساعت ۸ الی ۱۶</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MapPinIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">آدرس و موقعیت</p>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      تهران، خیابان حافظ، روبروی خیابان سمیه، دانشگاه صنعتی امیرکبیر، دانشکده مهندسی کامپیوتر
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Official Websites & Portals */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
                درگاه‌های رسمی و پرتال‌ها
              </h2>

              <div className="space-y-4">
                <a
                  href="https://ce.aut.ac.ir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-xs">
                      <BuildingIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        وب‌سایت دانشکده مهندسی کامپیوتر
                      </p>
                      <p className="text-[11px] text-slate-500 font-sans">ce.aut.ac.ir</p>
                    </div>
                  </div>
                  <ExternalLinkIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </a>

                <a
                  href="https://aut.ac.ir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-xs">
                      <AcademicCapIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        پورتال اصلی دانشگاه صنعتی امیرکبیر
                      </p>
                      <p className="text-[11px] text-slate-500 font-sans">aut.ac.ir</p>
                    </div>
                  </div>
                  <ExternalLinkIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </a>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-bold text-slate-900 mb-1">کانال اطلاع‌رسانی رسمی</p>
                  <p className="text-xs text-slate-600">
                    اخبار شروع دوره‌ها، تغییرات تقویم و وبینارها در کانال رسمی اطلاع‌رسانی خواهد شد.
                  </p>
                  <p className="text-xs font-semibold text-blue-600 font-sans mt-2">@aut_ce_school</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
