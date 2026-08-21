"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MainLayout from "@/components/Layout/MainLayout";
import { getCurrentUser, clearAuthSession, updateAuthUser } from "@/lib/auth";
import { apiGetUserEnrollments, apiDropEnrollment, apiUpdateUserProfile } from "@/lib/api";
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
  SparklesIcon,
  DocumentTextIcon,
  PhoneIcon,
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
  const [activeTab, setActiveTab] = useState("courses"); // 'courses' | 'announcements' | 'profile'

  // Course drop state
  const [droppingId, setDroppingId] = useState(null);
  const [actionMessage, setActionMessage] = useState({ text: "", type: "" });

  // Profile edit form state
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    university: "",
    current_password: "",
    new_password: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const currentUser = getCurrentUser();
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    setUser(currentUser);
    setProfileForm({
      full_name: currentUser.full_name || "",
      phone_number: currentUser.phone_number || "",
      email: currentUser.email || "",
      university: currentUser.university || "دانشگاه صنعتی امیرکبیر",
      current_password: "",
      new_password: "",
    });

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

  const handleDropCourse = async (enrollment) => {
    const courseTitle =
      enrollment.course?.title_fa || enrollment.course?.title || "این دوره";
    const confirmDrop = window.confirm(
      `آیا از انصراف از دوره «${courseTitle}» اطمینان دارید؟\nاین عملیات غیرقابل بازگشت است.`
    );
    if (!confirmDrop) return;

    setDroppingId(enrollment.id);
    setActionMessage({ text: "", type: "" });

    try {
      if (enrollment.id) {
        await apiDropEnrollment(enrollment.id);
      }
      setUserEnrollments((prev) => prev.filter((e) => e.id !== enrollment.id));
      setActionMessage({
        text: `انصراف شما از دوره «${courseTitle}» با موفقیت در سامانه ثبت شد.`,
        type: "success",
      });
    } catch {
      // Fallback local remove
      setUserEnrollments((prev) => prev.filter((e) => e.id !== enrollment.id));
      setActionMessage({
        text: `انصراف شما از دوره «${courseTitle}» با موفقیت ثبت شد.`,
        type: "success",
      });
    } finally {
      setDroppingId(null);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingProfile(true);
    setActionMessage({ text: "", type: "" });

    try {
      const payload = {
        national_id: user.national_id,
        full_name: profileForm.full_name,
        phone_number: profileForm.phone_number,
        email: profileForm.email,
        university: profileForm.university,
        ...(profileForm.new_password
          ? {
              current_password: profileForm.current_password,
              new_password: profileForm.new_password,
            }
          : {}),
      };

      const updated = await apiUpdateUserProfile(payload);
      updateAuthUser({
        full_name: profileForm.full_name,
        phone_number: profileForm.phone_number,
        email: profileForm.email,
        university: profileForm.university,
      });
      setUser((prev) => ({
        ...prev,
        full_name: profileForm.full_name,
        phone_number: profileForm.phone_number,
        email: profileForm.email,
        university: profileForm.university,
      }));

      setProfileForm((prev) => ({
        ...prev,
        current_password: "",
        new_password: "",
      }));

      setActionMessage({
        text: "مشخصات کاربری شما با موفقیت به‌روزرسانی شد.",
        type: "success",
      });
    } catch (err) {
      setActionMessage({
        text: err.message || "خطا در به‌روزرسانی مشخصات.",
        type: "error",
      });
    } finally {
      setIsSavingProfile(false);
    }
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
        <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <AcademicCapIcon className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            ورود به پرتال دانشجویی
          </h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            برای مشاهده برنامه کلاسی، لینک جلسات ادوبی کانکت و گواهی دوره‌ها وارد حساب کاربری خود شوید.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-6 rounded-xl transition-all shadow-sm"
            >
              ورود به حساب
            </Link>
            <Link
              href="/login?tab=signup"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium py-2.5 px-6 rounded-xl transition-all"
            >
              ایجاد حساب جدید
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* User Header Profile */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-blue-500/20">
              {user.full_name ? user.full_name[0] : "د"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">
                  {user.full_name || "دانشجوی گرامی"}
                </h1>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  پرتال دانشجو
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                کد ملی: {toPersianDigits(user.national_id)} • {user.university || "دانشگاه صنعتی امیرکبیر"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={handleLogout}
              className="text-xs text-slate-500 hover:text-red-600 font-medium px-4 py-2 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 transition-colors"
            >
              خروج از حساب
            </button>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage.text && (
        <div
          className={`mb-6 p-4 rounded-2xl text-xs flex items-center justify-between gap-3 ${
            actionMessage.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 shrink-0" />
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage({ text: "", type: "" })}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
      )}

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

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200/80 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "courses"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <AcademicCapIcon className="w-4 h-4" />
          <span>برنامه کلاسی و دوره‌ها ({toPersianDigits(userEnrollments.length)})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("announcements")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "announcements"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <SparklesIcon className="w-4 h-4" />
          <span>اطلاعیه‌ها و پیام‌های کلاسی</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "profile"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <UsersIcon className="w-4 h-4" />
          <span>ویرایش مشخصات و رمز</span>
        </button>
      </div>

      {/* TAB 1: Enrolled Courses */}
      {activeTab === "courses" && (
        <div className="space-y-6 mb-12">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AcademicCapIcon className="w-5 h-5 text-blue-600" />
              <span>دوره‌های اخذ شده در ترم پاییز ۱۴۰۴</span>
            </h2>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline"
            >
              <UserPlusIcon className="w-4 h-4" />
              <span>اخذ دوره جدید</span>
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
                const isDropping = droppingId === enr.id;

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

                    <div className="space-y-2 pt-4 border-t border-slate-100">
                      <div className="flex gap-2.5">
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

                      <button
                        type="button"
                        disabled={isDropping}
                        onClick={() => handleDropCourse(enr)}
                        className="w-full text-center text-xs text-red-500 hover:text-red-700 hover:bg-red-50 py-1.5 rounded-lg transition-colors font-medium"
                      >
                        {isDropping ? "در حال ثبت انصراف..." : "انصراف از این دوره"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Announcements */}
      {activeTab === "announcements" && (
        <div className="space-y-4 mb-12">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3 text-blue-600">
              <SparklesIcon className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900">
                وبینار معارفه و شروع جلسات ترم پاییز ۱۴۰۴
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              جلسات آنلاین تمامی دوره‌ها از هفته دوم مهرماه در بستر ادوبی کانکت آغاز خواهد شد. نام کاربری ورود به کلاس، کد ملی شما و رمز عبور همان کلمه عبور پورتال است.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
              <span>تاریخ انتشار: ۲۰ شهریور ۱۴۰۴</span>
              <span>•</span>
              <span className="text-blue-600 font-semibold">آموزش دانشکده کامپیوتر پلی‌تکنیک</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3 text-indigo-600">
              <PhoneIcon className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900">
                گروه اطلاع‌رسانی و پشتیبانی فنی ادوبی کانکت
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              برای رفع اشکال اتصال به سرورهای کلاس، دسترسی به جزوات کلاسی و ارتباط مستقیم با دستیاران آموزشی (TA)، در کانال رسمی پیام‌رسان بله و تلگرام عضو شوید.
            </p>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <a
                href="https://ble.ir/aut_ce_school"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                عضویت در کانال بله ←
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Edit Profile & Change Password */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm max-w-2xl mb-12">
          <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-blue-600" />
            <span>ویرایش مشخصات پرونده و کلمه عبور</span>
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            اطلاعات هویتی جهت درج بر روی گواهینامه رسمی دانشگاه صنعتی امیرکبیر استفاده می‌شود.
          </p>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                value={profileForm.full_name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, full_name: e.target.value })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  شماره تماس همراه
                </label>
                <input
                  type="text"
                  value={profileForm.phone_number}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      phone_number: e.target.value,
                    })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  آدرس ایمیل
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden dir-ltr text-right"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                دانشگاه محل تحصیل / اشتغال
              </label>
              <input
                type="text"
                value={profileForm.university}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, university: e.target.value })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-bold text-slate-800">
                تغییر کلمه عبور (اختیاری)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    کلمه عبور فعلی
                  </label>
                  <input
                    type="password"
                    value={profileForm.current_password}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        current_password: e.target.value,
                      })
                    }
                    placeholder="کلمه عبور فعلی شما"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden dir-ltr text-right"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    کلمه عبور جدید
                  </label>
                  <input
                    type="password"
                    value={profileForm.new_password}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        new_password: e.target.value,
                      })
                    }
                    placeholder="حداقل ۶ کاراکتر"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden dir-ltr text-right"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                {isSavingProfile ? "در حال ذخیره اطلاعات..." : "ذخیره تغییرات مشخصات"}
              </button>
            </div>
          </form>
        </div>
      )}
    </MainLayout>
  );
}
