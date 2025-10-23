import Link from "next/link";
import Image from "next/image";

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Course Image */}
      <div className="h-48 relative">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Icon overlay in corner */}
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-2">
          <div className="text-2xl">{course.icon}</div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4">
          <span className="font-medium">مدرس:</span> {course.instructor}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            href={`/courses/${course.id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors text-center block"
          >
            اطلاعات تکمیلی
          </Link>
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
            ثبت‌نام کنید
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
