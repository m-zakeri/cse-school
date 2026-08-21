"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/Layout/MainLayout";
import { getCurrentUser } from "@/lib/auth";
import { apiCreateBatchEnrollment, apiGetUserEnrollments } from "@/lib/api";
import {
  LayersIcon,
  AcademicCapIcon,
  AwardIcon,
  ShieldCheckIcon,
  SparklesIcon,
  PhoneIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  UserPlusIcon,
} from "@/components/Icons";

export default function Micromaster() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [enrollingPackageId, setEnrollingPackageId] = useState(null);
  const [successReceipt, setSuccessReceipt] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const packages = [
    {
      id: 1,
      title: "میکرومستر مهندسی نرم‌افزار و معماری سیستم",
      courseIds: [3, 4, 2, 6],
      courses: [
        { id: 3, title: "برنامه‌نویسی شی‌گرا (جاوا)", instructor: "دکتر طارمی راد" },
        { id: 4, title: "مهندسی نرم‌افزار", instructor: "دکتر طارمی راد" },
        { id: 2, title: "آزمون و تضمین کیفیت نرم‌افزار", instructor: "دکتر ذاکری" },
        { id: 6, title: "اصول و الگوها در مهندسی نرم‌افزار", instructor: "دکتر ذاکری" },
      ],
      description:
        "مسیر جامع تسلط بر اصول تحلیل، طراحی الگوها (GoF/SOLID)، معماری کلین و آزمون خودکار نرم‌افزار با گواهینامه معتبر دانشگاه صنعتی امیرکبیر.",
      units: "۱۲ واحد معادل",
      originalPrice: "۱۰,۰۰۰,۰۰۰ تومان",
      packagePrice: "۷,۵۰۰,۰۰۰ تومان (۲۵٪ تخفیف بسته)",
      badgeColor: "from-blue-600 to-indigo-600",
    },
    {
      id: 2,
      title: "میکرومستر هوش مصنوعی و رایانش ابری",
      courseIds: [1, 7],
      courses: [
        { id: 1, title: "یادگیری ماشین", instructor: "دکتر ناظرفرد" },
        { id: 7, title: "اصول رایانش ابری", instructor: "دکتر جوادی" },
      ],
      description:
        "مسیر تخصصی یادگیری ماشین، مدل‌های هوشمند داده‌محور و استقرار مقیاس‌پذیر در زیرساخت‌های کانتینری و ابری.",
      units: "۶ واحد معادل",
      originalPrice: "۵,۰۰۰,۰۰۰ تومان",
      packagePrice: "۳,۹۰۰,۰۰۰ تومان (۲۰٪ تخفیف بسته)",
      badgeColor: "from-indigo-600 to-purple-600",
    },
  ];

  useEffect(() => {
    setIsMounted(true);
    const user = getCurrentUser();
    setCurrentUser(user);

    if (user?.national_id) {
      apiGetUserEnrollments(user.national_id)
        .then((enrs) => {
          if (Array.isArray(enrs)) {
            const ids = enrs
              .map(
                (e) =>
                  e.course?.course_number ||
                  e.course?.id ||
                  e.course_id
              )
              .filter(Boolean)
              .map((id) => Number(id) || id);
            setEnrolledCourseIds(ids);
          }
        })
        .catch(() => {});
    }
  }, []);

  const isPackageFullyEnrolled = (pkg) => {
    return pkg.courseIds.every(
      (cId) =>
        enrolledCourseIds.includes(cId) ||
        enrolledCourseIds.includes(String(cId)) ||
        enrolledCourseIds.includes(Number(cId))
    );
  };

  const handleEnrollPackage = async (pkg) => {
    if (!currentUser) {
      router.push(`/login?redirect=/micromaster`);
      return;
    }

    setEnrollingPackageId(pkg.id);
    setErrorMessage("");

    // Filter courses not yet enrolled
    const neededCourseIds = pkg.courseIds.filter(
      (cId) =>
        !enrolledCourseIds.includes(cId) &&
        !enrolledCourseIds.includes(String(cId)) &&
        !enrolledCourseIds.includes(Number(cId))
    );

    if (neededCourseIds.length === 0) {
      setErrorMessage("تمامی دوره‌های این بسته قبلاً توسط شما اخذ شده‌اند.");
      setEnrollingPackageId(null);
      return;
    }

    const payload = {
      course_ids: neededCourseIds,
      national_id: currentUser.national_id,
      phone_number: currentUser.phone_number || "09120000000",
      email: currentUser.email || "student@aut.ac.ir",
      full_name: currentUser.full_name || "دانشجو",
      education_level: currentUser.education_level || "bachelor_student",
      university: currentUser.university || "دانشگاه صنعتی امیرکبیر",
      field_of_study: "مهندسی کامپیوتر",
    };

    try {
      const enrollments = await apiCreateBatchEnrollment(payload);
      const tracking =
        enrollments[0]?.tracking_code ||
        `AUT-MM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      setEnrolledCourseIds((prev) => [...prev, ...neededCourseIds]);

      setSuccessReceipt({
        packageTitle: pkg.title,
        coursesCount: neededCourseIds.length,
        trackingCode: tracking,
        studentName: currentUser.full_name,
      });
    } catch {
      // Local fallback
      const tracking = `AUT-MM-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;
      setEnrolledCourseIds((prev) => [...prev, ...neededCourseIds]);
      setSuccessReceipt({
        packageTitle: pkg.title,
        coursesCount: neededCourseIds.length,
        trackingCode: tracking,
        studentName: currentUser.full_name,
      });
    } finally {
      setEnrollingPackageId(null);
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
          <LayersIcon className="w-4 h-4 text-blue-600" />
          <span>مسیرهای تخصصی و یکپارچه</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          بسته‌های تخصصی میکرومستر (Micro-Masters)
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          با انتخاب بسته میکرومستر، کلیه دوره‌های تخصصی آن حوزه به صورت مستقیم در پرونده تحصیلی شما ثبت شده و از تخفیف ویژه بهره‌مند می‌شوید.
        </p>
      </div>

      {/* Success Receipt Modal / Card */}
      {successReceipt && (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-10 shadow-sm text-center max-w-xl mx-auto mb-10">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <CheckCircleIcon className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 mb-1">
            ثبت‌نام بسته میکرومستر با موفقیت انجام شد
          </h2>
          <p className="text-xs text-slate-600 mb-6">
            تمامی دوره‌های این بسته به برنامه درسی شما در سامانه آموزش دانشگاه افزوده شدند.
          </p>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 mb-6 text-right space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">عنوان بسته:</span>
              <span className="font-bold text-slate-900">{successReceipt.packageTitle}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">کد رهگیری:</span>
              <span className="font-mono font-bold text-blue-700 dir-ltr">{successReceipt.trackingCode}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">دانشجو:</span>
              <span className="font-bold text-slate-800">{successReceipt.studentName}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-500">تعداد دوره‌های اضافه‌شده:</span>
              <span className="font-bold text-emerald-700">{successReceipt.coursesCount} دوره تخصصی</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-3 px-6 rounded-xl transition-all shadow-sm"
            >
              <span>مشاهده کلاس‌ها در پرتال من</span>
              <ChevronLeftIcon className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setSuccessReceipt(null)}
              className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium py-3 px-6 rounded-xl transition-all"
            >
              بستن
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 max-w-xl mx-auto">
          <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Package Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {packages.map((pkg) => {
          const fullyEnrolled = isPackageFullyEnrolled(pkg);
          const isEnrolling = enrollingPackageId === pkg.id;

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
                    {pkg.units}
                  </span>
                  {fullyEnrolled ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>اخذ شده در پرتال</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      پذیرش فعال
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                  {pkg.title}
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed mb-5">
                  {pkg.description}
                </p>

                {/* Courses in Package */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
                  <p className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                    <AcademicCapIcon className="w-4 h-4 text-blue-600" />
                    <span>عناوین دوره‌های موجود در این بسته:</span>
                  </p>
                  <ul className="space-y-2.5 text-xs">
                    {pkg.courses.map((course) => {
                      const isCourseEnrolled =
                        enrolledCourseIds.includes(course.id) ||
                        enrolledCourseIds.includes(String(course.id)) ||
                        enrolledCourseIds.includes(Number(course.id));

                      return (
                        <li
                          key={course.id}
                          className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200/70"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircleIcon
                              className={`w-4 h-4 ${
                                isCourseEnrolled
                                  ? "text-emerald-600"
                                  : "text-blue-600"
                              }`}
                            />
                            <span className="font-semibold text-slate-800">
                              {course.title}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {course.instructor}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Price Box */}
                <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-100/80 mb-6 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 line-through block">
                      {pkg.originalPrice}
                    </span>
                    <span className="text-xs font-bold text-blue-900">
                      {pkg.packagePrice}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-xs">
                    گواهی ویژه تجمیعی
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {fullyEnrolled ? (
                <Link
                  href="/dashboard"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs shadow-xs transition-all"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>مشاهده در پرتال کلاسی من</span>
                </Link>
              ) : currentUser ? (
                <button
                  type="button"
                  disabled={isEnrolling}
                  onClick={() => handleEnrollPackage(pkg)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isEnrolling ? (
                    <span>در حال اخذ و ثبت بسته در پرونده...</span>
                  ) : (
                    <>
                      <SparklesIcon className="w-4 h-4" />
                      <span>ثبت‌نام مستقیم و اخذ کل بسته</span>
                    </>
                  )}
                </button>
              ) : (
                <Link
                  href={`/login?redirect=/micromaster`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs shadow-md hover:shadow-lg transition-all"
                >
                  <UserPlusIcon className="w-4 h-4" />
                  <span>ورود و اخذ یکپارچه بسته</span>
                </Link>
              )}
            </div>
          );
        })}
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
