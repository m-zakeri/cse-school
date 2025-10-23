import MainLayout from "@/components/Layout/MainLayout";
import InstructorCard from "@/components/InstructorCard";
import { instructors } from "@/data/sampleData";

export default function Instructors() {
  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">اساتید دوره</h1>
        <p className="text-gray-600">
          اساتید مجرب دانشکده مهندسی کامپیوتر دانشگاه امیرکبیر
        </p>
      </div>

      {/* Instructors Grid */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {instructors.map((instructor) => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>
      </section>

      {/* Additional Info */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">اساتید همکار</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">👨‍💼</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              اساتید مدعو
            </h3>
            <p className="text-gray-600 text-sm">
              اساتید مجرب از دانشگاه‌های معتبر کشور
            </p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              اساتید صنعتی
            </h3>
            <p className="text-gray-600 text-sm">
              متخصصان با تجربه از شرکت‌های برتر
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
