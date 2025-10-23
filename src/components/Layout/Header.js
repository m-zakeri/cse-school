"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  // تعریف مسیرها و نام‌های مربوطه
  const getBreadcrumb = () => {
    const routes = {
      "/": "خانه",
      "/courses": "دوره‌های آموزشی",
      "/courses/1": "یادگیری ماشین",
      "/courses/2": "آزمون و تضمین کیفیت نرم‌افزار",
      "/courses/3": "برنامه نویسی شی گرا (جاوا)",
      "/courses/4": "مهندسی نرم‌افزار",
      "/instructors": "اساتید دوره",
      "/register": "ثبت‌نام",
      "/calendar": "تقویم آموزشی",
      "/micromaster": "بسته‌های میکرومستر",
      "/info": "اطلاعات تکمیلی",
      "/terms": "شرایط و مقررات",
      "/about": "درباره",
      "/contact": "تماس با ما",
    };

    // اگر مسیر دقیقاً در routes موجود باشد
    if (routes[pathname]) {
      return {
        currentPage: routes[pathname],
        showHome: pathname !== "/",
      };
    }

    // اگر مسیر dynamic باشد (مثل /courses/[id])
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
      // اگر دوره جدیدی اضافه شده باشد که در routes نیست
      return {
        currentPage: "جزئیات دوره",
        showHome: true,
        parentPage: "دوره‌های آموزشی",
        parentPath: "/courses",
      };
    }

    // پیش‌فرض
    return {
      currentPage: "دوره‌های آموزشی",
      showHome: true,
    };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600">
            {breadcrumb.showHome && (
              <>
                <Link href="/courses" className="hover:text-blue-600">
                  خانه
                </Link>
                <span className="mx-2">»</span>
              </>
            )}
            {breadcrumb.parentPage && (
              <>
                <Link
                  href={breadcrumb.parentPath}
                  className="hover:text-blue-600"
                >
                  {breadcrumb.parentPage}
                </Link>
                <span className="mx-2">»</span>
              </>
            )}
            <span className="text-gray-900">{breadcrumb.currentPage}</span>
          </nav>

          {/* University Logo */}
          <div className="flex items-center">
            <div className="text-right">
              <h2 className="text-lg font-bold text-gray-900">
                دانشگاه امیرکبیر
              </h2>
              <p className="text-sm text-gray-600">دانشکده مهندسی کامپیوتر</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
