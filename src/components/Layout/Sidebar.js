"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      title: "دوره‌های آموزشی",
      href: "/courses",
    },
    {
      title: "اساتید دوره",
      href: "/instructors",
    },
    {
      title: "سرفصل دوره‌ها",
      href: "/syllabus",
    },
    {
      title: "اطلاعات تکمیلی",
      href: "/info",
    },
    {
      title: "شرایط و مقررات",
      href: "/terms",
    },
    {
      title: "درباره",
      href: "/about",
    },
    {
      title: "تماس با ما",
      href: "/contact",
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 right-4 z-50 bg-blue-600 text-white p-2 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-blue-600 text-white z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6">
          {/* Logo and Title */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div>
                <h1 className="text-xl font-bold">مدرسه پاییزه امیرکبیر</h1>
                <p className="text-blue-200 text-sm">دانشکده مهندسی کامپیوتر</p>
                <p className="text-blue-200 text-sm">دانشگاه امیرکبیر</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-colors relative ${
                    isActive
                      ? "bg-blue-700 text-white"
                      : "hover:bg-blue-700 text-blue-100"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {isActive && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-r"></div>
                  )}
                  <span className="mr-3">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
