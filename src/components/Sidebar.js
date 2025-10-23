"use client";

import Link from "next/link";
import { useState } from "react";

const Sidebar = () => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpanded = (item) => {
    setExpandedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const menuItems = [
    {
      title: "دوره‌های آموزشی",
      href: "/courses",
      icon: "📚",
    },
    {
      title: "اساتید دوره",
      href: "/instructors",
      icon: "👨‍🏫",
    },
    {
      title: "ثبت‌نام",
      href: "/registration",
      icon: "📝",
    },
    {
      title: "تقویم آموزشی",
      href: "/calendar",
      icon: "📅",
      hasSubmenu: true,
      submenu: [
        { title: "تقویم آموزشی سال ۱۴۰۴", href: "/calendar/1404" },
        { title: "تقویم آموزشی سال ۱۴۰۳", href: "/calendar/1403" },
      ],
    },
    {
      title: "بسته‌های میکرومستر",
      href: "/micromasters",
      icon: "🎓",
      hasSubmenu: true,
      submenu: [
        { title: "برنامه‌سازی و الگوریتم", href: "/micromasters/programming" },
        { title: "هوش مصنوعی", href: "/micromasters/ai" },
        { title: "مهندسی نرم‌افزار", href: "/micromasters/software" },
        { title: "علم داده", href: "/micromasters/data-science" },
      ],
    },
    {
      title: "اطلاعات تکمیلی",
      href: "/info",
      icon: "ℹ️",
      hasSubmenu: true,
      submenu: [
        { title: "سوالات متداول", href: "/faq" },
        { title: "سرفصل دوره‌ها", href: "/syllabus" },
        { title: "مسابقات برنامه‌سازی", href: "/competitions/programming" },
        { title: "مسابقات هوش مصنوعی", href: "/competitions/ai" },
      ],
    },
    {
      title: "شرایط و مقررات",
      href: "/terms",
      icon: "📋",
    },
    {
      title: "درباره",
      href: "/about",
      icon: "🏛️",
    },
    {
      title: "تماس با ما",
      href: "/contact",
      icon: "📞",
    },
  ];

  return (
    <div className="w-80 bg-blue-900 text-white h-screen fixed right-0 top-0 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-900 text-xl font-bold">آ</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">آموزش‌های تخصصی</h1>
            <p className="text-blue-200 text-sm">دانشکده مهندسی کامپیوتر</p>
            <p className="text-blue-200 text-sm">دانشگاه امیرکبیر</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <div>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="flex-1">{item.title}</span>
                  {item.hasSubmenu && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleExpanded(item.title);
                      }}
                      className="text-blue-200 hover:text-white"
                    >
                      {expandedItems[item.title] ? "▼" : "▶"}
                    </button>
                  )}
                </Link>

                {item.hasSubmenu && expandedItems[item.title] && (
                  <ul className="mr-8 mt-2 space-y-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          href={subItem.href}
                          className="block p-2 text-blue-200 hover:text-white hover:bg-blue-800 rounded transition-colors"
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Search */}
      <div className="p-4 border-t border-blue-800">
        <div className="relative">
          <input
            type="text"
            placeholder="جستجو..."
            className="w-full p-3 bg-blue-800 text-white placeholder-blue-300 rounded-lg border border-blue-700 focus:outline-none focus:border-blue-500"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300">
            🔍
          </span>
        </div>
      </div>

      {/* User Tools */}
      <div className="p-4 border-t border-blue-800">
        <div className="text-sm text-blue-200">
          <p className="mb-2">ابزار کاربر</p>
          <Link
            href="/login"
            className="block p-2 text-blue-200 hover:text-white hover:bg-blue-800 rounded transition-colors"
          >
            ورود به سامانه
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
