"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/components/Layout/MainLayout";
import { getCurrentUser, clearAuthSession } from "@/lib/auth";
import { apiGetAllEnrollmentsAdmin, apiUpdateEnrollmentStatus } from "@/lib/api";
import { courses } from "@/data/sampleData";
import {
  ShieldCheckIcon,
  UsersIcon,
  BookOpenIcon,
  CheckCircleIcon,
  SearchIcon,
  AwardIcon,
  ClockIcon,
} from "@/components/Icons";

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      router.push("/login");
      return;
    }
    setAdminUser(user);

    async function loadEnrollments() {
      try {
        const data = await apiGetAllEnrollmentsAdmin();
        if (data && data.length > 0) {
          setEnrollments(data);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.log("Using mock enrollments for admin panel:", err);
      }

      // Default mock enrollment records for admin demonstration
      setEnrollments([
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
        {
          id: "enr-3",
          tracking_code: "AUT-1404-A1B903",
          status: "PENDING_PAYMENT",
          final_grade: null,
          user: {
            full_name: "علی‌رضا کمالی",
            national_id: "0031122334",
            phone_number: "09198765432",
            email: "a.kamali@aut.ac.ir",
            university: "دانشگاه صنعتی امیرکبیر",
          },
          course: {
            title_fa: "برنامه نویسی شی گرا (جاوا)",
            course_number: 3,
            instructor_name: "دکتر معصومه طارمی راد",
            units: "۳ واحد",
          },
          created_at: "۱۴۰۴/۰۶/۱۷",
        },
        {
          id: "enr-4",
          tracking_code: "AUT-1404-C4D881",
          status: "COMPLETED",
          final_grade: 19.75,
          user: {
            full_name: "نیلوفر باقری",
            national_id: "0045566778",
            phone_number: "09124445566",
            email: "n.bagheri@aut.ac.ir",
            university: "دانشگاه صنعتی امیرکبیر",
          },
          course: {
            title_fa: "اصول رایانش ابری",
            course_number: 7,
            instructor_name: "دکتر سید احمد جوادی",
            units: "۳ واحد",
          },
          created_at: "۱۴۰۴/۰۶/۱۸",
        },
      ]);
      setIsLoading(false);
    }

    loadEnrollments();
  }, [router]);

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

  const handleLogout = () => {
    clearAuthSession();
    router.push("/login");
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

  if (!adminUser) return null;

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
                  پنل مدیریت آموزش و پذیرش
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
              <p className="text-xs text-slate-500">دوره‌های فعال ترم</p>
              <p className="text-lg font-extrabold text-indigo-600">۶ دوره</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollments Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-blue-600" />
            <span>فهرست پرونده‌های ثبت‌نامی</span>
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
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

            {/* Filter Tabs */}
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

        {/* Table */}
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
    </MainLayout>
  );
}
