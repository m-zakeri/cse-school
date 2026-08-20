import MainLayout from "@/components/Layout/MainLayout";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/data/sampleData";
import {
  AcademicCapIcon,
  AwardIcon,
  ShieldCheckIcon,
  CalendarIcon,
} from "@/components/Icons";

export default function Courses() {
  const hiddenCourseIds = [5];

  const visibleCourses = courses.filter(
    (course) => !hiddenCourseIds.includes(course.id)
  );

  return (
    <MainLayout>
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-10 mb-10 shadow-xl border border-slate-800">
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
                <p className="text-sm font-bold text-white">۶ عنوان دوره فعال</p>
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

      {/* Courses Grid Section */}
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              فهرست دوره‌های آموزشی
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              جهت مشاهده جزئیات سرفصل، پیش‌نیازها و اطلاعات هر دوره روی کارت کلیک نمایید.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
