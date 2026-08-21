"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MainLayout from "@/components/Layout/MainLayout";
import { getCurrentUser, clearAuthSession } from "@/lib/auth";
import { apiGetUserEnrollments } from "@/lib/api";
import { courses } from "@/data/sampleData";
import {
  AcademicCapIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  UsersIcon,
  AwardIcon,
  ExternalLinkIcon,
  UserPlusIcon,
  ChevronLeftIcon,
} from "@/components/Icons";
import { toPersianDigits, formatTrackingCode } from "@/lib/formatters";

function getInstructorName(course) {
  if (!course) return "عضو هیئت علمی";
  if (course.instructor_name && typeof course.instructor_name === "string") {
    return course.instructor_name;
  }
  if (course.instructor) {
    if (typeof course.instructor === "string") return course.instructor;
    if (typeof course.instructor === "object" && course.instructor.name) {
      return course.instructor.name;
    }
  }
  return "عضو هیئت علمی دانشگاه صنعتی امیرکبیر";
}

export default function StudentDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [userEnrollments, setUserEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const currentUser = getCurrentUser();
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    setUser(currentUser);

    async function loadData() {
      try {
        if (currentUser.national_id) {
          const enrs = await apiGetUserEnrollments(currentUser.national_id);
          if (Array.isArray(enrs)) {
            setUserEnrollments(enrs);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.log("Could not load dynamic user enrollments:", err);
      }

      setUserEnrollments([]);
      setIsLoading(false);
    }

    loadData();
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
  };

  if (!isMounted) {
    return (
      <MainLayout>
        <div className="py-20 text-center text-xs text-slate-500">
          در حال بارگذاری پرتال...
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-md mx-auto py-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <AcademicCapIcon className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mb-2">
            ورود به پرتال دانشجو
          </h1>
          <p className="text-xs text-slate-600 mb-6">
            برای مشاهده برنامه کلاسی و دوره‌های خود، ابتدا وارد شوید یا ثبت‌نام کنید.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-sm text-xs flex items-center justify-center gap-2"
            >
              <span>ورود به حساب کاربری</span>
              <ChevronLeftIcon className="w-4 h-4" />
            </Link>
            <Link
              href="/register"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-6 rounded-xl text-xs"
            >
              پیش‌ثبت‌نام در دوره‌ها
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl border border-blue-100">
              {user.full_name?.charAt(0) || "د"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {user.full_name || "دانشجوی گرامی"}
                </h1>
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-100">
                  پرتال دانشجو
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                کد ملی: {user.national_id} • دانشگاه صنعتی امیرکبیر
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs text-slate-500 hover:text-red-600 font-medium px-4 py-2 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 transition-colors self-start sm:self-auto"
          >
            خروج از حساب
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpenIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">دوره‌های ثبت‌نام‌شده</p>
              <p className="text-lg font-extrabold text-slate-900">
                {toPersianDigits(userEnrollments.length)} دوره
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">وضعیت پرونده تحصیلی</p>
              <p className="text-sm font-extrabold text-emerald-600">تأییدشده و فعال</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <AwardIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">ترم جاری</p>
              <p className="text-sm font-extrabold text-indigo-600">پاییز ۱۴۰۴</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Grid */}
      <div className="space-y-6 mb-12">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AcademicCapIcon className="w-5 h-5 text-blue-600" />
            <span>برنامه کلاسی و دوره‌های من</span>
          </h2>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline"
          >
            <UserPlusIcon className="w-4 h-4" />
            <span>ثبت‌نام در دوره جدید</span>
          </Link>
        </div>

        {userEnrollments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <BookOpenIcon className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              هنوز دوره‌ای در این ترم اخذ نکرده‌اید
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              جهت مشاهده فهرست دوره‌های فعال ترم پاییز ۱۴۰۴ و ثبت‌نام روی دکمه زیر کلیک نمایید.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 px-6 rounded-xl transition-all shadow-sm"
            >
              <UserPlusIcon className="w-4 h-4" />
              <span>انتخاب و اخذ دوره‌های آموزشی</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userEnrollments.map((enr, idx) => {
              const courseData = enr.course || courses[idx % courses.length];
              const instructorName = getInstructorName(courseData);
              return (
                <div
                  key={enr.id || idx}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-100">
                        ثبت‌نام نهایی
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono dir-ltr">
                        {formatTrackingCode(enr.tracking_code)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {courseData?.title_fa || courseData?.title}
                    </h3>

                    <p className="text-xs text-slate-500">
                      مدرس: {instructorName} • {courseData?.units || "۳ واحد"}
                    </p>

                    <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 space-y-1 border border-slate-100">
                      <p>• زمان برگزاری: یکشنبه و سه‌شنبه ۱۶:۰۰ الی ۱۷:۳۰</p>
                      <p>• شیوه برگزاری: سامانه آموزش مجازی ادوبی کانکت دانشگاه</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-4 border-t border-slate-100">
                    <a
                      href="https://lms.aut.ac.ir"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                    >
                      <ExternalLinkIcon className="w-3.5 h-3.5" />
                      <span>ورود به کلاس آنلاین</span>
                    </a>
                    <Link
                      href={`/courses/${courseData?.course_number || courseData?.id || 1}`}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium py-2.5 px-3 rounded-xl transition-all"
                    >
                      سرفصل‌ها
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
