import MainLayout from "@/components/Layout/MainLayout";
import Link from "next/link";
import { courses } from "@/data/sampleData";

export default function Info() {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          اطلاعات تکمیلی
        </h1>
        <p className="text-gray-600">
          اطلاعات جامع درباره دوره‌های آموزشی و خدمات ارائه شده
        </p>
      </div>

      {/* FAQ Section */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            سوالات متداول
          </h2>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                زمان‌بندی ترم‌ها چگونه است؟
              </h3>س
              <p className="text-gray-700">
                ترم‌های آموزشی در سه دوره پاییز، بهار و تابستان برگزار می‌شود.
                هر ترم شامل 8 هفته کلاس درس و 2 هفته ارزیابی است.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                شیوه برگزاری دوره‌ها چگونه است؟
              </h3>
              <p className="text-gray-700">
                دوره‌ها به صورت ترکیبی (کلاس‌های مجازی + ارزیابی پایانی حضوری)
                برگزار می‌شود. کلاس‌ها به صورت آنلاین و ارزیابی‌ها حضوری است.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                آیا گواهی رسمی ارائه می‌شود؟
              </h3>
              <p className="text-gray-700">
                بله، پس از اتمام موفقیت‌آمیز دوره، گواهی رسمی از دانشگاه
                امیرکبیر به دانشجویان اعطا می‌شود.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                پیش‌نیازهای دوره‌ها چیست؟
              </h3>
              <p className="text-gray-700">
                هر دوره پیش‌نیازهای خاص خود را دارد که در صفحه جزئیات هر دوره به
                طور کامل ذکر شده است.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Syllabus Table */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            سرفصل دوره‌ها
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-400 shadow-lg">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border border-gray-400 px-6 py-4 text-right font-bold text-lg">
                    شماره
                  </th>
                  <th className="border border-gray-400 px-6 py-4 text-right font-bold text-lg">
                    عنوان دوره
                  </th>
                  <th className="border border-gray-400 px-6 py-4 text-right font-bold text-lg">
                    مدرس
                  </th>
                  <th className="border border-gray-400 px-6 py-4 text-right font-bold text-lg">
                    آخرین ترم ارائه
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="contents"
                  >
                    <tr className="hover:bg-blue-100 transition-colors cursor-pointer border-b-2 border-gray-200 group">
                      <td className="border border-gray-400 px-6 py-4 text-center text-gray-800 font-bold text-lg bg-gray-50 group-hover:bg-blue-200">
                        {index + 1}
                      </td>
                      <td className="border border-gray-400 px-6 py-4 text-lg font-medium text-gray-800 group-hover:text-blue-800">
                        {course.title}
                      </td>
                      <td className="border border-gray-400 px-6 py-4 text-center text-gray-700 group-hover:text-blue-700">
                        {course.instructor}
                      </td>
                      <td className="border border-gray-400 px-6 py-4 text-center text-gray-600 group-hover:text-blue-600">
                        پاییز ۱۴۰۴
                      </td>
                    </tr>
                  </Link>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Programming Competitions */}
      {/* <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            مسابقات برنامه‌نویسی
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-blue-800 mb-3">
                مسابقه برنامه‌نویسی دانشگاه امیرکبیر
              </h3>
              <p className="text-gray-700 mb-4">
                مسابقه سالانه برنامه‌نویسی برای دانشجویان و علاقه‌مندان
              </p>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>تاریخ:</strong> آذر ۱۴۰۴
                </p>
                <p>
                  <strong>مدت:</strong> 3 ساعت
                </p>
                <p>
                  <strong>ثبت‌نام:</strong> تا 15 آبان
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-green-800 mb-3">
                مسابقه الگوریتم و ساختار داده
              </h3>
              <p className="text-gray-700 mb-4">
                مسابقه تخصصی در زمینه الگوریتم‌ها و ساختارهای داده
              </p>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>تاریخ:</strong> دی ۱۴۰۴
                </p>
                <p>
                  <strong>مدت:</strong> 4 ساعت
                </p>
                <p>
                  <strong>ثبت‌نام:</strong> تا 20 آذر
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* AI Competitions */}
      {/* <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            مسابقات هوش مصنوعی
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-purple-800 mb-3">
                مسابقه یادگیری ماشین
              </h3>
              <p className="text-gray-700 mb-4">
                مسابقه در زمینه مدل‌سازی و پیش‌بینی با استفاده از یادگیری ماشین
              </p>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>تاریخ:</strong> بهمن ۱۴۰۴
                </p>
                <p>
                  <strong>مدت:</strong> 1 هفته
                </p>
                <p>
                  <strong>جوایز:</strong> تا 10 میلیون تومان
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-orange-800 mb-3">
                مسابقه پردازش زبان طبیعی
              </h3>
              <p className="text-gray-700 mb-4">
                مسابقه در زمینه پردازش متن و زبان فارسی
              </p>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>تاریخ:</strong> اسفند ۱۴۰۴
                </p>
                <p>
                  <strong>مدت:</strong> 2 هفته
                </p>
                <p>
                  <strong>جوایز:</strong> تا 15 میلیون تومان
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Contact Information */}
      {/* <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">اطلاعات تماس</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">راه‌های ارتباطی</h3>
              <div className="space-y-2">
                <p>
                  <strong>ایمیل:</strong> courses@aut.ac.ir
                </p>
                <p>
                  <strong>تلفن:</strong> 021-6454-2000
                </p>
                <p>
                  <strong>تلگرام:</strong> @aut_courses
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">ساعات کاری</h3>
              <div className="space-y-2">
                <p>
                  <strong>شنبه تا چهارشنبه:</strong> 8:00 - 16:00
                </p>
                <p>
                  <strong>پنج‌شنبه:</strong> 8:00 - 12:00
                </p>
                <p>
                  <strong>جمعه:</strong> تعطیل
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </MainLayout>
  );
}
