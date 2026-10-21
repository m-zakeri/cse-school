"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser, clearAuthSession } from "@/lib/auth";
import { useTheme } from "@/components/UI/ThemeProvider";
import {
  ChevronLeftIcon,
  AcademicCapIcon,
  UserPlusIcon,
  ShieldCheckIcon,
} from "../Icons";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [courseLabel, setCourseLabel] = useState("");
  const { theme, toggleTheme, isDark, isMounted: themeMounted } = useTheme();

  useEffect(() => {
    const syncUser = () => setCurrentUser(getCurrentUser());
    syncUser();

    window.addEventListener("aut_auth_change", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("aut_auth_change", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, [pathname]);

  // The course page announces its title so the trail names the real course
  // instead of a hard-coded list that goes stale as courses are added.
  useEffect(() => {
    setCourseLabel("");
    const onLabel = (e) => setCourseLabel(e.detail || "");
    window.addEventListener("aut_breadcrumb", onLabel);
    return () => window.removeEventListener("aut_breadcrumb", onLabel);
  }, [pathname]);

  const handleLogout = () => {
    clearAuthSession();
    setCurrentUser(null);
    router.push("/courses");
  };

  // There is no home page ("/" redirects to the course catalogue), so the trail
  // never starts at a "home": a section is one crumb, and a course page hangs
  // under the catalogue it belongs to.
  const SECTION_TITLES = {
    "/courses": "دوره‌های آموزشی",
    "/instructors": "اساتید دوره",
    "/register": "اخذ و ثبت‌نام دوره",
    "/calendar": "تقویم آموزشی",
    "/micromaster": "بسته‌های میکرومستر",
    "/syllabus": "سرفصل دوره‌ها",
    "/info": "اطلاعات تکمیلی",
    "/terms": "شرایط و مقررات",
    "/about": "درباره مدرسه",
    "/contact": "تماس با ما",
    "/login": "ورود و ثبت‌نام حساب",
    "/dashboard": "پرتال دانشجو",
    "/admin": "پنل مدیریت آموزش",
  };

  const getBreadcrumb = () => {
    const path = pathname.replace(/\/+$/, "") || "/";

    if (path.startsWith("/courses/")) {
      return [
        { label: "دوره‌های آموزشی", href: "/courses" },
        { label: courseLabel || "جزئیات دوره" },
      ];
    }

    return [{ label: SECTION_TITLES[path] || "دوره‌های آموزشی" }];
  };

  const crumbs = getBreadcrumb();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto no-scrollbar">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <span key={index} className="flex items-center gap-1.5 shrink-0">
                {crumb.href && !isLast ? (
                  <Link href={crumb.href} className="hover:text-blue-600 font-medium transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-900 font-semibold truncate max-w-[60vw]" aria-current={isLast ? "page" : undefined}>
                    {crumb.label}
                  </span>
                )}
                {!isLast && <ChevronLeftIcon className="w-3.5 h-3.5 text-slate-400" />}
              </span>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Dark / Light Mode Switcher (Temporarily commented out)
          {themeMounted && (
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/80 dark:border-slate-700"
              title={isDark ? "تغییر به تم روشن" : "تغییر به تم تیره"}
            >
              {isDark ? (
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          )}
          */}

          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                href={currentUser.role === "ADMIN" ? "/admin" : "/dashboard"}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-xl border border-blue-200/80 dark:border-blue-800 transition-colors shadow-xs"
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

              <Link
                href="/register"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <UserPlusIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>اخذ دوره جدید</span>
              </Link>

              <button
                onClick={handleLogout}
                className="text-xs text-slate-400 hover:text-red-600 font-medium px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="خروج از حساب"
              >
                خروج
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login?tab=login"
                className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                ورود به حساب
              </Link>
              <Link
                href="/login?tab=signup"
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3.5 rounded-xl shadow-xs hover:shadow transition-all"
              >
                <UserPlusIcon className="w-3.5 h-3.5" />
                <span>ایجاد حساب کاربری</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
