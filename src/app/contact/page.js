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

      {/* Contact Form */}
      {/* <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">ارسال پیام</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="نام خود را وارد کنید"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ایمیل
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ایمیل خود را وارد کنید"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                موضوع
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="موضوع پیام"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                پیام
              </label>
              <textarea
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="پیام خود را بنویسید"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
            >
              ارسال پیام
            </button>
          </form>
        </div>
      </section> */}

      {/* Office Hours */}
      {/* <section>
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">ساعات کاری</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                روزهای کاری
              </h3>
              <p className="text-gray-600">شنبه تا چهارشنبه: ۸:۰۰ - ۱۶:۰۰</p>
              <p className="text-gray-600">پنج‌شنبه: ۸:۰۰ - ۱۲:۰۰</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                کارشناس مسئول
              </h3>
              <p className="text-gray-600">خانم مریم احمدی</p>
              <p className="text-gray-600">کارشناس آموزش‌های تخصصی</p>
            </div>
          </div>
        </div>
      </section> */}
    </MainLayout>
  );
}
