import MainLayout from "@/components/Layout/MainLayout";

export default function Calendar() {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">تقویم آموزشی</h1>
        <p className="text-gray-600">
          برنامه زمانی دوره‌های آموزشی دانشگاه امیرکبیر
        </p>
      </div>

      {/* Current Term */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ترم پاییز ۱۴۰۴
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                شروع ثبت‌نام
              </h3>
              <p className="text-gray-700">۱۵ خرداد ۱۴۰۴</p>
            </div>
            <div className="p-6 bg-green-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                پایان ثبت‌نام
              </h3>
              <p className="text-gray-700">۳۰ خرداد ۱۴۰۴</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                شروع کلاس‌ها
              </h3>
              <p className="text-gray-700">۱۰ تیر ۱۴۰۴</p>
            </div>
            <div className="p-6 bg-yellow-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                آزمون میان‌ترم
              </h3>
              <p className="text-gray-700">۱۵ مرداد ۱۴۰۴</p>
            </div>
            <div className="p-6 bg-red-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                آزمون پایان‌ترم
              </h3>
              <p className="text-gray-700">۳۰ مرداد ۱۴۰۴</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                پایان ترم
              </h3>
              <p className="text-gray-700">۱۰ شهریور ۱۴۰۴</p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Terms */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ترم‌های آینده
          </h2>
          <div className="space-y-6">
            <div className="p-6 bg-green-50 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                ترم پاییز ۱۴۰۴
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="text-gray-700">
                  <span className="font-bold">شروع ثبت‌نام:</span> ۱۵ شهریور
                  ۱۴۰۴
                </p>
                <p className="text-gray-700">
                  <span className="font-bold">شروع کلاس‌ها:</span> ۱۰ مهر ۱۴۰۴
                </p>
              </div>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                ترم زمستان ۱۴۰۴
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="text-gray-700">
                  <span className="font-bold">شروع ثبت‌نام:</span> ۱۵ دی ۱۴۰۴
                </p>
                <p className="text-gray-700">
                  <span className="font-bold">شروع کلاس‌ها:</span> ۱۰ بهمن ۱۴۰۴
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            تاریخ‌های مهم
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <h3 className="font-bold text-gray-900">
                  آخرین مهلت لغو ثبت‌نام
                </h3>
                <p className="text-gray-600">بدون کسر شهریه</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">۳ خرداد ۱۴۰۴</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <h3 className="font-bold text-gray-900">
                  آخرین مهلت لغو ثبت‌نام
                </h3>
                <p className="text-gray-600">با کسر ۵۰٪ شهریه</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">۱۰ خرداد ۱۴۰۴</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <h3 className="font-bold text-gray-900">
                  شروع کلاس‌های جبرانی
                </h3>
                <p className="text-gray-600">برای غایبین</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">۲۰ تیر ۱۴۰۴</p>
              </div>
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
            در صورت نیاز به اطلاعات بیشتر در مورد تقویم آموزشی، با ما تماس
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
