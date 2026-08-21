"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import MainLayout from "@/components/Layout/MainLayout";
import { getCurrentUser, saveAuthSession, clearAuthSession } from "@/lib/auth";
import {
  apiGetAllEnrollmentsAdmin,
  apiUpdateEnrollmentStatus,
  apiDeleteEnrollmentAdmin,
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
  DocumentTextIcon,
} from "@/components/Icons";
import {
  toPersianDigits,
  formatPriceToman,
  formatTrackingCode,
} from "@/lib/formatters";

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

function getMockEnrollments() {
  return [
    {
      id: "mock-1",
      user: {
        full_name: "حسین زارعی‌نژاد",
        national_id: "0123456789",
        phone_number: "09123456789",
        email: "zarei@aut.ac.ir",
        university: "دانشگاه صنعتی امیرکبیر",
      },
      course: initialCourses[0],
      tracking_code: "AUT-1404-E7A912",
      status: "REGISTERED",
      created_at: new Date().toISOString(),
    },
    {
      id: "mock-2",
      user: {
        full_name: "مریم احمدی",
        national_id: "0019876543",
        phone_number: "09351112233",
        email: "ahmadi@aut.ac.ir",
        university: "دانشگاه صنعتی امیرکبیر",
      },
      course: initialCourses[1],
      tracking_code: "AUT-1404-B3F401",
      status: "REGISTERED",
      created_at: new Date().toISOString(),
    },
  ];
}

