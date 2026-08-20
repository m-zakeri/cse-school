import MainLayout from "@/components/Layout/MainLayout";
import { courses } from "@/data/sampleData";
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
} from "@/components/Icons";

export default async function CourseDetails({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const courseId = parseInt(resolvedParams?.id);
  const course = courses.find((c) => c.id === courseId);
  const fromSyllabus = resolvedSearchParams?.from === "syllabus";

  if (!course) {
    notFound();
  }

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
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {course.title}
            </h1>

            <p className="text-sm font-medium text-slate-500 font-sans tracking-wide">
              {course.englishTitle}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <UsersIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500">مدرس دوره</p>
              <p className="text-sm font-bold text-slate-900">{course.instructor}</p>
              <p className="text-[11px] text-slate-500">دانشگاه صنعتی امیرکبیر</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Sticky Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Content Section (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4 text-slate-900">
              <DocumentTextIcon className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold">شرح و اهداف دوره</h2>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Prerequisites & Requirements */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5 text-slate-900">
              <AcademicCapIcon className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold">پیش‌نیازها و ملزومات آموزشی</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-900">پیش‌نیازهای درسی:</span>
                <p className="text-slate-700">{course.prerequisites || "ندارد"}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-900">هم‌نیازهای درسی:</span>
                <p className="text-slate-700">{course.corequisites || "ندارد"}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5 sm:col-span-2">
                <span className="font-bold text-slate-900">مباحث پیش‌نیاز پیشنهادی:</span>
                <p className="text-slate-700">{course.prerequisiteTopics}</p>
              </div>
            </div>
          </div>

          {/* Delivery & Schedule */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5 text-slate-900">
              <ClockIcon className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold">طول دوره و شیوه برگزاری</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <p className="font-bold text-slate-900 mb-1">زمان‌بندی و جلسات:</p>
                <p className="text-slate-700 leading-relaxed">{course.duration}</p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="font-bold text-slate-900 mb-1">شیوه ارائه:</p>
                <p className="text-slate-700">{course.deliveryMethod}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Sidebar (4 cols) */}
        <div className="lg:col-span-4 sticky top-20 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
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
                <span>ثبت‌نام آنلاین در این دوره</span>
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
