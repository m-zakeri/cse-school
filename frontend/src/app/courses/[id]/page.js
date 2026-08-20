import MainLayout from "@/components/Layout/MainLayout";
import { courses } from "@/data/sampleData";
import { coursesFullDetails } from "@/data/coursesFullDetails";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  AcademicCapIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
  DocumentTextIcon,
  AwardIcon,
  UserPlusIcon,
  CodeIcon,
  BookOpenIcon,
  SparklesIcon,
} from "@/components/Icons";

export default async function CourseDetails({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const courseId = parseInt(resolvedParams?.id);
  const baseCourse = courses.find((c) => c.id === courseId);
  const fullDetails = coursesFullDetails[courseId] || baseCourse;
  const fromSyllabus = resolvedSearchParams?.from === "syllabus";

  if (!baseCourse) {
    notFound();
  }

  const course = {
    ...baseCourse,
    ...fullDetails,
  };

  return (
    <MainLayout>
      {/* Course Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
                {course.level}
              </span>
              <span className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1 rounded-full">
                {course.units}
              </span>
              <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
                {course.type}
              </span>
              {course.version && (
                <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-emerald-100">
                  نگارش طرح درس: {course.version}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {course.title}
            </h1>

            <p className="text-sm font-medium text-slate-500 font-sans tracking-wide">
              {course.englishTitle}
            </p>
          </div>

          <div className="flex items-center gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <UsersIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500">مدرس و طراح دوره</p>
              <p className="text-sm font-bold text-slate-900">{course.instructor}</p>
              <p className="text-[11px] text-slate-500">دانشگاه صنعتی امیرکبیر</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        {/* Content Section (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4 text-slate-900">
              <DocumentTextIcon className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold">معرفی و شرح دوره</h2>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Objectives */}
          {course.objectives && course.objectives.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4 text-slate-900">
                <SparklesIcon className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold">اهداف و دستاوردهای یادگیری</h2>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                {course.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Target Audience */}
          {course.targetAudience && course.targetAudience.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4 text-slate-900">
                <UsersIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold">مخاطبین هدف دوره</h2>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {course.targetAudience.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Detailed Syllabus Topics */}
          {course.topics && course.topics.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-100">
                <div className="flex items-center gap-2.5 text-slate-900">
                  <BookOpenIcon className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-bold">سرفصل‌ها و مباحث تفصیلی جلسات</h2>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {course.topics.length} سرفصل اصلی
                </span>
              </div>

              <div className="space-y-4">
                {course.topics.map((topic, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                        {topic.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pr-8">
                      {topic.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Software Tools */}
          {course.softwareTools && course.softwareTools.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4 text-slate-900">
                <CodeIcon className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-bold">نرم‌افزارها، ابزارها و فریم‌ورک‌های مورد بحث</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {course.softwareTools.map((tool, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 font-medium block mb-1">{tool.category}:</span>
                    <span className="font-bold text-slate-900 font-mono text-[11px]">{tool.tools}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments & Grading Breakdown */}
          {course.grading && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4 text-slate-900">
                <AwardIcon className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold">تکالیف، پروژه‌ها و بارم‌بندی ارزشیابی</h2>
              </div>

              {course.assignments && (
                <p className="text-xs text-slate-700 mb-4 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                  <span className="font-bold">ساختار تکالیف: </span>
                  {course.assignments}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {course.grading.map((g, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <p className="text-xs text-slate-500 mb-1">{g.label}</p>
                    <p className="text-lg font-extrabold text-blue-600">{g.percent}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prerequisites */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5 text-slate-900">
              <AcademicCapIcon className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold">پیش‌نیازها و ملزومات آموزشی</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-900">پیش‌نیازهای درسی:</span>
                <p className="text-slate-700">{course.prerequisites || "ندارد"}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-900">هم‌نیازهای درسی:</span>
                <p className="text-slate-700">{course.corequisites || "ندارد"}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5 sm:col-span-2">
                <span className="font-bold text-slate-900">مباحث پیش‌نیاز پیشنهادی:</span>
                <p className="text-slate-700">{course.prerequisiteTopics}</p>
              </div>
            </div>
          </div>

          {/* References */}
          {course.references && course.references.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4 text-slate-900">
                <BookOpenIcon className="w-5 h-5 text-slate-600" />
                <h2 className="text-base font-bold">مراجع و کتب دانشگاهی درس</h2>
              </div>
              <ol className="space-y-2 text-xs text-slate-700 list-decimal pr-5 font-sans leading-relaxed">
                {course.references.map((ref, idx) => (
                  <li key={idx}>{ref}</li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Sticky Sidebar (4 cols) */}
        <div className="lg:col-span-4 sticky top-20 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
              مشخصات اجرایی دوره
            </h3>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">گرایش تحصیلی:</span>
                <span className="font-semibold text-slate-800">{course.field}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">سطح دوره:</span>
                <span className="font-semibold text-slate-800">{course.courseLevel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">نوع درس:</span>
                <span className="font-semibold text-slate-800">{course.type} ({course.units})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">شیوه برگزاری:</span>
                <span className="font-semibold text-slate-800">کلاس آنلاین + آزمون حضوری</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">گواهینامه:</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  رسمی دانشگاه امیرکبیر
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-sm hover:shadow transition-all text-xs"
              >
                <UserPlusIcon className="w-4 h-4" />
                <span>ثبت‌نام در این دوره</span>
              </Link>

              {fromSyllabus ? (
                <Link
                  href="/syllabus"
                  className="w-full inline-flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-xl transition-all text-xs"
                >
                  <ChevronLeftIcon className="w-3.5 h-3.5" />
                  <span>بازگشت به سرفصل‌ها</span>
                </Link>
              ) : (
                <Link
                  href="/courses"
                  className="w-full inline-flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-xl transition-all text-xs"
                >
                  <ChevronLeftIcon className="w-3.5 h-3.5" />
                  <span>بازگشت به فهرست دوره‌ها</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
