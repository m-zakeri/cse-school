import MainLayout from "@/components/Layout/MainLayout";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/data/sampleData";

export default function Courses() {
  const hiddenCourseIds = [5];

  const visibleCourses = courses.filter(
    (course) => !hiddenCourseIds.includes(course.id)
  );

  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          دوره‌های آموزشی
        </h1>
        <p className="text-gray-600">
          فهرست کامل دوره‌های آموزشی ترم پاییز ۱۴۰۴
        </p>
      </div>

      {/* Courses Grid */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">دوره‌های موجود</h2>
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
