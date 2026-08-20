import MainLayout from "@/components/Layout/MainLayout";
import Link from "next/link";

export default function CourseDetails({ searchParams }) {
  const fromSyllabus = searchParams?.from === "syllabus";
  
  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          جزئیات دوره: مهندسی نرم‌افزار
        </h1>
        <p className="text-gray-600">اطلاعات کامل دوره مهندسی نرم‌افزار</p>
      </div>

      {/* Course Information */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          اطلاعات کلی دوره
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">نام درس به فارسی</h3>
              <p className="text-gray-700">مهندسی نرم‌افزار</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                نام درس به انگلیسی
              </h3>
              <p className="text-gray-700">Software Engineering</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                رشته، گرایش، نوع و واحد درس
              </h3>
              <p className="text-gray-700">
                مهندسی کامپیوتر – نرم‌افزار، اختصاصی، 3 واحد
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">مقطع</h3>
              <p className="text-gray-700">کارشناسی</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">پیش نیازها</h3>
              <p className="text-gray-700">برنامه سازی پیشرفته</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">هم نیازها</h3>
              <p className="text-gray-700">-</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">مطالب پیش نیاز</h3>
              <p className="text-gray-700">
                مفاهیم پایه برنامه نویسی و توسعه نرم افزار
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">سطح دوره</h3>
              <p className="text-gray-700">مبتدی و متوسط</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Description */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          توضیح کوتاه درس
        </h2>
        <p className="text-gray-700 leading-relaxed">
          این درس به آموزش روش‌های مهندسی نرم‌افزار در تمام مراحل تولید و توسعه
          نرم‌افزار می‌پردازد. هدف آن، آموزش تولید نرم‌افزار به‌صورت مهندسی‌شده،
          شامل مدل‌سازی، اندازه‌گیری، ارزیابی کیفیت و فعالیت‌های پشتیبانی فرآیند
          مانند مدیریت پروژه، مدیریت ریسک، مدیریت پیکربندی و تضمین کیفیت است.
          تمرکز اصلی بر کاربرد این روش‌ها در مهندسی نرم‌افزار مدرن و تأثیر آن‌ها
          بر تولید نرم‌افزار با کیفیت است.
        </p>
      </div>

      {/* Course Objectives */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          اهداف و نتایج درس
        </h2>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              آشنایی با اصول و روش های مهندسی نرم افزار (مدرن)
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              آشنایی با طراحی و معماری نرم افزار
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              آشنایی با روش‌های توسعه (چابک) نرم‌افزار
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              آشنایی با مفاهیم کیفیت نرم‌افزار و روش های ارزیابی
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              توانایی مدیریت پیکربندی و تضمین کیفیت
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              کاربرد روش‌ها و ابزارهای مدرن مهندسی نرم‌افزار
            </span>
          </li>
        </ul>
      </div>

      {/* Target Audience */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">مخاطبین</h2>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              دانشجویان مهندسی و علوم کامپیوتر
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              مهندسین نرم‌افزار و برنامه‌نویسان شرکت‌های صنعتی
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              علاقه‌مندان به پژوهش در حوزه علوم کامپیوتر و نرم‌افزار
            </span>
          </li>
        </ul>
      </div>

      {/* Course Schedule */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          طول و زمان‌بندی دوره
        </h2>
        <p className="text-gray-700">
          2 ماه و نیم (10 هفته) – 8 هفته کلاس (24 ساعت – 16 جلسه) – 1 هفته
          جبرانی – 1 هفته ارزیابی
        </p>

        <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">
          شیوه برگزاری
        </h3>
        <p className="text-gray-700">
          ترکیبی (کلاس‌های مجازی + ارزیابی پایانی حضوری)
        </p>
      </div>

      {/* Course Syllabus */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          سرفصل‌ها و مباحث
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              آشنایی با مهندسی نرم افزار (مدرن)
            </h3>
            <p className="text-gray-700">
              مهندسی نرم‌افزار چیست؟ رویکردهای سنتی در برابر رویکردهای مدرن،
              تاریخچه مهندسی نرم‌افزار: مدل آبشاری، RUP، و آغاز جنبش چابک، اصول
              مهندسی نرم‌افزار مدرن
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              اصول مهندسی مدرن
            </h3>
            <p className="text-gray-700">
              مدیریت پیچیدگی: انتزاع، ماژولار بودن، کوپلینگ و چسبندگی، طراحی
              برای تغییرپذیری، تست به عنوان یک فعالیت طراحی: انواع تست، توسعه
              مبتنی بر تست (TDD)، بازخورد، جریان کاری و تکرارپذیری
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              تحویل مستمر و فرهنگ DevOps
            </h3>
            <p className="text-gray-700">
              یکپارچه‌سازی و تحویل مستمر (CI/CD)، پایپ لاین ایجاد (Build
              Pipelines): خودکارسازی، مراحل تست، ابزارها (Jenkins، GitHub
              Actions و...)، زیرساخت به‌عنوان کد (IaC): زیرساخت‌های غیرقابل
              تغییر، Docker، Kubernetes (آشنایی کلی)، استراتژی‌های استقرار
              نرم‌افزار، فرهنگ DevOps و همکاری بین تیم‌ها
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              معماری و طراحی در دنیای مدرن
            </h3>
            <p className="text-gray-700">
              معماری سازگار با تغییر: معماری مونولیت، میکروسرویس‌ها، مونوولیت
              ماژولار، مبانی طراحی مبتنی بر دامنه (DDD)، معماری تکاملی، قابلیت
              مشاهده و پایش‌پذیری سیستم: لاگ، مانیتورینگ، تریس و متریک‌ها، امنیت
              و تاب‌آوری سیستم‌ها: طراحی امن، مهندسی آشوب
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              روش‌های توسعه (چابک) نرم‌افزار
            </h3>
            <p className="text-gray-700">
              معرفی اجمالی XP و Kanban، معرفی متدولوژی SCRUM، چابکی در برابر
              مهندسی مدرن
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              روش‌های کاری و فرهنگ تیمی
            </h3>
            <p className="text-gray-700">
              مدیریت پروژه در برابر مهندسی نرم‌افزار، رویه‌های کاربردی توصیه شده
              (best practices)، جنبه های انسانی در مهندس نرم افزار مدرن
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              مسیر توسعه نرم افزار
            </h3>
            <p className="text-gray-700">
              مطالعه موردی در مهندسی مدرن: بررسی سیستم‌های واقعی یا گزارش‌های پس
              از بحران، مهندسی نرم افزار و تغییر و تحول های دنیای مدرن، اخلاق و
              پایداری در توسعه نرم‌افزار
            </p>
          </div>
        </div>
      </div>

      {/* Assignments and Grading */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          تکالیف و نمره‌دهی
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              تکالیف پیشنهادی
            </h3>
            <p className="text-gray-700">۲ تمرین تئوری و یک پروژه عملی</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              نمره‌دهی پیشنهادی
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">تکالیف تئوری:</span>
                <span className="font-bold text-gray-900">20%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">تکالیف عملی:</span>
                <span className="font-bold text-gray-900">30%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">آزمون‌ها:</span>
                <span className="font-bold text-gray-900">50%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* References */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">مراجع درس</h2>
        <ol className="space-y-3 text-sm">
          <li className="text-gray-700">
            David Farley, Modern Software Engineering: Doing what Works to Build
            Better Software Faster, Addison Wesley, 2021
          </li>
          <li className="text-gray-700">
            Jez Humble and David Farley, Continuous Delivery: Reliable Software
            Releases through Build, Test, and Deployment Automation,
            Addison-Wesley Professional, 2010
          </li>
          <li className="text-gray-700">
            K.S. Rubin. Essential Scrum: A Practical Guide to the Most Popular
            Agile Process. Addison-Wesley, 2012
          </li>
          <li className="text-gray-700">
            Mark Richards and Neal Ford. Fundamentals of Software Architecture,
            O'Reilly Media, 2020
          </li>
        </ol>
      </div>

      {/* Course Info Footer */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-bold text-gray-900">تهیه‌کننده:</span>
            <span className="text-gray-700 mr-2">معصومه طارمی راد</span>
          </div>
          <div>
            <span className="font-bold text-gray-900">نگارش:</span>
            <span className="text-gray-700 mr-2">۱.۰</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!fromSyllabus && (
        <div className="mt-8 flex justify-center space-x-4 space-x-reverse">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg transition-colors">
            ثبت‌نام در دوره
          </button>
          <Link
            href="/courses"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-8 rounded-lg transition-colors"
          >
            بازگشت به لیست دوره‌ها
          </Link>
        </div>
      )}
      {fromSyllabus && (
        <div className="mt-8 flex justify-center space-x-4 space-x-reverse">
          <Link
            href="/syllabus"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-8 rounded-lg transition-colors"
          >
            بازگشت به سرفصل دوره‌ها
          </Link>
        </div>
      )}
    </MainLayout>
  );
}
