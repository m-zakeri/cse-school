"use client";

import { useEffect, useState, useMemo } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import CourseCard from "@/components/CourseCard";
import { courses as initialCourses } from "@/data/sampleData";
import { getLocalDynamicCourses, apiGetCourses } from "@/lib/api";
import { toPersianDigits } from "@/lib/formatters";
import {
  AcademicCapIcon,
  AwardIcon,
  ShieldCheckIcon,
  CalendarIcon,
  SparklesIcon,
  BookOpenIcon,
  UsersIcon,
} from "@/components/Icons";

export default function Courses() {
  const [coursesList, setCoursesList] = useState(initialCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedInstructor, setSelectedInstructor] = useState("all");

  useEffect(() => {
    async function loadAllCourses() {
      try {
        const backendCourses = await apiGetCourses();
        if (backendCourses && backendCourses.length > 0) {
          const validCourses = backendCourses.filter((c) => {
            const t = c.title_fa || c.title || "";
            return t && !t.includes("?");
          });

          const formatted = validCourses.map((c) => {
            const numId = Number(c.course_number || c.id) || 1;
            const title = c.title_fa || c.title;
            const engTitle =
              c.title_en || c.englishTitle || "Specialized Course";
            const instructor =
              c.instructor?.name ||
              c.instructor_name ||
              c.instructor ||
              "عضو هیئت علمی";
            const field =
              c.field ||
              (title.includes("هوش") || title.includes("ماشین")
                ? "هوش مصنوعی"
                : title.includes("ابر")
                ? "رایانش ابری و زیرساخت"
                : "مهندسی نرم‌افزار");

            return {
              id: numId,
              course_number: numId,
              title,
              englishTitle: engTitle,
              instructor,
              units: c.units || 3,
              level: c.level || "کارشناسی ارشد",
              capacity: c.capacity || 30,
              courseLevel: c.course_level || c.courseLevel || "متوسط",
              field,
              price: Number(c.price) || 2500000,
              description: c.description || field,
              image:
                c.image ||
                `/photos/coursepic/${
                  numId === 1
                    ? "ml.jpg"
                    : numId === 2
                    ? "ST.jpg"
                    : numId === 3
                    ? "AP.jpg"
                    : numId === 5
                    ? "AP.jpg"
                    : "SE.jpg"
                }`,
            };
          });

          setCoursesList(formatted);
          return;
        }
      } catch {
        // Fallback
      }

      setCoursesList(initialCourses);
    }

    loadAllCourses();
  }, []);

  // Extract unique instructors
  const instructorOptions = useMemo(() => {
    const names = new Set();
    coursesList.forEach((c) => {
      if (c.instructor) names.add(c.instructor);
    });
    return Array.from(names);
  }, [coursesList]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return coursesList.filter((c) => {
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        c.title?.toLowerCase().includes(q) ||
        c.englishTitle?.toLowerCase().includes(q) ||
        c.instructor?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q);

      const matchLevel =
        selectedLevel === "all" ||
        c.level === selectedLevel ||
        (selectedLevel === "کارشناسی" && c.level?.includes("کارشناسی") && !c.level?.includes("ارشد")) ||
        (selectedLevel === "کارشناسی ارشد" && c.level?.includes("ارشد"));

      const matchInstructor =
        selectedInstructor === "all" || c.instructor === selectedInstructor;

      const matchField =
        selectedField === "all" ||
        (selectedField === "software" &&
          (c.title?.includes("نرم‌افزار") ||
            c.title?.includes("برنامه‌نویسی") ||
            c.title?.includes("آزمون") ||
            c.title?.includes("الگو") ||
            c.field?.includes("نرم‌افزار"))) ||
        (selectedField === "ai" &&
          (c.title?.includes("هوش") ||
            c.title?.includes("ماشین") ||
            c.field?.includes("هوش"))) ||
        (selectedField === "cloud" &&
          (c.title?.includes("ابر") ||
            c.title?.includes("شبکه") ||
            c.field?.includes("ابر")));

      return matchQuery && matchLevel && matchInstructor && matchField;
    });
  }, [coursesList, searchQuery, selectedField, selectedLevel, selectedInstructor]);

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedField !== "all" ||
    selectedLevel !== "all" ||
    selectedInstructor !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedField("all");
    setSelectedLevel("all");
    setSelectedInstructor("all");
  };

  return (
    <MainLayout>
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-10 mb-8 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <CalendarIcon className="w-4 h-4 text-blue-400" />
            <span>پذیرش ترم پاییز ۱۴۰۴ — ثبت‌نام فعال</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 leading-tight">
            مدرسه پاییزه آموزش‌های تخصصی
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            دوره‌های مهارت‌محور و پیشرفته دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر با تدریس اعضای هیئت علمی و اعطای گواهینامه رسمی دوزبانه.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 flex items-center justify-center text-blue-300 shrink-0">
                <AcademicCapIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">دوره‌های تخصصی</p>
                <p className="text-sm font-bold text-white">
                  {toPersianDigits(coursesList.length)} عنوان دوره فعال
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 flex items-center justify-center text-indigo-300 shrink-0">
                <AwardIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">مدرک نهایی</p>
                <p className="text-sm font-bold text-white">گواهینامه رسمی دو زبانه</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/30 flex items-center justify-center text-emerald-300 shrink-0">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">شیوه برگزاری</p>
                <p className="text-sm font-bold text-white">کلاس آنلاین + آزمون حضوری</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Decorative Background */}
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      </section>

      {/* Live Search & Filter Bar */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی نام دوره، استاد، مباحث آموزشی..."
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">همه مقاطع تحصیلی</option>
              <option value="کارشناسی">کارشناسی</option>
              <option value="کارشناسی ارشد">کارشناسی ارشد</option>
            </select>

            {/* Instructor Filter */}
            <select
              value={selectedInstructor}
              onChange={(e) => setSelectedInstructor(e.target.value)}
              className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">همه اساتید</option>
              {instructorOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-2xl transition-colors shrink-0"
              >
                پاکسازی فیلترها
              </button>
            )}
          </div>
        </div>

        {/* Track / Field Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-slate-100 no-scrollbar">
          <span className="text-xs text-slate-400 font-medium shrink-0 ml-1">
            دسته‌بندی گرایش:
          </span>
          <button
            type="button"
            onClick={() => setSelectedField("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              selectedField === "all"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            همه دوره‌ها ({toPersianDigits(coursesList.length)})
          </button>
          <button
            type="button"
            onClick={() => setSelectedField("software")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              selectedField === "software"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            مهندسی نرم‌افزار و معماری
          </button>
          <button
            type="button"
            onClick={() => setSelectedField("ai")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              selectedField === "ai"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            هوش مصنوعی و داده
          </button>
          <button
            type="button"
            onClick={() => setSelectedField("cloud")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              selectedField === "cloud"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            رایانش ابری و زیرساخت
          </button>
        </div>
      </section>

      {/* Courses Grid Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              فهرست دوره‌های آموزشی
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              نمایش {toPersianDigits(filteredCourses.length)} از {toPersianDigits(coursesList.length)} دوره آموزشی فعال
            </p>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <BookOpenIcon className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              دوره‌ای مطابق با جستجو یا فیلتر شما یافت نشد
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              می‌توانید با تغییر کلمات جستجو یا پاکسازی فیلترها مجدداً فهرست را مشاهده فرمایید.
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all"
            >
              نمایش همه دوره‌ها
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
}
