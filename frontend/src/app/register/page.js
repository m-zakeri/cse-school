import MainLayout from "@/components/Layout/MainLayout";
import Link from "next/link";
import { courses } from "@/data/sampleData";
import {
  UserPlusIcon,
  CheckCircleIcon,
  CalendarIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
} from "@/components/Icons";

export default function Register() {
  const visibleCourses = courses.filter((c) => c.id !== 5);

  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
          <UserPlusIcon className="w-4 h-4 text-blue-600" />
          <span>پرتال پذیرش و ثبت‌نام آنلاین</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          ثبت‌نام در دوره‌های تخصصی ترم پاییز ۱۴۰۴
        </h1>
        <p className="text-slate-600 text-sm">
          فرم پیش‌ثبت‌نام، تعیین دوره و ثبت مشخصات هویتی جهت شرکت در کلاس‌ها و صدور گواهی دانشگاه امیرکبیر
        </p>
      </div>

      {/* Info Notice Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 border border-blue-800 shadow-md">
        <div className="flex items-center gap-2 mb-3 text-blue-300">
          <CalendarIcon className="w-5 h-5" />
          <h2 className="text-sm sm:text-base font-bold text-white">نکات و مهلت‌های ثبت‌نام</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <span className="font-semibold text-white block mb-1">مهلت نهایی ثبت‌نام:</span>
            <p>۵ مهر ۱۴۰۴ (ظرفیت هر دوره محدود به ۳۰ نفر)</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <span className="font-semibold text-white block mb-1">آغاز جلسات برخط:</span>
            <p>۱۰ مهر ۱۴۰۴ در پرتال آموزش الکترونیکی</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
            <span className="font-semibold text-white block mb-1">مدارک هویتی:</span>
            <p>تطبیق کد ملی جهت صدور مدرک رسمی دانشگاهی</p>
          </div>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 mb-8 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
          مراحل فرآیند ثبت‌نام و پذیرش
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              ۱
            </span>
            <p className="text-xs font-bold text-slate-900">انتخاب دوره</p>
            <p className="text-[11px] text-slate-500">انتخاب یک یا چند درس تخصصی</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              ۲
            </span>
            <p className="text-xs font-bold text-slate-900">تکمیل فرم هویتی</p>
            <p className="text-[11px] text-slate-500">ثبت کد ملی و شماره همراه</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              ۳
            </span>
            <p className="text-xs font-bold text-slate-900">اعتبارسنجی تخفیف</p>
            <p className="text-[11px] text-slate-500">تخفیف دانشجویی یا گروهی</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              ۴
            </span>
            <p className="text-xs font-bold text-slate-900">تأیید و دریافت دسترسی</p>
            <p className="text-[11px] text-slate-500">ارسال پیامک و فعال‌سازی پرتال</p>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm mb-12">
        <h2 className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
          فرم پیش‌ثبت‌نام آنلاین
        </h2>

        <form className="space-y-6">
          {/* Course Selection Radio/Check */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-3">
              انتخاب دوره‌(های) مورد تقاضا:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {visibleCourses.map((course) => (
                <label
                  key={course.id}
                  className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    name="courses"
                    value={course.id}
                    className="mt-1 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-900">{course.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      مدرس: {course.instructor} • {course.units} ({course.level})
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="مثال: علی محمدی"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                کد ملی (جهت صدور گواهینامه)
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="ده رقم بدون خط تیره"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                شماره تلفن همراه (جهت دریافت کد پیامکی)
              </label>
              <input
                type="tel"
                required
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="۰۹۱۲..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                پست الکترونیکی (ایمیل)
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                آخرین مقطع تحصیلی
              </label>
              <select className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                <option value="bachelor_student">دانشجوی کارشناسی</option>
                <option value="bachelor">کارشناسی (فارغ‌التحصیل)</option>
                <option value="master_student">دانشجوی کارشناسی ارشد</option>
                <option value="master">کارشناسی ارشد</option>
                <option value="phd">دکتری تخصصی</option>
                <option value="other">سایر</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                دانشگاه / موسسه محل تحصیل یا کار
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="مثال: دانشگاه صنعتی امیرکبیر"
              />
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="flex items-center gap-2.5 pt-2">
            <input
              type="checkbox"
              id="terms_agree"
              required
              className="text-blue-600 rounded focus:ring-blue-500 w-4 h-4"
            />
            <label htmlFor="terms_agree" className="text-xs text-slate-600">
              با{" "}
              <Link href="/terms" className="text-blue-600 font-semibold hover:underline">
                آیین‌نامه و شرایط و مقررات دوره
              </Link>{" "}
              موافقت کامل دارم.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center gap-2"
          >
            <UserPlusIcon className="w-4 h-4" />
            <span>ثبت نهایی درخواست و ارسال مشخصات</span>
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
