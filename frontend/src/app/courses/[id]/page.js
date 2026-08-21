"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import MainLayout from "@/components/Layout/MainLayout";
import { courses } from "@/data/sampleData";
import { coursesFullDetails } from "@/data/coursesFullDetails";
import {
  apiGetCourseDetail,
  getLocalDynamicCourses,
  apiGetUserEnrollments,
} from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import {
  toPersianDigits,
  formatPriceToman,
  formatTrackingCode,
} from "@/lib/formatters";
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

function getCourseImage(course) {
  if (course?.image && (course.image.endsWith(".jpg") || course.image.endsWith(".png"))) {
    return course.image;
  }
  const idNum = Number(course?.course_number || course?.id) || 1;
  const imageMap = {
    1: "/photos/coursepic/ml.jpg",
    2: "/photos/coursepic/ST.jpg",
    3: "/photos/coursepic/AP.jpg",
    4: "/photos/coursepic/SE.jpg",
    5: "/photos/coursepic/AP.jpg",
    6: "/photos/coursepic/SE.jpg",
    7: "/photos/coursepic/ml.jpg",
  };
  return imageMap[idNum] || "/photos/coursepic/ml.jpg";
}

export default function CourseDetailsPage({ params, searchParams }) {
  const resolvedParams = use(params);
  const resolvedSearchParams = searchParams ? use(searchParams) : {};
  const rawId = resolvedParams?.id;
  const fromSyllabus = resolvedSearchParams?.from === "syllabus";

  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const user = getCurrentUser();
    setCurrentUser(user);

    async function fetchCourseData() {
      const numId = parseInt(rawId, 10);
      let localBase = null;

      // 1. Check sampleData
      if (!isNaN(numId)) {
        localBase = courses.find((c) => c.id === numId);
      }

      // 2. Check local dynamic courses
      if (!localBase) {
        const dynamic = getLocalDynamicCourses();
        localBase = dynamic.find(
          (c) => c.id === rawId || c.course_number === numId || c.id === numId
        );
      }

      const localFull = (!isNaN(numId) && coursesFullDetails[numId]) || {};

      let mergedCourse = {
        id: numId || rawId,
        course_number: numId || 1,
        title: localBase?.title || `دوره تخصصی شماره ${rawId}`,
        englishTitle: localBase?.englishTitle || "Specialized Course",
        instructor: localBase?.instructor || "عضو هیئت علمی دانشگاه صنعتی امیرکبیر",
        units: localBase?.units || "۳ واحد",
        level: localBase?.level || "کارشناسی ارشد",
        courseLevel: localBase?.courseLevel || "متوسط",
        type: localBase?.type || "اختصاصی",
        description: localBase?.description || "دوره تخصصی دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر.",
        capacity: localBase?.capacity || 30,
        price: localBase?.price || 2500000,
        deliveryMethod: localBase?.deliveryMethod || "ترکیبی (کلاس‌های مجازی + ارزیابی پایانی حضوری)",
        prerequisites: localBase?.prerequisites || "ندارد",
        corequisites: localBase?.corequisites || "ندارد",
        prerequisiteTopics: localBase?.prerequisiteTopics || "",
        duration: localBase?.duration || "۸ هفته (۲۴ ساعت – ۱۶ جلسه) + آزمون نهایی",
        objectives: localFull.objectives || [
          "آشنایی جامع با مبانی و استانداردهای تخصصی دوره",
          "پیاده‌سازی پروژه‌های عملی و کاربردی در بستر ابزارهای مدرن",
          "کسب آمادگی جهت ورود به بازار کار و دوره‌های پیشرفته",
        ],
        targetAudience: localFull.targetAudience || [
          "دانشجویان و دانش‌آموختگان مهندسی و علوم کامپیوتر",
          "متخصصان و علاقه‌مندان به حوزه نرم‌افزار و هوش مصنوعی",
        ],
        softwareTools: localFull.softwareTools || [],
        gradingInfo: localFull.gradingInfo || [
          { label: "تکالیف و پروژه‌های کلاسی", percent: "۵۰٪" },
          { label: "آزمون پایانی", percent: "۵۰٪" },
        ],
        references: localFull.references || [],
        topics: localFull.topics || [],
      };

      // 3. Try to fetch fresh live data from Backend API
      try {
        const apiData = await apiGetCourseDetail(rawId);
        if (apiData && apiData.title_fa && !apiData.title_fa.includes("?")) {
          mergedCourse = {
            ...mergedCourse,
            id: apiData.course_number || apiData.id,
            course_number: apiData.course_number || numId,
            title: apiData.title_fa,
            englishTitle: apiData.title_en || mergedCourse.englishTitle,
            instructor:
              apiData.instructor?.name ||
              apiData.instructor_name ||
              mergedCourse.instructor,
            units: apiData.units || mergedCourse.units,
            level: apiData.level || mergedCourse.level,
            courseLevel: apiData.course_level || mergedCourse.courseLevel,
            type: apiData.type || mergedCourse.type,
            description: apiData.description || mergedCourse.description,
            price: apiData.price ? Number(apiData.price) : mergedCourse.price,
            capacity: apiData.capacity || mergedCourse.capacity,
            prerequisites: apiData.prerequisites || mergedCourse.prerequisites,
            corequisites: apiData.corequisites || mergedCourse.corequisites,
            prerequisiteTopics:
              apiData.prerequisite_topics || mergedCourse.prerequisiteTopics,
            duration: apiData.duration || mergedCourse.duration,
            deliveryMethod:
              apiData.delivery_method || mergedCourse.deliveryMethod,
            objectives:
              apiData.objectives && apiData.objectives.length > 0
                ? apiData.objectives
                : mergedCourse.objectives,
            targetAudience:
              apiData.target_audience && apiData.target_audience.length > 0
                ? apiData.target_audience
                : mergedCourse.targetAudience,
            softwareTools:
              apiData.software_tools && apiData.software_tools.length > 0
                ? apiData.software_tools
                : mergedCourse.softwareTools,
            gradingInfo:
              apiData.grading_info && apiData.grading_info.length > 0
                ? apiData.grading_info
                : mergedCourse.gradingInfo,
            references:
              apiData.references && apiData.references.length > 0
                ? apiData.references
                : mergedCourse.references,
            topics:
              apiData.syllabus_topics && apiData.syllabus_topics.length > 0
                ? apiData.syllabus_topics
                : mergedCourse.topics,
          };
        }
      } catch {
        // Fallback safely preserved
      }

      setCourse(mergedCourse);

      // Check if user is already enrolled in this course
      if (user?.national_id) {
        try {
          const userEnrs = await apiGetUserEnrollments(user.national_id);
          if (Array.isArray(userEnrs)) {
            const hasEnr = userEnrs.some((enr) => {
              const cNum = enr.course?.course_number || enr.course?.id;
              return (
                cNum === numId ||
                cNum === rawId ||
                String(cNum) === String(numId)
              );
            });
            setIsEnrolled(hasEnr);
          }
        } catch {}
      }

      setIsLoading(false);
    }

    fetchCourseData();
  }, [rawId]);

  const handlePrintSyllabus = () => {
    window.print();
  };

  if (isLoading || !course) {
    return (
      <MainLayout>
        <div className="py-24 text-center text-xs text-slate-500">
          در حال بارگذاری مشخصات و سرفصل دوره...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Course Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 mb-8 shadow-sm print:border-none print:shadow-none">
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
              {isEnrolled && (
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>اخذ شده در پرتال من</span>
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

          {/* Syllabus Topics */}
          {course.topics && course.topics.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4 text-slate-900">
                <BookOpenIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold">سرفصل‌ها و مباحث آموزشی</h2>
              </div>
              <div className="space-y-3">
                {course.topics.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {toPersianDigits(t.order_index || idx + 1)}
                    </span>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                        {t.title}
                      </h3>
                      {t.description && (
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {t.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <AwardIcon className="w-5 h-5 text-blue-600" />
              <span>مشخصات آموزشی دوره</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">شهریه مصوب دوره:</span>
                <span className="font-bold text-blue-700">
                  {formatPriceToman(course.price)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">نوع درس و تعداد واحد:</span>
                <span className="font-semibold text-slate-800">
                  {course.type} ({course.units})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">پیش‌نیازها:</span>
                <span className="font-semibold text-slate-800">
                  {course.prerequisites || "ندارد"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">شیوه برگزاری:</span>
                <span className="font-semibold text-slate-800">
                  کلاس آنلاین + آزمون حضوری
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">مدرک نهایی:</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  گواهینامه رسمی دانشگاه امیرکبیر
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2.5 print:hidden">
              {isEnrolled ? (
                <Link
                  href="/dashboard"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-xs transition-all text-xs"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>مشاهده در پرتال کلاسی من</span>
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-xs"
                >
                  <UserPlusIcon className="w-4 h-4" />
                  <span>ثبت‌نام در این دوره</span>
                </Link>
              )}

              <button
                type="button"
                onClick={handlePrintSyllabus}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition-all text-xs"
              >
                <DocumentTextIcon className="w-4 h-4 text-slate-600" />
                <span>چاپ و دریافت سرفصل (PDF)</span>
              </button>

              {fromSyllabus ? (
                <Link
                  href="/syllabus"
                  className="w-full inline-flex items-center justify-center gap-1 text-slate-500 hover:text-slate-800 text-xs py-2"
                >
                  <ChevronLeftIcon className="w-3.5 h-3.5" />
                  <span>بازگشت به سرفصل‌ها</span>
                </Link>
              ) : (
                <Link
                  href="/courses"
                  className="w-full inline-flex items-center justify-center gap-1 text-slate-500 hover:text-slate-800 text-xs py-2"
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
