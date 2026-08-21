"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
  getAssetPath,
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
    return getAssetPath(course.image);
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
  return getAssetPath(imageMap[idNum] || "/photos/coursepic/ml.jpg");
}

export default function CourseDetailClient({ params }) {
  const rawId = params?.id;
  const searchParams = useSearchParams();
  const fromSyllabus = searchParams?.get("from") === "syllabus";

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

      // Check enrollment
      if (user?.national_id) {
        try {
          const userEnrs = await apiGetUserEnrollments(user.national_id);
          const hasEnrolled = userEnrs.some((e) => {
            const courseId = e.course_id || e.course?.id;
            const courseNum = e.course?.course_number;
            return (
              String(courseId) === String(rawId) ||
              String(courseNum) === String(numId)
            );
          });
          setIsEnrolled(hasEnrolled);
        } catch {
          setIsEnrolled(false);
        }
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
        <div className="py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-xs text-slate-500">
            در حال بارگذاری اطلاعات رسمی دوره...
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Official AUT Print Header */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6 text-center">
        <div className="flex items-center justify-between">
          <div className="text-right">
            <h2 className="text-sm font-bold text-slate-900">
              دانشگاه صنعتی امیرکبیر (پلی‌تکنیک تهران)
            </h2>
            <p className="text-xs text-slate-600">دانشکده مهندسی کامپیوتر</p>
            <p className="text-xs text-slate-600">
              مدرسه پاییزه آموزش‌های تخصصی
            </p>
          </div>
          <div className="text-center">
            <h1 className="text-base font-extrabold text-slate-950">
              برنامه و سرفصل تفصیلی مصوب دوره
            </h1>
            <p className="text-xs text-slate-500 mt-1">نیمسال پاییز ۱۴۰۴</p>
          </div>
          <div className="text-left text-xs text-slate-600">
            <p>
              شماره درس:{" "}
              <span className="font-bold">
                {toPersianDigits(course.course_number || course.id)}
              </span>
            </p>
            <p>واحد: {toPersianDigits(course.units)}</p>
            <p>
              تاریخ چاپ: {toPersianDigits(new Date().toLocaleDateString("fa-IR"))}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/50">
                کد درس: {toPersianDigits(course.course_number || course.id)}
              </span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1 rounded-full">
                {course.level}
              </span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1 rounded-full">
                {course.type}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-1 leading-snug">
              {course.title}
            </h1>
            <p className="text-xs text-slate-400 font-mono mb-4" dir="ltr">
              {course.englishTitle}
            </p>

            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
              {course.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <AcademicCapIcon className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{toPersianDigits(course.units)}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <ClockIcon className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <UsersIcon className="w-4 h-4 text-blue-600 shrink-0" />
                <span>ظرفیت: {toPersianDigits(course.capacity)} نفر</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>سطح: {course.courseLevel}</span>
              </div>
            </div>
          </div>

          {/* Objectives */}
          {course.objectives && course.objectives.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <AwardIcon className="w-5 h-5 text-blue-600" />
                <span>اهداف آموزشی دوره</span>
              </h2>
              <ul className="space-y-2.5">
                {course.objectives.map((obj, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
                  >
                    <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Syllabus Topics */}
          {course.topics && course.topics.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <BookOpenIcon className="w-5 h-5 text-blue-600" />
                <span>سرفصل جلسات و مباحث تفصیلی</span>
              </h2>
              <div className="space-y-3">
                {course.topics.map((t, idx) => {
                  const title = typeof t === "string" ? t : t.title || t.topic;
                  const desc = typeof t === "object" ? t.description : null;
                  const session = typeof t === "object" ? t.session : idx + 1;

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                          {toPersianDigits(session)}
                        </span>
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                          {title}
                        </span>
                      </div>
                      {desc && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 mr-9 leading-relaxed">
                          {desc}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Software Tools */}
          {course.softwareTools && course.softwareTools.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <CodeIcon className="w-5 h-5 text-blue-600" />
                <span>ابزارها و نرم‌افزارهای مورد استفاده</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {course.softwareTools.map((tool, i) => (
                  <span
                    key={i}
                    className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900 text-xs font-semibold px-3 py-1.5 rounded-xl"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info & Action */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs sticky top-24 space-y-6">
            <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={getCourseImage(course)}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-1">مدرس دوره</p>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {course.instructor}
              </h3>
              <p className="text-[11px] text-slate-500">
                دانشکده مهندسی کامپیوتر پلی‌تکنیک
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">پیش‌نیازها:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {course.prerequisites || "ندارد"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">شیوه برگزاری:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  کلاس آنلاین + آزمون حضوری
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">مدرک نهایی:</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                  گواهینامه رسمی دانشگاه امیرکبیر
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 print:hidden">
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

      {/* Recommended & Related Courses Section */}
      {courses.filter((c) => String(c.id) !== String(rawId)).length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 print:hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-blue-600" />
                <span>دوره‌های پیشنهادی و مرتبط این گرایش</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                علاقه‌مندان به این مبحث، دوره‌های زیر را نیز انتخاب کرده‌اند.
              </p>
            </div>
            <Link
              href="/courses"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>مشاهده همه دوره‌ها</span>
              <ChevronLeftIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {courses
              .filter((c) => String(c.id) !== String(rawId))
              .slice(0, 3)
              .map((rc) => (
                <Link
                  key={rc.id}
                  href={`/courses/${rc.id}`}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 hover:shadow-lg transition-all hover:-translate-y-0.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 px-2 py-0.5 rounded-md">
                        {rc.field || "مهندسی کامپیوتر"}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {toPersianDigits(rc.units || 3)} واحد
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                      {rc.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      مدرس: {rc.instructor}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-blue-600 font-bold">
                    <span>مشاهده سرفصل و جزئیات</span>
                    <ChevronLeftIcon className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </MainLayout>
  );
}
