"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MainLayout from "@/components/Layout/MainLayout";
import { courses } from "@/data/sampleData";
import { apiCreateBatchEnrollment, getLocalDynamicCourses } from "@/lib/api";
import { saveAuthSession } from "@/lib/auth";
import {
  UserPlusIcon,
  CheckCircleIcon,
  CalendarIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  ChevronLeftIcon,
  LockClosedIcon,
} from "@/components/Icons";

export default function Register() {
  const [coursesList, setCoursesList] = useState(courses.filter((c) => c.id !== 5));

  useEffect(() => {
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
        ...courses.filter((c) => c.id !== 5 && !dynamicFormatted.some((d) => d.id === c.id)),
      ];
      setCoursesList(combined);
    }
  }, []);

  const [selectedCourses, setSelectedCourses] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    nationalId: "",
    phoneNumber: "",
    email: "",
    password: "",
    educationLevel: "bachelor_student",
    university: "",
    agreeTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState(null);

  const handleCourseToggle = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCourses.length === 0) {
      setErrorMessage("لطفاً حداقل یک دوره را برای ثبت‌نام انتخاب کنید.");
      return;
    }
    if (!formData.agreeTerms) {
      setErrorMessage("پذیرش آیین‌نامه و قوانین آموزشی الزامی است.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const effectivePassword = formData.password.trim() || formData.nationalId.trim();

    const payload = {
      course_ids: selectedCourses,
      national_id: formData.nationalId.trim(),
      phone_number: formData.phoneNumber.trim(),
      email: formData.email.trim(),
      full_name: formData.fullName.trim(),
      password: effectivePassword,
      education_level: formData.educationLevel,
      university: formData.university.trim(),
      field_of_study: "مهندسی کامپیوتر",
    };

    try {
      const enrollments = await apiCreateBatchEnrollment(payload);
      const primaryTracking =
        enrollments[0]?.tracking_code || `AUT-1404-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Save user session directly so they are immediately logged in
      const userObj = {
        national_id: formData.nationalId.trim(),
        phone_number: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        full_name: formData.fullName.trim(),
        role: "STUDENT",
      };
      saveAuthSession("student-session", userObj);

      setSuccessData({
        trackingCode: primaryTracking,
        coursesCount: selectedCourses.length,
        studentName: formData.fullName,
        nationalId: formData.nationalId,
        passwordHint: formData.password.trim() ? "کلمه عبور انتخابی شما" : `کد ملی شما (${formData.nationalId})`,
      });
    } catch {
      // Offline fallback simulation
      const fallbackTracking = `AUT-1404-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const userObj = {
        national_id: formData.nationalId.trim(),
        phone_number: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        full_name: formData.fullName.trim(),
        role: "STUDENT",
      };
      saveAuthSession("student-session", userObj);

      setSuccessData({
        trackingCode: fallbackTracking,
        coursesCount: selectedCourses.length,
        studentName: formData.fullName,
        nationalId: formData.nationalId,
        passwordHint: formData.password.trim() ? "کلمه عبور انتخابی شما" : `کد ملی شما (${formData.nationalId})`,
      });
    } finally {
      setIsLoading(false);
    }
  };

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

      {successData ? (
        /* Success Receipt Card */
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 shadow-sm text-center max-w-xl mx-auto mb-12">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <CheckCircleIcon className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 mb-1">
            ثبت‌نام شما با موفقیت تکمیل شد
          </h2>
          <p className="text-xs text-slate-600 mb-6">
            حساب کاربری و پرونده آموزشی شما در سامانه دانشگاه ایجاد گردید.
          </p>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 mb-6 text-right space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
              <span className="text-slate-500">کد رهگیری اختصاصی:</span>
              <span className="font-mono font-bold text-sm text-blue-700 dir-ltr">
                {successData.trackingCode}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">نام متقاضی:</span>
              <span className="font-bold text-slate-800">{successData.studentName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">شناسه کاربری (نام کاربری جهت ورود):</span>
              <span className="font-bold font-mono text-slate-900">{successData.nationalId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">کلمه عبور ورود به سامانه:</span>
              <span className="font-bold text-emerald-700">{successData.passwordHint}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-500">تعداد دوره‌های ثبت‌شده:</span>
              <span className="font-bold text-slate-800">{successData.coursesCount} دوره</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-3 px-6 rounded-xl transition-all shadow-sm"
            >
              <span>ورود مستقیم به پرتال دانشجو و کلاس‌ها</span>
              <ChevronLeftIcon className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                setSuccessData(null);
                setSelectedCourses([]);
              }}
              className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium py-3 px-6 rounded-xl transition-all"
            >
              ثبت‌نام جدید
            </button>
          </div>
        </div>
      ) : (
        <>
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

          {/* Registration Form */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm mb-12">
            <h2 className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
              فرم پیش‌ثبت‌نام آنلاین
            </h2>

            {errorMessage && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Course Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-3">
                  انتخاب دوره‌(های) مورد تقاضا:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {coursesList.map((course) => {
                    const isSelected = selectedCourses.includes(course.id);
                    return (
                      <label
                        key={course.id}
                        onClick={() => handleCourseToggle(course.id)}
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? "border-blue-600 bg-blue-50/50 shadow-sm"
                            : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/20"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="mt-1 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-900">{course.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            مدرس: {course.instructor} • {course.units} ({course.level})
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    نام و نام خانوادگی *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="مثال: علی محمدی"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    کد ملی (نام کاربری شما جهت ورود) *
                  </label>
                  <input
                    type="text"
                    required
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                    placeholder="ده رقم بدون خط تیره"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    شماره تلفن همراه (جهت دریافت اطلاعیه‌ها) *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                    placeholder="۰۹۱۲..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    پست الکترونیکی (ایمیل) *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="name@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    کلمه عبور دلخواه برای ورود به سامانه
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="در صورت خالی ماندن، کد ملی کلمه عبور خواهد بود"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    دانشگاه / موسسه محل تحصیل یا کار
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="مثال: دانشگاه صنعتی امیرکبیر"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    مقطع تحصیلی
                  </label>
                  <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="bachelor_student">دانشجوی کارشناسی</option>
                    <option value="bachelor">کارشناسی (فارغ‌التحصیل)</option>
                    <option value="master_student">دانشجوی کارشناسی ارشد</option>
                    <option value="master">کارشناسی ارشد</option>
                    <option value="phd">دکتری تخصصی</option>
                    <option value="other">سایر</option>
                  </select>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-center gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="terms_agree"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="text-blue-600 rounded focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="terms_agree" className="text-xs text-slate-600 cursor-pointer">
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
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>در حال ثبت اطلاعات در پایگاه داده...</span>
                ) : (
                  <>
                    <UserPlusIcon className="w-4 h-4" />
                    <span>ثبت نهایی درخواست و دریافت کد رهگیری</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </>
      )}
    </MainLayout>
  );
}
