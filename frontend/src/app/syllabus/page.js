import MainLayout from "@/components/Layout/MainLayout";
import Link from "next/link";
import { courses } from "@/data/sampleData";

export default function Syllabus() {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">سرفصل دوره‌ها</h1>
        <p className="text-gray-600">
          لیست کامل دوره‌های آموزشی و سرفصل‌های ارائه شده
        </p>
      </div>

      {/* Course Syllabus Table */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            سرفصل دوره‌ها
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-400 shadow-lg">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border border-gray-400 px-6 py-4 text-right font-bold text-lg">
                    شماره
                  </th>
                  <th className="border border-gray-400 px-6 py-4 text-right font-bold text-lg">
                    عنوان دوره
                  </th>
                  <th className="border border-gray-400 px-6 py-4 text-right font-bold text-lg">
                    مدرس
                  </th>
                  <th className="border border-gray-400 px-6 py-4 text-right font-bold text-lg">
                    آخرین ترم ارائه
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}?from=syllabus`}
                    className="contents"
                  >
                    <tr className="hover:bg-blue-100 transition-colors cursor-pointer border-b-2 border-gray-200 group">
                      <td className="border border-gray-400 px-6 py-4 text-center text-gray-800 font-bold text-lg bg-gray-50 group-hover:bg-blue-200">
                        {index + 1}
                      </td>
                      <td className="border border-gray-400 px-6 py-4 text-lg font-medium text-gray-800 group-hover:text-blue-800">
                        {course.title}
                      </td>
                      <td className="border border-gray-400 px-6 py-4 text-center text-gray-700 group-hover:text-blue-700">
                        {course.instructor}
                      </td>
                      <td className="border border-gray-400 px-6 py-4 text-center text-gray-600 group-hover:text-blue-600">
                        پاییز ۱۴۰۴
                      </td>
                    </tr>
                  </Link>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
