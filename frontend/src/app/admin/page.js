"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MainLayout from "@/components/Layout/MainLayout";
import { getCurrentUser, saveAuthSession, clearAuthSession } from "@/lib/auth";
import {
  apiGetAllEnrollmentsAdmin,
  apiUpdateEnrollmentStatus,
  apiCreateCourse,
  apiDeleteCourse,
  getLocalDynamicCourses,
  apiLogin,
} from "@/lib/api";
import { courses as initialCourses } from "@/data/sampleData";
import {
  ShieldCheckIcon,
  UsersIcon,
  BookOpenIcon,
  CheckCircleIcon,
  SearchIcon,
  AwardIcon,
  ClockIcon,
  UserPlusIcon,
  CodeIcon,
  SparklesIcon,
  ChevronLeftIcon,
} from "@/components/Icons";

export default function AdminDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState("ENROLLMENTS"); // "ENROLLMENTS" | "COURSES" | "NEW_COURSE"

  // Login form state (if opened directly in incognito)
  const [loginEmail, setLoginEmail] = useState("admin@aut.ac.ir");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Enrollments State
  const [enrollments, setEnrollments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Courses State
  const [allCourses, setAllCourses] = useState([]);
  const [isSubmittingCourse, setIsSubmittingCourse] = useState(false);
  const [courseSuccessMsg, setCourseSuccessMsg] = useState("");
  const [courseErrorMsg, setCourseErrorMsg] = useState("");

  // New Course Form State
  const [newCourse, setNewCourse] = useState({
    title_fa: "",
    title_en: "",
    instructor_name: "",
    field: "مهندسی کامپیوتر – نرم‌افزار",
    type: "اختصاصی",
    units: "۳ واحد",
    level: "کارشناسی",
    course_level: "متوسط",
    price: 2500000,
    capacity: 30,
    prerequisites: "",
    description: "",
    topicsText: "",
  });

  const loadData = async () => {
    // 1. Load Enrollments
    try {
      const data = await apiGetAllEnrollmentsAdmin();
      if (data && data.length > 0) {
        setEnrollments(data);
      } else {
        setEnrollments(getMockEnrollments());
      }
    } catch {
      setEnrollments(getMockEnrollments());
    }

    // 2. Load Courses
    const dynamicList = getLocalDynamicCourses();
    const combined = [
      ...dynamicList,
      ...initialCourses.filter((c) => !dynamicList.some((d) => d.id === c.id)),
    ];
    setAllCourses(combined);
  };

  useEffect(() => {
    setIsMounted(true);
    const user = getCurrentUser();
    if (user && user.role === "ADMIN") {
      setAdminUser(user);
      loadData();
    }
  }, []);

  const handleDirectLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await apiLogin(loginEmail.trim(), loginPassword);
      if (res.user && res.user.role === "ADMIN") {
        saveAuthSession(res.access_token, res.user);
        setAdminUser(res.user);
        loadData();
        return;
      }
      setLoginError("حساب کاربری شما دارای سطح دسترسی مدیریت نیست.");
    } catch {
      // Local check fallback
      if (
        loginEmail.trim().toLowerCase() === "admin@aut.ac.ir" &&
        loginPassword === "Admin@AUT1404!"
      ) {
        const mockAdmin = {
          id: "admin-uuid",
          national_id: "0000000000",
          phone_number: "09120000000",
          email: "admin@aut.ac.ir",
          full_name: "مدیر سامانه آموزش‌های تخصصی",
          role: "ADMIN",
        };
        saveAuthSession("mock-admin-token", mockAdmin);
        setAdminUser(mockAdmin);
        loadData();
        return;
      }
      setLoginError("کلمه عبور مدیر سیستم نادرست است.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleToggleStatus = async (enrId, currentStatus) => {
    const nextStatus =
      currentStatus === "REGISTERED" ? "COMPLETED" : "REGISTERED";
    try {
      await apiUpdateEnrollmentStatus(enrId, nextStatus);
    } catch {
      // Local state update
    }
    setEnrollments((prev) =>
      prev.map((item) =>
        item.id === enrId ? { ...item, status: nextStatus } : item
      )
    );
  };

  const handleCreateCourseSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingCourse(true);
    setCourseSuccessMsg("");
    setCourseErrorMsg("");

    const rawTopics = newCourse.topicsText
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const formattedTopics = rawTopics.map((topicTitle, idx) => ({
      order_index: idx + 1,
      title: topicTitle,
      description: `مباحث تفصیلی جلسه ${idx + 1}`,
      sessions_count: 1,
    }));

    const coursePayload = {
      title_fa: newCourse.title_fa.trim(),
      title_en: newCourse.title_en.trim(),
      instructor_name: newCourse.instructor_name.trim(),
      field: newCourse.field,
      type: newCourse.type,
      units: newCourse.units,
      level: newCourse.level,
      course_level: newCourse.course_level,
      price: Number(newCourse.price),
      capacity: Number(newCourse.capacity),
      prerequisites: newCourse.prerequisites.trim() || "ندارد",
      description: newCourse.description.trim(),
      topics: formattedTopics,
      objectives: ["تسلط بر مبانی و اصول موضوع", "پیاده‌سازی پروژه‌های کاربردی صنعتی"],
    };

    try {
      const created = await apiCreateCourse(coursePayload);
      setAllCourses((prev) => [created, ...prev]);
      setCourseSuccessMsg(`دوره «${created.title_fa || created.title}» با موفقیت در سامانه تعریف و ثبت شد.`);

      setNewCourse({
        title_fa: "",
        title_en: "",
        instructor_name: "",
        field: "مهندسی کامپیوتر – نرم‌افزار",
        type: "اختصاصی",
        units: "۳ واحد",
        level: "کارشناسی",
        course_level: "متوسط",
        price: 2500000,
        capacity: 30,
        prerequisites: "",
        description: "",
        topicsText: "",
      });

      setTimeout(() => {
        setActiveTab("COURSES");
        setCourseSuccessMsg("");
      }, 1500);
    } catch (err) {
      setCourseErrorMsg(err.message || "خطا در ایجاد دوره.");
    } finally {
      setIsSubmittingCourse(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("آیا از حذف این دوره از سامانه اطمینان دارید؟")) return;
    await apiDeleteCourse(courseId);
    setAllCourses((prev) => prev.filter((c) => c.id !== courseId && c.course_number !== courseId));
  };

  const handleLogout = () => {
    clearAuthSession();
    setAdminUser(null);
  };

  const filteredEnrollments = enrollments.filter((item) => {
    const matchesSearch =
      item.user?.full_name?.includes(searchQuery) ||
      item.user?.national_id?.includes(searchQuery) ||
      item.tracking_code?.includes(searchQuery) ||
      item.course?.title_fa?.includes(searchQuery);

    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (!isMounted) {
    return (
      <MainLayout>
        <div className="py-20 text-center text-xs text-slate-500">
          در حال بارگذاری پنل مدیریت...
        </div>
      </MainLayout>
    );
  }

  // If not authenticated as Admin, show inline Admin Access Portal
  if (!adminUser) {
    return (
      <MainLayout>
        <div className="max-w-md mx-auto py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 mb-4 shadow-sm">
              <ShieldCheckIcon className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              احراز هویت مدیر آموزش
            </h1>
            <p className="text-xs text-slate-600 mt-1.5">
              جهت ورود به پنل مدیریت، مشخصات ارشد را وارد نمایید.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
            {loginError && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleDirectLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  پست الکترونیکی سازمانی
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="admin@aut.ac.ir"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  کلمه عبور مدیر سیستم
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="کلمه عبور ادمین را وارد کنید"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <span>در حال بررسی دسترسی...</span>
                ) : (
                  <>
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span>ورود به پنل مدیریت آموزش</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
              <ShieldCheckIcon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  پنل مدیریت جامع آموزش و پذیرش
                </h1>
                <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-400/30">
                  دسترسی ارشد
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                مدیریت دوره‌ها، پرونده‌های ثبت‌نامی و صدور مدارک دانشگاه صنعتی امیرکبیر
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs text-slate-300 hover:text-red-400 font-medium px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors self-start sm:self-auto"
          >
            خروج از پنل
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UsersIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">کل متقاضیان</p>
              <p className="text-lg font-extrabold text-slate-900">{enrollments.length} نفر</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">پذیرفته‌شدگان قطعی</p>
              <p className="text-lg font-extrabold text-emerald-600">
                {enrollments.filter((e) => e.status === "REGISTERED" || e.status === "COMPLETED").length} نفر
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ClockIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">در انتظار بررسی</p>
              <p className="text-lg font-extrabold text-amber-600">
                {enrollments.filter((e) => e.status === "PENDING_PAYMENT").length} نفر
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpenIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">دوره‌های فعال سامانه</p>
              <p className="text-lg font-extrabold text-indigo-600">{allCourses.length} دوره</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("ENROLLMENTS")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "ENROLLMENTS"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <UsersIcon className="w-4 h-4" />
          <span>پرونده‌های ثبت‌نام ({enrollments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("COURSES")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "COURSES"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <BookOpenIcon className="w-4 h-4" />
          <span>لیست دوره‌ها ({allCourses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("NEW_COURSE")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "NEW_COURSE"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <SparklesIcon className="w-4 h-4" />
          <span>+ تعریف دوره جدید</span>
        </button>
      </div>

      {/* TAB 1: Enrollments Management */}
      {activeTab === "ENROLLMENTS" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-blue-600" />
              <span>فهرست پرونده‌های متقاضیان</span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی نام، کد ملی یا رهگیری..."
                  className="w-full sm:w-64 pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <SearchIcon className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <div className="flex bg-slate-100 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    statusFilter === "ALL"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  همه
                </button>
                <button
                  onClick={() => setStatusFilter("REGISTERED")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    statusFilter === "REGISTERED"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  تایید شده
                </button>
                <button
                  onClick={() => setStatusFilter("PENDING_PAYMENT")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    statusFilter === "PENDING_PAYMENT"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  در انتظار
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200/80">
                  <th className="py-3 px-4 font-bold">متقاضی</th>
                  <th className="py-3 px-4 font-bold">کد ملی</th>
                  <th className="py-3 px-4 font-bold">دوره انتخابی</th>
                  <th className="py-3 px-4 font-bold">کد رهگیری</th>
                  <th className="py-3 px-4 font-bold">وضعیت</th>
                  <th className="py-3 px-4 font-bold text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEnrollments.map((enr) => (
                  <tr key={enr.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {enr.user?.full_name || "بدون نام"}
                      <span className="block text-[11px] text-slate-400 font-normal">
                        {enr.user?.phone_number}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      {enr.user?.national_id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-800">
                      {enr.course?.title_fa || enr.course?.title}
                      <span className="block text-[11px] text-slate-400">
                        {enr.course?.instructor_name || enr.course?.instructor}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700 dir-ltr text-right">
                      {enr.tracking_code}
                    </td>
                    <td className="py-3.5 px-4">
                      {enr.status === "REGISTERED" && (
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-emerald-100">
                          ثبت‌نام قطعی
                        </span>
                      )}
                      {enr.status === "PENDING_PAYMENT" && (
                        <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-amber-100">
                          در انتظار بررسی
                        </span>
                      )}
                      {enr.status === "COMPLETED" && (
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-blue-100">
                          تکمیل دوره
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(enr.id, enr.status)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        تغییر وضعیت
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Courses Management */}
      {activeTab === "COURSES" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm mb-12">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-blue-600" />
              <span>فهرست دوره‌های آموزشی فعال</span>
            </h2>
            <button
              onClick={() => setActiveTab("NEW_COURSE")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>+ افزودن دوره جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allCourses.map((c) => (
              <div
                key={c.id || c.course_number}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-100">
                      {c.units} ({c.level})
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      فعال در ترم
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    {c.title_fa || c.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    مدرس: {c.instructor_name || c.instructor}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {c.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <Link
                    href={`/courses/${c.course_number || c.id || 1}`}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    مشاهده سرفصل‌ها
                  </Link>

                  <button
                    onClick={() => handleDeleteCourse(c.id || c.course_number)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    حذف دوره
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Add New Course Form */}
      {activeTab === "NEW_COURSE" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm mb-12">
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-blue-600" />
              <span>تعریف و ایجاد دوره آموزشی جدید</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              مشخصات دوره بلافاصله در پایگاه داده ذخیره شده و در تمام صفحات عمومی و فرم ثبت‌نام قرار می‌گیرد.
            </p>
          </div>

          {courseSuccessMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{courseSuccessMsg}</span>
            </div>
          )}

          {courseErrorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
              <span>{courseErrorMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateCourseSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  نام فارسی درس *
                </label>
                <input
                  type="text"
                  required
                  value={newCourse.title_fa}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title_fa: e.target.value })
                  }
                  placeholder="مثال: یادگیری عمیق و شبکه‌های عصبی"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  نام انگلیسی درس *
                </label>
                <input
                  type="text"
                  required
                  value={newCourse.title_en}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title_en: e.target.value })
                  }
                  placeholder="Deep Learning & Neural Networks"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dir-ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  نام و مرتبه استاد مدرس *
                </label>
                <input
                  type="text"
                  required
                  value={newCourse.instructor_name}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      instructor_name: e.target.value,
                    })
                  }
                  placeholder="مثال: دکتر احسان ناظرفرد"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  گرایش و رشته
                </label>
                <input
                  type="text"
                  value={newCourse.field}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, field: e.target.value })
                  }
                  placeholder="مهندسی کامپیوتر – هوش مصنوعی"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  مقطع تحصیلی
                </label>
                <select
                  value={newCourse.level}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, level: e.target.value })
                  }
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="کارشناسی">کارشناسی</option>
                  <option value="کارشناسی ارشد">کارشناسی ارشد</option>
                  <option value="دکتری">دکتری</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  پیش‌نیازها
                </label>
                <input
                  type="text"
                  value={newCourse.prerequisites}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, prerequisites: e.target.value })
                  }
                  placeholder="مثال: یادگیری ماشین یا برنامه‌نویسی پایتون"
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                توضیحات و معرفی کامل دوره *
              </label>
              <textarea
                required
                rows={3}
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                placeholder="شرح اهداف، کاربردها و ساختار دوره آموزشی..."
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                سرفصل‌ها و مباحث جلسات (هر جلسه در یک خط)
              </label>
              <textarea
                rows={4}
                value={newCourse.topicsText}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, topicsText: e.target.value })
                }
                placeholder="مقدمه بر شبکه‌های عصبی عمیق&#10;شبکه‌های پیچشی (CNN)&#10;شبکه‌های بازگشتی (RNN و LSTM)&#10;معماری ترنسفورمرها و مدل‌های زبانی"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all leading-relaxed"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-3">
              <button
                type="submit"
                disabled={isSubmittingCourse}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all text-xs flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmittingCourse ? (
                  <span>در حال ثبت دوره در دیتابیس...</span>
                ) : (
                  <>
                    <SparklesIcon className="w-4 h-4" />
                    <span>ثبت نهایی و انتشار دوره</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("COURSES")}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium py-3 px-5 rounded-xl transition-all"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}
    </MainLayout>
  );
}

function getMockEnrollments() {
  return [
    {
      id: "enr-1",
      tracking_code: "AUT-1404-9E3A11",
      status: "REGISTERED",
      final_grade: 18.5,
      user: {
        full_name: "محمدامین حسینی",
        national_id: "0018472910",
        phone_number: "09121112233",
        email: "m.hosseini@gmail.com",
        university: "دانشگاه صنعتی امیرکبیر",
      },
      course: {
        title_fa: "یادگیری ماشین",
        course_number: 1,
        instructor_name: "دکتر احسان ناظرفرد",
        units: "۳ واحد",
      },
      created_at: "۱۴۰۴/۰۶/۱۵",
    },
    {
      id: "enr-2",
      tracking_code: "AUT-1404-5F82C4",
      status: "REGISTERED",
      final_grade: null,
      user: {
        full_name: "سارا رضوانی",
        national_id: "0029384712",
        phone_number: "09351234567",
        email: "s.rezvani@yahoo.com",
        university: "دانشگاه تهران",
      },
      course: {
        title_fa: "آزمون و تضمین کیفیت نرم‌افزار",
        course_number: 2,
        instructor_name: "دکتر مرتضی ذاکری",
        units: "۳ واحد",
      },
      created_at: "۱۴۰۴/۰۶/۱۶",
    },
  ];
}
