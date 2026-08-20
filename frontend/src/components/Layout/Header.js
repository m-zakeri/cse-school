"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCurrentUser, clearAuthSession } from "@/lib/auth";
import {
  ChevronLeftIcon,
  AcademicCapIcon,
  UserPlusIcon,
  ShieldCheckIcon,
} from "../Icons";

const Header = () => {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, [pathname]);

  const handleLogout = () => {
    clearAuthSession();
    setCurrentUser(null);
    window.location.href = "/courses";
  };

  const getBreadcrumb = () => {
    const routes = {
      "/": "خانه",
      "/courses": "دوره‌های آموزشی",
      "/courses/1": "یادگیری ماشین",
      "/courses/2": "آزمون و کیفیت نرم‌افزار",
      "/courses/3": "برنامه‌نویسی شی‌گرا (جاوا)",
      "/courses/4": "مهندسی نرم‌افزار",
      "/courses/5": "کارآفرینی",
      "/courses/6": "اصول و الگوها در مهندسی نرم‌افزار",
      "/courses/7": "اصول رایانش ابری",
      "/instructors": "اساتید دوره",
      "/register": "ثبت‌نام در دوره‌ها",
      "/calendar": "تقویم آموزشی",
      "/micromaster": "بسته‌های میکرومستر",
      "/syllabus": "سرفصل دوره‌ها",
      "/info": "اطلاعات تکمیلی",
      "/terms": "شرایط و مقررات",
      "/about": "درباره مدرسه",
      "/contact": "تماس با ما",
      "/login": "ورود به پرتال",
      "/dashboard": "پرتال دانشجو",
      "/admin": "پنل مدیریت آموزش",
    };

    if (routes[pathname]) {
      return {
        currentPage: routes[pathname],
        showHome: pathname !== "/courses",
      };
    }

    if (pathname.startsWith("/courses/")) {
      const courseId = pathname.split("/")[2];
      if (courseId && routes[`/courses/${courseId}`]) {
        return {
          currentPage: routes[`/courses/${courseId}`],
          showHome: true,
          parentPage: "دوره‌های آموزشی",
          parentPath: "/courses",
        };
      }
      return {
        currentPage: "جزئیات دوره",
        showHome: true,
        parentPage: "دوره‌های آموزشی",
        parentPath: "/courses",
      };
    }

    return {
      currentPage: "دوره‌های آموزشی",
      showHome: true,
    };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto">
          {breadcrumb.showHome && (
            <>
              <Link
                href="/courses"
                className="hover:text-blue-600 font-medium transition-colors shrink-0"
              >
                خانه
              </Link>
              <ChevronLeftIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </>
          )}

          {breadcrumb.parentPage && (
            <>
              <Link
                href={breadcrumb.parentPath}
                className="hover:text-blue-600 font-medium transition-colors shrink-0"
              >
                {breadcrumb.parentPage}
              </Link>
              <ChevronLeftIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </>
          )}

          <span className="text-slate-900 font-semibold truncate shrink-0">
            {breadcrumb.currentPage}
          </span>
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                href={currentUser.role === "ADMIN" ? "/admin" : "/dashboard"}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200/80 transition-colors shadow-xs"
              >
                {currentUser.role === "ADMIN" ? (
                  <>
                    <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
                    <span>پنل مدیریت آموزش</span>
                  </>
                ) : (
                  <>
                    <AcademicCapIcon className="w-4 h-4 text-blue-600" />
                    <span>{currentUser.full_name || "پرتال من"}</span>
                  </>
                )}
              </Link>

              <button
                onClick={handleLogout}
                className="text-xs text-slate-500 hover:text-red-600 font-medium px-2.5 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                title="خروج از حساب"
              >
                خروج
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 transition-colors"
              >
                ورود / پرتال
              </Link>
              <Link
                href="/register"
                className="hidden sm:inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3.5 rounded-xl shadow-xs hover:shadow transition-all"
              >
                <UserPlusIcon className="w-3.5 h-3.5" />
                <span>ثبت‌نام آنلاین</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
