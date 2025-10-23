import MainLayout from "@/components/Layout/MainLayout";
import { micromasterPackages } from "@/data/sampleData";

export default function Micromaster() {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          بسته‌های میکرومستر
        </h1>
        <p className="text-gray-600">
          مجموعه‌ای از دوره‌های مرتبط برای کسب تخصص در حوزه‌های مختلف
        </p>
      </div>

      {/* Micromaster Packages */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {micromasterPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div
                className={`h-32 bg-gradient-to-r ${pkg.color} flex items-center justify-center`}
              >
                <h3 className="text-2xl font-bold text-white">{pkg.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 mb-2">دروس شامل:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {pkg.courses.map((course, index) => (
                      <li key={index}>• {course}</li>
                    ))}
                  </ul>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                  ثبت‌نام کنید
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            مزایای بسته‌های میکرومستر
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                تخصص عمیق
              </h3>
              <p className="text-gray-600 text-sm">
                کسب تخصص عمیق در یک حوزه خاص
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📜</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                گواهی ویژه
              </h3>
              <p className="text-gray-600 text-sm">دریافت گواهی میکرومستر</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                تخفیف ویژه
              </h3>
              <p className="text-gray-600 text-sm">
                تخفیف ۲۰٪ برای ثبت‌نام در بسته
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                پیشرفت شغلی
              </h3>
              <p className="text-gray-600 text-sm">افزایش فرصت‌های شغلی</p>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">پیش‌نیازها</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">
                پیش‌نیازهای عمومی
              </h3>
              <ul className="text-gray-700 space-y-1">
                <li>• آشنایی با مفاهیم پایه کامپیوتر</li>
                <li>• آشنایی با ریاضیات پایه</li>
                <li>• توانایی استفاده از کامپیوتر</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">پیش‌نیازهای خاص</h3>
              <ul className="text-gray-700 space-y-1">
                <li>• هر بسته پیش‌نیازهای خاص خود را دارد</li>
                <li>• در صفحه هر بسته ذکر شده است</li>
                <li>• امکان گذراندن پیش‌نیازها وجود دارد</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section>
        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            سوالی دارید؟
          </h2>
          <p className="text-gray-700 mb-6">
            در صورت نیاز به اطلاعات بیشتر در مورد بسته‌های میکرومستر، با ما تماس
            بگیرید
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors">
            تماس با ما
          </button>
        </div>
      </section>
    </MainLayout>
  );
}
