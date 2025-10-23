import MainLayout from "@/components/Layout/MainLayout";
import Link from "next/link";

export default function Terms() {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          شرایط و مقررات
        </h1>
        <p className="text-gray-600">
          قوانین و مقررات دوره‌های آموزشی دانشگاه امیرکبیر
        </p>
      </div>

      {/* General Regulations */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            مقررات عمومی
          </h2>
          <div className="prose max-w-none space-y-4">
            <p className="text-gray-700">
              شرکت در دوره‌های آموزشی دانشگاه امیرکبیر مستلزم رعایت قوانین و
              مقررات دانشگاه و دانشکده مهندسی کامپیوتر است. تمامی شرکت‌کنندگان
              موظف به رعایت این مقررات هستند.
            </p>
            <p className="text-gray-700">
              در صورت عدم رعایت مقررات، دانشگاه حق لغو ثبت‌نام و یا اخراج از
              دوره را دارد.
            </p>
          </div>
        </div>
      </section>

      {/* Course Structure */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ساختار دوره‌ها
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                دوره‌های تعاملی
              </h3>
              <ul className="text-gray-700 space-y-2">
                <li>• حضور در کلاس‌های آنلاین اجباری</li>
                <li>• مشارکت در بحث‌ها و پروژه‌ها</li>
                <li>• انجام تکالیف و پروژه‌های عملی</li>
                <li>• شرکت در آزمون‌های میان‌ترم و پایان‌ترم</li>
              </ul>
            </div>
            <div className="p-6 bg-green-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                دوره‌های غیرتعاملی
              </h3>
              <ul className="text-gray-700 space-y-2">
                <li>• دسترسی به محتوای آموزشی ضبط شده</li>
                <li>• مطالعه خودخوان و مستقل</li>
                <li>• انجام پروژه‌های عملی</li>
                <li>• شرکت در آزمون‌های آنلاین</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Transfer Policy */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            سیاست انتقال دوره
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border-r-4 border-yellow-400">
              <h3 className="font-bold text-gray-900 mb-2">
                انتقال به ترم بعد
              </h3>
              <p className="text-gray-700">
                در صورت عدم امکان شرکت در دوره، امکان انتقال به ترم بعد وجود
                دارد. این انتقال تنها یک بار امکان‌پذیر است.
              </p>
            </div>
            <div className="p-4 bg-red-50 border-r-4 border-red-400">
              <h3 className="font-bold text-gray-900 mb-2">لغو ثبت‌نام</h3>
              <p className="text-gray-700">
                لغو ثبت‌نام تا یک هفته قبل از شروع دوره امکان‌پذیر است. پس از
                این تاریخ، شهریه قابل بازگشت نیست.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Discount Codes */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">کدهای تخفیف</h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">تخفیف دانشجویی</h3>
              <p className="text-gray-700">
                دانشجویان دانشگاه امیرکبیر از ۲۰٪ تخفیف برخوردار هستند.
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">تخفیف گروهی</h3>
              <p className="text-gray-700">
                ثبت‌نام گروهی (بیش از ۵ نفر) شامل ۱۵٪ تخفیف است.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">تخفیف زودهنگام</h3>
              <p className="text-gray-700">
                ثبت‌نام تا یک ماه قبل از شروع دوره شامل ۱۰٪ تخفیف است.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exams */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            آزمون‌ها و ارزیابی
          </h2>
          <div className="space-y-6">
            <div>
              <p className="text-lg text-gray-900 mb-3">
                با توجه به طرح درس هر آموزش، متفاوت هست
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                شرایط قبولی
              </h3>
              <p className="text-gray-700">
                برای قبولی در دوره، کسب حداقل ۶۰٪ نمره کل الزامی است. در صورت
                عدم قبولی، امکان شرکت مجدد در دوره وجود دارد.
              </p>
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
            در صورت نیاز به توضیحات بیشتر در مورد مقررات، با ما تماس بگیرید
          </p>
          <Link
            href="/contact"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
          >
            تماس با ما
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
