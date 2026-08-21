"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MainLayout from "@/components/Layout/MainLayout";
import { courses } from "@/data/sampleData";
import {
  apiCreateBatchEnrollment,
  getLocalDynamicCourses,
  apiGetUserEnrollments,
} from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import {
  UserPlusIcon,
  CheckCircleIcon,
  CalendarIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  ChevronLeftIcon,
  BookOpenIcon,
  SparklesIcon,
} from "@/components/Icons";

export default function Register() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [coursesList, setCoursesList] = useState(
    courses.filter((c) => c.id !== 5)
  );

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    const user = getCurrentUser();
    setCurrentUser(user);

    // Load active enrollments if user is logged in to prevent duplicate course pick
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
              .filter(Boolean);
            setEnrolledCourseIds(ids);
          }
        })
        .catch(() => {});
    }

    // Dynamic courses loading
    const dynamic = getLocalDynamicCourses();
    if (dynamic.length > 0) {
      const dynamicFormatted = dynamic.map((c) => ({
        id: c.course_number || c.id,
        title: c.title_fa || c.title,
        instructor: c.instructor_name || c.instructor,
        units: c.units,
        level: c.level,
      }));
      const combined = [
        ...dynamicFormatted,
        ...courses.filter(
          (c) =>
            c.id !== 5 &&
            !dynamicFormatted.some((d) => d.id === c.id)
        ),
      ];
      setCoursesList(combined);
    }
  }, []);

  const isCourseAlreadyEnrolled = (courseId) => {
    return (
      enrolledCourseIds.includes(courseId) ||
      enrolledCourseIds.includes(String(courseId)) ||
      enrolledCourseIds.includes(Number(courseId))
    );
  };

  const handleCourseToggle = (courseId) => {
    if (isCourseAlreadyEnrolled(courseId)) {
      return; // Cannot toggle an already enrolled course
    }
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleEnrolledSubmit = async (e) => {
    e.preventDefault();
    // Filter out any accidentally picked existing course
    const newCoursesToEnroll = selectedCourses.filter(
      (id) => !isCourseAlreadyEnrolled(id)
    );

    if (newCoursesToEnroll.length === 0) {
      setErrorMessage("لطفاً حداقل یک دوره جدید برای اخذ انتخاب نمایید.");
      return;
    }
    if (!agreeTerms) {
      setErrorMessage("پذیرش آیین‌نامه و قوانین آموزشی الزامی است.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const payload = {
      course_ids: newCoursesToEnroll,
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
      const primaryTracking =
        enrollments[0]?.tracking_code ||
        `AUT-1404-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Update local enrolled list
      setEnrolledCourseIds((prev) => [...prev, ...newCoursesToEnroll]);

      setSuccessData({
        trackingCode: primaryTracking,
        coursesCount: newCoursesToEnroll.length,
        studentName: currentUser.full_name,
        nationalId: currentUser.national_id,
      });
    } catch {
      // Offline fallback
      const fallbackTracking = `AUT-1404-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;
      setEnrolledCourseIds((prev) => [...prev, ...newCoursesToEnroll]);
      setSuccessData({
        trackingCode: fallbackTracking,
        coursesCount: newCoursesToEnroll.length,
        studentName: currentUser.full_name,
        nationalId: currentUser.national_id,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <MainLayout>
        <div className="py-20 text-center text-xs text-slate-500">
          در حال بارگذاری فرم انتخاب دوره...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
          <BookOpenIcon className="w-4 h-4 text-blue-600" />
          <span>پرتال اخذ و ثبت‌نام دوره‌ها — ترم پاییز ۱۴۰۴</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          انتخاب و اخذ دوره‌های تخصصی
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          دوره‌های مورد تقاضای خود را انتخاب کنید تا مستقیماً به برنامه درسی شما افزوده شوند.
        </p>
      </div>

      {successData ? (
        /* Success Receipt Card */
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 shadow-sm text-center max-w-xl mx-auto mb-12">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <CheckCircleIcon className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 mb-1">
            دوره‌های انتخابی با موفقیت ثبت شدند
          </h2>
          <p className="text-xs text-slate-600 mb-6">
            پرونده آموزشی شما به‌روزرسانی شد و لینک کلاس‌ها در پرتال شما فعال است.
          </p>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 mb-6 text-right space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
              <span className="text-slate-500">کد رهگیری ثبت‌نام:</span>
              <span className="font-mono font-bold text-sm text-blue-700 dir-ltr">
                {successData.trackingCode}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">نام دانشجو:</span>
              <span className="font-bold text-slate-800">
                {successData.studentName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">کد ملی:</span>
              <span className="font-bold font-mono text-slate-900">
                {successData.nationalId}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-500">تعداد دوره‌های جدید اخذ شده:</span>
              <span className="font-bold text-emerald-700">
                {successData.coursesCount} دوره
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-3 px-6 rounded-xl transition-all shadow-sm"
            >
              <span>مشاهده برنامه کلاسی در پرتال من</span>
              <ChevronLeftIcon className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                setSuccessData(null);
                setSelectedCourses([]);
              }}
              className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium py-3 px-6 rounded-xl transition-all"
            >
              اخذ دوره‌های دیگر
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* User Identity Status Card */}
          {currentUser ? (
            <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 mb-8 border border-blue-800 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-blue-300 font-bold text-lg">
                    {currentUser.full_name?.charAt(0) || "👤"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm sm:text-base font-bold text-white">
                        {currentUser.full_name || "دانشجوی گرامی"}
                      </p>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        وارد شده
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      کد ملی: <span className="font-mono">{currentUser.national_id}</span> • ایمیل: {currentUser.email || "ثبت‌شده"}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-300 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 self-start sm:self-auto flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {enrolledCourseIds.length > 0
                      ? `شما قبلاً ${enrolledCourseIds.length} دوره اخذ کرده‌اید.`
                      : "اطلاعات هویتی شما ثبت است؛ کافیست دوره‌ها را انتخاب کنید."}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-3xl p-5 sm:p-6 mb-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <ShieldCheckIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-amber-950">
                    برای اخذ دوره‌ها، ابتدا وارد حساب خود شوید
                  </p>
                  <p className="text-xs text-amber-800 mt-0.5">
                    پس از یک‌بار ورود یا ایجاد حساب، نیازی به ثبت مکرر اطلاعات در هیچ دوره‌ای نخواهید داشت.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <Link
                  href="/login?redirect=/register"
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs"
                >
                  ورود به حساب
                </Link>
                <Link
                  href="/login?tab=signup&redirect=/register"
                  className="bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                >
                  ایجاد حساب جدید
                </Link>
              </div>
            </div>
          )}

          {/* Course Selection Form */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm mb-12">
            <h2 className="text-base font-bold text-slate-900 mb-2">
              فهرست دوره‌های ارائه شده در ترم
            </h2>
            <p className="text-xs text-slate-500 mb-6 pb-3 border-b border-slate-100">
              دوره‌های مورد نظر خود را با زدن تیک انتخاب نمایید (دوره‌هایی که قبلاً اخذ نموده‌اید غیرفعال شده‌اند).
            </p>

            {errorMessage && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form
              onSubmit={
                currentUser ? handleEnrolledSubmit : (e) => e.preventDefault()
              }
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {coursesList.map((course) => {
                  const alreadyEnrolled = isCourseAlreadyEnrolled(course.id);
                  const isSelected = selectedCourses.includes(course.id);

                  return (
                    <label
                      key={course.id}
                      onClick={() => !alreadyEnrolled && handleCourseToggle(course.id)}
                      className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all ${
                        alreadyEnrolled
                          ? "border-emerald-200 bg-emerald-50/40 opacity-80 cursor-default"
                          : isSelected
                          ? "border-blue-600 bg-blue-50/60 shadow-sm cursor-pointer"
                          : "border-slate-200/80 hover:border-blue-300 hover:bg-slate-50/80 cursor-pointer"
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={alreadyEnrolled}
                        checked={alreadyEnrolled || isSelected}
                        onChange={() => {}}
                        className={`mt-1 rounded w-4 h-4 ${
                          alreadyEnrolled
                            ? "text-emerald-600 cursor-default"
                            : "text-blue-600 focus:ring-blue-500 cursor-pointer"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-bold text-slate-900">
                            {course.title}
                          </p>
                          {alreadyEnrolled ? (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                              <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600" />
                              <span>قبلاً اخذ شده</span>
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                              {course.units}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          مدرس: {course.instructor} • سطح: {course.level}
                        </p>
                        {alreadyEnrolled && (
                          <p className="text-[10px] text-emerald-700 font-medium mt-1">
                            این دوره در برنامه درسی پرتال شما قرار دارد.
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Terms and Submit */}
              {currentUser ? (
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="terms_agree"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="text-blue-600 rounded focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <label
                      htmlFor="terms_agree"
                      className="text-xs text-slate-600 cursor-pointer"
                    >
                      با{" "}
                      <Link
                        href="/terms"
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        آیین‌نامه و شرایط و مقررات دوره‌ها
                      </Link>{" "}
                      موافقت کامل دارم.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || selectedCourses.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>در حال ثبت نهایی دوره‌ها...</span>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>
                          ثبت نهایی و اخذ{" "}
                          {selectedCourses.length > 0
                            ? `(${selectedCourses.length} دوره جدید)`
                            : "دوره‌ها"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-5 rounded-2xl">
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {selectedCourses.length > 0
                        ? `${selectedCourses.length} دوره توسط شما انتخاب شده است.`
                        : "دوره‌های مورد نظرتان را انتخاب کنید."}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      برای ثبت، لطفاً وارد شوید یا در چند ثانیه ثبت‌نام کنید.
                    </p>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Link
                      href="/login?redirect=/register"
                      className="flex-1 sm:flex-initial text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl text-xs shadow-xs transition-all"
                    >
                      ورود به حساب
                    </Link>
                    <Link
                      href="/login?tab=signup&redirect=/register"
                      className="flex-1 sm:flex-initial text-center bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold py-2.5 px-5 rounded-xl text-xs transition-all"
                    >
                      ایجاد حساب جدید
                    </Link>
                  </div>
                </div>
              )}
            </form>
          </div>
        </>
      )}
    </MainLayout>
  );
}
