import MainLayout from "@/components/Layout/MainLayout";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/data/sampleData";

export default function Courses() {
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

      {/* Filter Section */}
      {/* <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">فیلتر دوره‌ها</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>همه دسته‌بندی‌ها</option>
            <option>برنامه‌سازی</option>
            <option>هوش مصنوعی</option>
            <option>پایگاه داده</option>
            <option>امنیت</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>همه سطوح</option>
            <option>مبتدی</option>
            <option>متوسط</option>
            <option>پیشرفته</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>همه مدرسین</option>
            <option>دکتر احمد محمدی</option>
            <option>دکتر فاطمه احمدی</option>
            <option>دکتر علی رضایی</option>
            <option>دکتر مریم کریمی</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
            اعمال فیلتر
          </button>
        </div>
      </div> */}

      {/* Courses Grid */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">دوره‌های موجود</h2>
          {/* <div className="flex items-center space-x-4 space-x-reverse">
            <span className="text-gray-600">مرتب‌سازی بر اساس:</span>
            <select className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>جدیدترین</option>
              <option>قدیمی‌ترین</option>
              <option>نام دوره</option>
              <option>مدرس</option>
            </select>
          </div> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Course Categories */}
      {/* <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          دسته‌بندی دوره‌ها
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              برنامه‌سازی
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              دوره‌های برنامه‌نویسی و توسعه نرم‌افزار
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              مشاهده دوره‌ها
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">هوش مصنوعی</h3>
            <p className="text-gray-600 text-sm mb-4">
              یادگیری ماشین و هوش مصنوعی
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              مشاهده دوره‌ها
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🗄️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              پایگاه داده
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              طراحی و مدیریت پایگاه‌های داده
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              مشاهده دوره‌ها
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">امنیت</h3>
            <p className="text-gray-600 text-sm mb-4">امنیت شبکه و سیستم‌ها</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              مشاهده دوره‌ها
            </button>
          </div>
        </div>
      </section> */}

      {/* Upcoming Courses */}
      {/* <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          دوره‌های آینده
        </h2>
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-md p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📅</div>
              <h3 className="text-lg font-bold mb-2">ترم پاییز ۱۴۰۴</h3>
              <p className="text-green-100 text-sm mb-4">
                شروع ثبت‌نام: ۱۵ شهریور
              </p>
              <button className="bg-white text-green-600 hover:bg-gray-100 py-2 px-4 rounded-lg transition-colors">
                اطلاع‌رسانی
              </button>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎓</div>
              <h3 className="text-lg font-bold mb-2">دوره‌های جدید</h3>
              <p className="text-green-100 text-sm mb-4">دوره‌های تخصصی جدید</p>
              <button className="bg-white text-green-600 hover:bg-gray-100 py-2 px-4 rounded-lg transition-colors">
                اطلاع‌رسانی
              </button>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="text-lg font-bold mb-2">مسابقات</h3>
              <p className="text-green-100 text-sm mb-4">
                مسابقات برنامه‌نویسی
              </p>
              <button className="bg-white text-green-600 hover:bg-gray-100 py-2 px-4 rounded-lg transition-colors">
                اطلاع‌رسانی
              </button>
            </div>
          </div>
        </div>
      </section> */}

      {/* Contact for More Info */}
      {/* <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">سوالی دارید؟</h2>
        <p className="text-gray-600 mb-6">
          در صورت نیاز به اطلاعات بیشتر در مورد دوره‌ها، با ما تماس بگیرید
        </p>
        <div className="flex justify-center space-x-4 space-x-reverse">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors">
            تماس با ما
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg transition-colors">
            سوالات متداول
          </button>
        </div>
      </div> */}
    </MainLayout>
  );
}
