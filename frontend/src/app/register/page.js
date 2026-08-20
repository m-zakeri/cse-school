import MainLayout from "@/components/Layout/MainLayout";

export default function Register() {
  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ثبت‌نام</h1>
        <p className="text-gray-600">
          ثبت‌نام در دوره‌های آموزشی ترم پاییز ۱۴۰۴
        </p>
      </div>

      {/* Registration Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-center space-x-3 space-x-reverse mb-4">
          <div className="text-2xl">ℹ️</div>
          <h2 className="text-xl font-bold text-blue-900">اطلاعات مهم</h2>
        </div>
        <div className="text-blue-800 space-y-2">
          <p>
            • ثبت‌نام دوره‌های ترم تابستان ۱۴۰۴ از تاریخ ۱۵ خرداد آغاز می‌شود
          </p>
          <p>• آخرین مهلت ثبت‌نام: ۳۰ خرداد ۱۴۰۴</p>
          <p>• شروع کلاس‌ها: ۱۰ تیر ۱۴۰۴</p>
          <p>• برای ثبت‌نام نیاز به مدارک هویتی و تحصیلی دارید</p>
        </div>
      </div>

      {/* Registration Steps */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">مراحل ثبت‌نام</h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
              ۱
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                انتخاب دوره
              </h3>
              <p className="text-gray-600">
                دوره مورد نظر خود را از لیست دوره‌های موجود انتخاب کنید
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
              ۲
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                تکمیل فرم
              </h3>
              <p className="text-gray-600">
                فرم ثبت‌نام را با اطلاعات صحیح تکمیل کنید
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
              ۳
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                ارسال مدارک
              </h3>
              <p className="text-gray-600">مدارک مورد نیاز را آپلود کنید</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
              ۴
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                پرداخت شهریه
              </h3>
              <p className="text-gray-600">شهریه دوره را پرداخت کنید</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Selection */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">انتخاب دوره</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center space-x-3 space-x-reverse p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="course"
              value="python"
              className="text-blue-600"
            />
            <div>
              <h3 className="font-bold text-gray-900">برنامه‌سازی پایتون</h3>
              <p className="text-gray-600 text-sm">مدرس: دکتر احمد محمدی</p>
            </div>
          </label>
          <label className="flex items-center space-x-3 space-x-reverse p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="course"
              value="ml"
              className="text-blue-600"
            />
            <div>
              <h3 className="font-bold text-gray-900">یادگیری ماشین</h3>
              <p className="text-gray-600 text-sm">مدرس: دکتر فاطمه احمدی</p>
            </div>
          </label>
          <label className="flex items-center space-x-3 space-x-reverse p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="course"
              value="database"
              className="text-blue-600"
            />
            <div>
              <h3 className="font-bold text-gray-900">طراحی پایگاه داده</h3>
              <p className="text-gray-600 text-sm">مدرس: دکتر علی رضایی</p>
            </div>
          </label>
          <label className="flex items-center space-x-3 space-x-reverse p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="course"
              value="security"
              className="text-blue-600"
            />
            <div>
              <h3 className="font-bold text-gray-900">امنیت شبکه</h3>
              <p className="text-gray-600 text-sm">مدرس: دکتر مریم کریمی</p>
            </div>
          </label>
        </div>
      </div>

      {/* Registration Form */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">فرم ثبت‌نام</h2>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نام
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="نام خود را وارد کنید"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نام خانوادگی
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="نام خانوادگی خود را وارد کنید"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                کد ملی
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="کد ملی خود را وارد کنید"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شماره تماس
              </label>
              <input
                type="tel"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="شماره تماس خود را وارد کنید"
              />
            </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              سطح تحصیلات
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>انتخاب کنید</option>
              <option>دیپلم</option>
              <option>کاردانی</option>
              <option>کارشناسی</option>
              <option>کارشناسی ارشد</option>
              <option>دکتری</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رشته تحصیلی
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="رشته تحصیلی خود را وارد کنید"
            />
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <input type="checkbox" className="text-blue-600" />
            <span className="text-sm text-gray-700">
              با{" "}
              <a href="/terms" className="text-blue-600 hover:underline">
                شرایط و مقررات
              </a>{" "}
              موافقم
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
          >
            ثبت‌نام
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