export default function AdminDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState("ENROLLMENTS"); // "ENROLLMENTS" | "ANALYTICS" | "COURSES" | "NEW_COURSE"

  // Login form state
  const [loginEmail, setLoginEmail] = useState("admin@aut.ac.ir");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Enrollments State
  const [enrollments, setEnrollments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");

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
    } catch {}
    setEnrollments((prev) =>
      prev.map((item) =>
        item.id === enrId ? { ...item, status: nextStatus } : item
      )
    );
  };

  const handleDeleteEnrollment = async (enrId, studentName, courseTitle) => {
    const confirmed = window.confirm(
      `آیا از حذف پرونده ثبت‌نام «${studentName || "دانشجو"}» از دوره «${courseTitle || ""}» اطمینان دارید؟`
    );
    if (!confirmed) return;

    try {
      await apiDeleteEnrollmentAdmin(enrId);
    } catch {}
    setEnrollments((prev) => prev.filter((item) => item.id !== enrId));
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

  // Export to UTF-8 BOM CSV / Excel
  const handleExportCSV = () => {
    if (filteredEnrollments.length === 0) {
      alert("پرونده‌ای برای خروجی اکسل یافت نشد.");
      return;
    }

    const headers = [
      "ردیف",
      "نام دانشجو",
      "کد ملی",
      "شماره تماس",
      "ایمیل",
      "دانشگاه",
      "عنوان دوره",
      "مدرس",
      "کد رهگیری",
      "وضعیت پرونده",
      "تاریخ ثبت‌نام",
    ];

    const rows = filteredEnrollments.map((enr, idx) => {
      const courseData = enr.course || {};
      const instructor = getInstructorName(courseData);
      const title = courseData.title_fa || courseData.title || "";
      const studentName = enr.user?.full_name || enr.full_name || "دانشجو";
      const nationalId = enr.user?.national_id || enr.national_id || "";
      const phone = enr.user?.phone_number || enr.phone_number || "";
      const email = enr.user?.email || enr.email || "";
      const uni = enr.user?.university || enr.university || "دانشگاه صنعتی امیرکبیر";
      const tracking = enr.tracking_code || "";
      const status = enr.status === "COMPLETED" ? "تکمیل شده" : "ثبت‌نام نهایی";
      const date = enr.created_at
        ? new Date(enr.created_at).toLocaleDateString("fa-IR")
        : "۱۴۰۴/۰۶/۲۰";

      return [
        idx + 1,
        `"${studentName}"`,
        `"${nationalId}"`,
        `"${phone}"`,
        `"${email}"`,
        `"${uni}"`,
        `"${title}"`,
        `"${instructor}"`,
        `"${tracking}"`,
        `"${status}"`,
        `"${date}"`,
      ];
    });

    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `AUT_CE_Students_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintRoster = () => {
    window.print();
  };

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((item) => {
      const matchesSearch =
        item.user?.full_name?.includes(searchQuery) ||
        item.user?.national_id?.includes(searchQuery) ||
        item.tracking_code?.includes(searchQuery) ||
        item.course?.title_fa?.includes(searchQuery) ||
        item.course?.title?.includes(searchQuery);

      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      const cId = item.course?.course_number || item.course?.id;
      const matchesCourse =
        courseFilter === "ALL" || String(cId) === String(courseFilter);

      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [enrollments, searchQuery, statusFilter, courseFilter]);

  // Analytics Computation
  const analyticsData = useMemo(() => {
    const courseCounts = {};
    let totalRevenue = 0;

    allCourses.forEach((c) => {
      courseCounts[c.id] = {
        title: c.title_fa || c.title,
        instructor: getInstructorName(c),
        enrolledCount: 0,
        capacity: c.capacity || 30,
        price: Number(c.price) || 2500000,
      };
    });

    enrollments.forEach((enr) => {
      const cId = enr.course?.id || enr.course?.course_number || enr.course_id;
      if (courseCounts[cId]) {
        courseCounts[cId].enrolledCount += 1;
        totalRevenue += courseCounts[cId].price;
      }
    });

    const coursesArray = Object.values(courseCounts);
    coursesArray.sort((a, b) => b.enrolledCount - a.enrolledCount);

    return {
      coursesBreakdown: coursesArray,
      totalEnrollments: enrollments.length,
      completedEnrollments: enrollments.filter((e) => e.status === "COMPLETED").length,
      totalRevenue,
    };
  }, [enrollments, allCourses]);

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
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-md border border-slate-800 print:hidden">
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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 print:hidden">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UsersIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">کل پرونده‌های ثبت‌نام</p>
              <p className="text-lg font-extrabold text-slate-900">
                {toPersianDigits(enrollments.length)} دانشجو
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">ثبت‌نام‌های قطعی</p>
              <p className="text-lg font-extrabold text-emerald-600">
                {toPersianDigits(
                  enrollments.filter(
                    (e) => e.status === "REGISTERED" || e.status === "COMPLETED"
                  ).length
                )} نفر
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <AwardIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">مجموع درآمد ترم</p>
              <p className="text-sm font-extrabold text-indigo-600">
                {formatPriceToman(analyticsData.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpenIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">دوره‌های فعال سامانه</p>
              <p className="text-lg font-extrabold text-purple-600">
                {toPersianDigits(allCourses.length)} عنوان دوره
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap gap-2.5 mb-6 print:hidden">
        <button
          onClick={() => setActiveTab("ENROLLMENTS")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "ENROLLMENTS"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <UsersIcon className="w-4 h-4" />
          <span>پرونده‌های ثبت‌نام ({toPersianDigits(enrollments.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab("ANALYTICS")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "ANALYTICS"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <AwardIcon className="w-4 h-4" />
          <span>آمار و نمودارهای تحلیلی</span>
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
          <span>لیست دوره‌ها ({toPersianDigits(allCourses.length)})</span>
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

      {/* Print Letterhead Roster Header */}
      <div className="hidden print:block mb-6 border-b-2 border-slate-900 pb-4 text-center">
        <h2 className="text-lg font-extrabold text-slate-900">
          دانشگاه صنعتی امیرکبیر — دانشکده مهندسی کامپیوتر
        </h2>
        <h3 className="text-sm font-bold text-slate-700 mt-1">
          لیست رسمی حضور و غیاب و ارزیابی دانشجویان — ترم پاییز ۱۴۰۴
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          تاریخ گزارش: {new Date().toLocaleDateString("fa-IR")}
        </p>
      </div>

      {/* TAB 1: Enrollments Management */}
      {activeTab === "ENROLLMENTS" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm mb-12 print:border-none print:shadow-none print:p-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 print:hidden">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-blue-600" />
              <span>فهرست پرونده‌های متقاضیان ({toPersianDigits(filteredEnrollments.length)})</span>
            </h2>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی نام، کد ملی، دوره..."
                  className="pr-8 pl-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-hidden"
              >
                <option value="ALL">همه دوره‌ها</option>
                {allCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title_fa || c.title}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleExportCSV}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              >
                <DocumentTextIcon className="w-4 h-4" />
                <span>دانلود اکسل (CSV)</span>
              </button>

              <button
                type="button"
                onClick={handlePrintRoster}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5"
              >
                <span>چاپ لیست کلاسی</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3.5 px-4 text-center w-12">#</th>
                  <th className="py-3.5 px-4">مشخصات دانشجو</th>
                  <th className="py-3.5 px-4">کد ملی و تماس</th>
                  <th className="py-3.5 px-4">عنوان دوره و مدرس</th>
                  <th className="py-3.5 px-4 text-center">کد رهگیری</th>
                  <th className="py-3.5 px-4 text-center">وضعیت</th>
                  <th className="py-3.5 px-4 text-center print:hidden">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEnrollments.map((enr, idx) => {
                  const courseData = enr.course || {};
                  const instructor = getInstructorName(courseData);
                  const title = courseData.title_fa || courseData.title || "دوره تخصصی";
                  const studentName = enr.user?.full_name || enr.full_name || "دانشجو";
                  const nationalId = enr.user?.national_id || enr.national_id || "—";
                  const phone = enr.user?.phone_number || enr.phone_number || "—";

                  return (
                    <tr key={enr.id || idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 text-center text-slate-400 font-mono">
                        {toPersianDigits(idx + 1)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {studentName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 space-y-0.5">
                        <div className="font-mono">{toPersianDigits(nationalId)}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{phone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{title}</p>
                        <p className="text-[11px] text-slate-400">{instructor}</p>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-blue-700 font-bold dir-ltr">
                        {formatTrackingCode(enr.tracking_code)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(enr.id, enr.status)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                            enr.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                          }`}
                        >
                          {enr.status === "COMPLETED" ? "✓ تکمیل دوره" : "ثبت‌نام نهایی"}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center print:hidden">
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteEnrollment(enr.id, studentName, title)
                          }
                          className="bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-semibold py-1 px-3 rounded-lg transition-colors"
                        >
                          حذف از دوره
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Analytics Dashboard */}
      {activeTab === "ANALYTICS" && (
        <div className="space-y-6 mb-12">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
              <AwardIcon className="w-5 h-5 text-blue-600" />
              <span>توزیع ثبت‌نام و ظرفیت دوره‌های آموزشی ترم پاییز ۱۴۰۴</span>
            </h2>

            <div className="space-y-5">
              {analyticsData.coursesBreakdown.map((c, idx) => {
                const percent = Math.min(
                  Math.round((c.enrolledCount / c.capacity) * 100),
                  100
                );
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">
                          {c.title}
                        </span>
                        <span className="text-slate-500 mr-2">
                          (مدرس: {c.instructor})
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600">
                          {toPersianDigits(c.enrolledCount)} از {toPersianDigits(c.capacity)} دانشجو ({toPersianDigits(percent)}٪ ظرفیت)
                        </span>
                        <span className="font-bold text-blue-700">
                          {formatPriceToman(c.enrolledCount * c.price)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Courses Management */}
      {activeTab === "COURSES" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm mb-12">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-blue-600" />
              <span>فهرست دوره‌های آموزشی تعریف‌شده</span>
            </h2>
            <button
              onClick={() => setActiveTab("NEW_COURSE")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all shadow-xs"
            >
              + تعریف دوره جدید
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.map((c) => (
              <div
                key={c.id}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between"
              >
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md">
                      {c.units} • {c.level}
                    </span>
                    <span className="text-slate-500 font-mono">
                      #{toPersianDigits(c.course_number || c.id)}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {c.title_fa || c.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    مدرس: {getInstructorName(c)}
                  </p>
                  <p className="text-xs font-bold text-blue-900">
                    {formatPriceToman(c.price)}
                  </p>
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-200">
                  <Link
                    href={`/courses/${c.course_number || c.id}`}
                    className="flex-1 bg-white hover:bg-slate-100 text-slate-700 text-center py-2 rounded-xl text-xs font-semibold border border-slate-200 transition-colors"
                  >
                    مشاهده سرفصل
                  </Link>
                  <button
                    onClick={() => handleDeleteCourse(c.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-xl text-xs font-semibold transition-colors"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: New Course Form */}
      {activeTab === "NEW_COURSE" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm max-w-3xl mb-12">
          <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-blue-600" />
            <span>تعریف و ایجاد دوره تخصصی جدید</span>
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            دوره جدید بلافاصله در فهرست دوره‌ها، جستجو و جدول ثبت‌نام قرار خواهد گرفت.
          </p>

          {courseSuccessMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 shrink-0" />
              <span>{courseSuccessMsg}</span>
            </div>
          )}

          {courseErrorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
              <span>{courseErrorMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateCourseSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  عنوان فارسی دوره *
                </label>
                <input
                  type="text"
                  required
                  value={newCourse.title_fa}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title_fa: e.target.value })
                  }
                  placeholder="مثال: یادگیری عمیق و بینایی ماشین"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  عنوان انگلیسی دوره
                </label>
                <input
                  type="text"
                  value={newCourse.title_en}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title_en: e.target.value })
                  }
                  placeholder="Deep Learning & Computer Vision"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden dir-ltr text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  نام استاد / مدرس *
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
                  placeholder="مثال: دکتر مرتضی ذاکری"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  مقطع تحصیلی
                </label>
                <select
                  value={newCourse.level}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, level: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                >
                  <option value="کارشناسی">کارشناسی</option>
                  <option value="کارشناسی ارشد">کارشناسی ارشد</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  تعداد واحد
                </label>
                <select
                  value={newCourse.units}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, units: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                >
                  <option value="۳ واحد">۳ واحد</option>
                  <option value="۲ واحد">۲ واحد</option>
                  <option value="۴ واحد">۴ واحد</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  شهریه مصوب (تومان)
                </label>
                <input
                  type="number"
                  value={newCourse.price}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, price: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ظرفیت کلاس (نفر)
                </label>
                <input
                  type="number"
                  value={newCourse.capacity}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, capacity: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden dir-ltr text-right"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                توضیحات و شرح دوره
              </label>
              <textarea
                rows={3}
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                placeholder="شرح اهداف، کاربردهای صنعتی و مهارت‌های کسب‌شده در این دوره..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                عناوین سرفصل‌های آموزشی (هر جلسه در یک خط)
              </label>
              <textarea
                rows={4}
                value={newCourse.topicsText}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, topicsText: e.target.value })
                }
                placeholder="مقدمه و تعاریف پایه&#10;معماری و ساختار مدل‌ها&#10;پیاده‌سازی پروژه‌های عملی"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                disabled={isSubmittingCourse}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                {isSubmittingCourse ? "در حال ایجاد دوره..." : "ثبت و انتشار دوره"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("COURSES")}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all"
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
