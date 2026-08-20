import MainLayout from "@/components/Layout/MainLayout";

export default function Contact() {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">تماس با ما</h1>
        <p className="text-gray-600">
          راه‌های ارتباط با تیم آموزش‌های تخصصی دانشگاه امیرکبیر
        </p>
      </div>

      {/* Contact Information */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              اطلاعات تماس
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="text-2xl ml-3">📧</div>
                <div>
                  <p className="font-bold text-gray-900">ایمیل</p>
                  <p className="text-gray-600">education@aut.ac.ir</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-2xl ml-3">📞</div>
                <div>
                  <p className="font-bold text-gray-900">تلفن</p>
                  <p className="text-gray-600">۰۲۱-۶۴۵۴۵۴۵۴</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-2xl ml-3">📍</div>
                <div>
                  <p className="font-bold text-gray-900">آدرس</p>
                  <p className="text-gray-600">
                    دانشکده مهندسی کامپیوتر
                    <br />
                    دانشگاه امیرکبیر، تهران
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              شبکه‌های اجتماعی
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="text-2xl ml-3">📱</div>
                <div>
                  <p className="font-bold text-gray-900">کانال تلگرام</p>
                  <p className="text-gray-600">@aut_education</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-2xl ml-3">🌐</div>
                <div>
                  <p className="font-bold text-gray-900">وب‌سایت دانشکده</p>
                  <p className="text-gray-600">ce.aut.ac.ir</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-2xl ml-3">🎓</div>
                <div>
                  <p className="font-bold text-gray-900">وب‌سایت دانشگاه</p>
                  <p className="text-gray-600">aut.ac.ir</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </MainLayout>
  );
}
