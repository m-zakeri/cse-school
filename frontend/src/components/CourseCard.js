import Link from "next/link";
import Image from "next/image";
import {
  BookOpenIcon,
  AcademicCapIcon,
  UsersIcon,
  ChevronLeftIcon,
  CodeIcon,
  CpuIcon,
  CloudIcon,
  LayersIcon,
  SparklesIcon,
  CheckCircleIcon,
} from "./Icons";

function getCourseIcon(key) {
  switch (key) {
    case "ai":
      return <CpuIcon className="w-5 h-5 text-indigo-600" />;
    case "testing":
      return <CheckCircleIcon className="w-5 h-5 text-emerald-600" />;
    case "java":
      return <CodeIcon className="w-5 h-5 text-amber-600" />;
    case "software":
      return <LayersIcon className="w-5 h-5 text-blue-600" />;
    case "entrepreneurship":
      return <SparklesIcon className="w-5 h-5 text-purple-600" />;
    case "patterns":
      return <BookOpenIcon className="w-5 h-5 text-cyan-600" />;
    case "cloud":
      return <CloudIcon className="w-5 h-5 text-sky-600" />;
    default:
      return <BookOpenIcon className="w-5 h-5 text-blue-600" />;
  }
}

const CourseCard = ({ course }) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Course Image Container */}
      <div className="h-52 relative overflow-hidden bg-slate-100">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
          <span className="bg-white/95 backdrop-blur-md text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
            {getCourseIcon(course.iconKey)}
            <span>{course.units}</span>
          </span>
        </div>

        <div className="absolute top-3.5 left-3.5">
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full border border-white/10">
            {course.level}
          </span>
        </div>

        {/* Bottom Title on Image for high visibility */}
        <div className="absolute bottom-3 right-3 left-3 text-white">
          <p className="text-xs font-light text-slate-200 opacity-90 truncate">
            {course.englishTitle}
          </p>
        </div>
      </div>

      {/* Course Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
            {course.title}
          </h3>

          <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed mb-4">
            {course.description}
          </p>

          <div className="space-y-2 border-t border-slate-100 pt-3.5 mb-5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <UsersIcon className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-slate-500">مدرس:</span>
              <span className="font-semibold text-slate-800">{course.instructor}</span>
            </div>
            <div className="flex items-center gap-2">
              <AcademicCapIcon className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-slate-500">گرایش:</span>
              <span className="text-slate-700 truncate">{course.field}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <Link
            href={`/courses/${course.id}`}
            className="inline-flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium py-2.5 px-3 rounded-xl transition-all"
          >
            <span>سرفصل و جزئیات</span>
            <ChevronLeftIcon className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl shadow-sm hover:shadow transition-all"
          >
            پیش‌ثبت‌نام
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
