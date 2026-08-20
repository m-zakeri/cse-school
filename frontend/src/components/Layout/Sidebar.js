"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpenIcon,
  UsersIcon,
  DocumentTextIcon,
  CalendarIcon,
  LayersIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  InfoIcon,
  BuildingIcon,
  PhoneIcon,
  MenuIcon,
  XMarkIcon,
  AcademicCapIcon,
} from "../Icons";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      title: "دوره‌های آموزشی",
      href: "/courses",
      icon: BookOpenIcon,
    },
    {
      title: "اساتید دوره",
      href: "/instructors",
      icon: UsersIcon,
    },
    {
      title: "سرفصل دوره‌ها",
      href: "/syllabus",
      icon: DocumentTextIcon,
    },
    {
      title: "تقویم آموزشی",
      href: "/calendar",
      icon: CalendarIcon,
    },
    {
      title: "بسته‌های میکرومستر",
      href: "/micromaster",
      icon: LayersIcon,
    },
    {
      title: "ثبت‌نام",
      href: "/register",
      icon: UserPlusIcon,
    },
    {
      title: "ورود / پرتال کاربری",
      href: "/login",
      icon: ShieldCheckIcon,
    },
    {
      title: "اطلاعات تکمیلی",
      href: "/info",
      icon: InfoIcon,
    },
    {
      title: "شرایط و مقررات",
      href: "/terms",
      icon: ShieldCheckIcon,
    },
    {
      title: "درباره مدرسه",
      href: "/about",
      icon: BuildingIcon,
    },
    {
      title: "تماس با ما",
      href: "/contact",
      icon: PhoneIcon,
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        aria-label="باز کردن منو"
        className="lg:hidden fixed top-3.5 right-3.5 z-50 bg-slate-900 text-white p-2.5 rounded-xl shadow-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <XMarkIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 right-0 h-screen w-72 bg-slate-900 border-l border-slate-800/80 text-slate-100 z-40 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-5">
          {/* Header Brand */}
          <div className="pb-6 mb-4 border-b border-slate-800/80">
            <Link
              href="/courses"
              className="flex items-center gap-3.5 group"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white group-hover:scale-105 transition-transform">
                <AcademicCapIcon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  مدرسه تخصصی CE
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  دانشکده مهندسی کامپیوتر
                </span>
                <span className="text-[11px] text-blue-400 font-medium">
                  دانشگاه صنعتی امیرکبیر
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 flex-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href === "/courses" && pathname.startsWith("/courses"));
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer Badge */}
          <div className="pt-4 mt-4 border-t border-slate-800/80">
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400">ترم فعال سامانه</p>
                <p className="text-xs font-bold text-slate-200">پاییز ۱۴۰۴</p>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ثبت‌نام فعال
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
