import MainLayout from "@/components/Layout/MainLayout";
import { courses } from "@/data/sampleData";
import { notFound } from "next/navigation";

export default function CourseDetails({ params }) {
  const courseId = parseInt(params.id);
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    notFound();
  }

  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          جزئیات دوره: {course.title}
        </h1>
        <p className="text-gray-600">اطلاعات کامل دوره {course.title}</p>
      </div>

      {/* Course Information */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          اطلاعات کلی دوره
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">نام درس به فارسی</h3>
              <p className="text-gray-700">{course.title}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                نام درس به انگلیسی
              </h3>
              <p className="text-gray-700">{course.englishTitle}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                رشته، گرایش، نوع و واحد درس
              </h3>
              <p className="text-gray-700">
                {course.field}، {course.type}، {course.units}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">مقطع</h3>
              <p className="text-gray-700">{course.level}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">پیش نیازها</h3>
              <p className="text-gray-700">{course.prerequisites}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">هم نیازها</h3>
              <p className="text-gray-700">{course.corequisites || "-"}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">مطالب پیش نیاز</h3>
              <p className="text-gray-700">{course.prerequisiteTopics}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">سطح دوره</h3>
              <p className="text-gray-700">{course.courseLevel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Description */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          توضیح کوتاه درس
        </h2>
        <p className="text-gray-700 leading-relaxed">{course.description}</p>
      </div>

      {/* Course Schedule */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          طول و زمان‌بندی دوره
        </h2>
        <p className="text-gray-700">{course.duration}</p>

        <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">
          شیوه برگزاری
        </h3>
        <p className="text-gray-700">{course.deliveryMethod}</p>
      </div>

      {/* Course Info Footer */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-bold text-gray-900">مدرس:</span>
            <span className="text-gray-700 mr-2">{course.instructor}</span>
          </div>
          <div>
            <span className="font-bold text-gray-900">آیکون:</span>
            <span className="text-gray-700 mr-2">{course.icon}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center space-x-4 space-x-reverse">
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg transition-colors">
          ثبت‌نام در دوره
        </button>
        <a
          href="/courses"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-8 rounded-lg transition-colors"
        >
          بازگشت به لیست دوره‌ها
        </a>
      </div>
    </MainLayout>
  );
}
