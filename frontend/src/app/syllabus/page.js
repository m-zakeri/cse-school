"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import Link from "next/link";
import { courses as sampleCourses } from "@/data/sampleData";
import { apiGetCourses, apiGetTerms } from "@/lib/api";
import { toPersianDigits } from "@/lib/formatters";
import {
  DocumentTextIcon,
  AcademicCapIcon,
  UsersIcon,
  ChevronLeftIcon,
  CalendarIcon,
} from "@/components/Icons";

// Maps the API's course summary to the shape this table renders.
function toRow(c) {
  return {
    id: c.course_number,
    title: c.title_fa,
    englishTitle: c.title_en,
    instructor: c.instructor?.name || "عضو هیئت علمی",
    level: c.level,
    units: c.units,
    term: c.term?.title || "",
  };
}

export default function Syllabus() {
  const [courses, setCourses] = useState([]);
  const [terms, setTerms] = useState([]);
  const [termCode, setTermCode] = useState(null); // null = current term
  const [state, setState] = useState("loading"); // loading | ready | offline

  useEffect(() => {
    apiGetTerms().then(setTerms).catch(() => setTerms([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    apiGetCourses(termCode)
      .then((list) => {
        if (cancelled) return;
        setCourses((list || []).map(toRow));
        setState("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setCourses(sampleCourses.map((c) => ({ ...c, term: "" })));
        setState("offline");
      });
    return () => {
      cancelled = true;
    };
  }, [termCode]);

  const viewedTerm = terms.find((t) => (termCode ? t.code === termCode : t.is_active));

  return (
    <MainLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
          <DocumentTextIcon className="w-4 h-4 text-blue-600" />
          <span>محتوا و ماتریس آموزشی</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          سرفصل و ماتریس دوره‌ها
        </h1>
        <p className="text-slate-600 text-sm">
          فهرست و ساختار سرفصل‌های مصوب دوره‌های تخصصی دانشکده مهندسی کامپیوتر
        </p>
      </div>

      {/* Course Syllabus Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden mb-12">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <AcademicCapIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                جدول دوره‌های فعال و سرفصل‌ها
              </h2>
              <p className="text-xs text-slate-500">
                {viewedTerm ? viewedTerm.title : "همه دوره‌ها"} • {toPersianDigits(courses.length)} دوره
              </p>
            </div>
          </div>

          {terms.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs text-slate-400 font-medium shrink-0">ترم:</span>
              {terms.map((t) => {
                const selected = termCode ? t.code === termCode : t.is_active;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTermCode(t.is_active ? null : t.code)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                      selected
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {t.title.replace(/^ترم\s+/, "")}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {state === "offline" && (
          <p className="px-6 py-3 text-xs text-amber-700 bg-amber-50 border-b border-amber-100">
            ارتباط با سرور برقرار نشد؛ فهرست نمونه نمایش داده می‌شود.
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-semibold text-slate-700">
                <th className="py-4 px-6 text-center w-16">ردیف</th>
                <th className="py-4 px-6">عنوان دوره</th>
                <th className="py-4 px-6">مقطع و واحد</th>
                <th className="py-4 px-6">مدرس دوره</th>
                <th className="py-4 px-6 text-center">ترم ارائه</th>
                <th className="py-4 px-6 text-center">مشاهده سرفصل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {state === "ready" && courses.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    دوره‌ای برای این ترم تعریف نشده است.
                  </td>
                </tr>
              )}
              {courses.map((course, index) => (
                <tr
                  key={course.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-4 px-6 text-center font-bold text-slate-400 group-hover:text-blue-600">
                    {index + 1}
                  </td>
                  <td className="py-4 px-6">
                    <Link
                      href={`/courses/${course.id}?from=syllabus`}
                      className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors"
                    >
                      {course.title}
                    </Link>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                      {course.englishTitle}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                        {course.level}
                      </span>
                      <span className="text-slate-500">{course.units}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <UsersIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.instructor}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-full text-[11px]">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{course.term ? course.term.replace(/^ترم\s+/, "") : "—"}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Link
                      href={`/courses/${course.id}?from=syllabus`}
                      className="inline-flex items-center justify-center gap-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-medium py-1.5 px-3 rounded-lg transition-all text-xs"
                    >
                      <span>جزئیات</span>
                      <ChevronLeftIcon className="w-3 h-3" />
                    </Link>
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
