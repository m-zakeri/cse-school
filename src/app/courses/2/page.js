import MainLayout from "@/components/Layout/MainLayout";

export default function CourseDetails() {
  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          جزئیات دوره: آزمون و تضمین کیفیت نرم‌افزار
        </h1>
        <p className="text-gray-600">
          اطلاعات کامل دوره آزمون و تضمین کیفیت نرم‌افزار
        </p>
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
              <p className="text-gray-700">آزمون و تضمین کیفیت نرم‌افزار</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                نام درس به انگلیسی
              </h3>
              <p className="text-gray-700">
                Software Testing and Quality Assurance
              </p>
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
              <p className="text-gray-700">برنامه‌نویسی شی‌گرا</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">هم نیازها</h3>
              <p className="text-gray-700">مهندسی نرم‌افزار</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">مطالب پیش نیاز</h3>
              <p className="text-gray-700">
                مفاهیم پایه مهندسی نرم‌افزار و برنامه‌نویسی
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
          تولید محصول نرم‌افزاری موفق و کم‌ هزینه، نیازمند بکاربست روش‌های
          سیستماتیک آزمون و تضمین کیفیت نرم‌افزار است. در این درس، شرکت‌کنندگان
          با اصول، فنون و ابزارهای آزمون کارکردی نرم‌افزار (functional testing)،
          آزمون‌پذیری نرم‌افزار و فرآیند مدیریت پروژه آزمون و تضمین کیفیت
          نرم‌افزار آشنا می‌شوند.
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
              آشنایی با مفاهیم پایه‌ای آزمون نرم‌افزار
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              آشنایی با انواع و سطوح آزمون نرم‌افزار
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              آشنایی با روش‌های سیستماتیک طراحی و ارزیابی آزمون
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              آشنایی با ابزارهای خودکارسازی آزمون نرم‌افزار
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              توانایی مدیریت و اجرای پروژه‌های آزمون و تضمین کیفیت نرم‌افزار
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              آشنایی با زمینه‌های پژوهشی در آزمون نرم‌افزار
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
              مقدمه (2 جلسه)
            </h3>
            <p className="text-gray-700">
              اهمیت و جایگاه آزمون کارکردی، تعاریف و واژه‌شناسی آزمون، انواع و
              سطوح آزمون (مدل V)
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              آزمون پیوسته و چابک (4 جلسه)
            </h3>
            <p className="text-gray-700">
              طراحی آزمون مدل‌رانده، آزمون‌پذیری، خودکارسازی آزمون و چهارچوب‌های
              خودکارسازی، توسعه آزمون‌رانده (Test-driven development)
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              طراحی و ارزیابی سیستماتیک آزمون به شیوه مدل‌رانده (5 جلسه)
            </h3>
            <p className="text-gray-700">
              معیارهای کفایت آزمون و طراحی آزمون مبتنی بر معیار، طراحی آزمون
              مبتنی بر افراز فضای ورودی، طراحی آزمون مبتنی بر گراف، طراحی آزمون
              مبتنی بر منطق، طراحی آزمون مبتنی بر نحو
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              آزمون واسط کاربری گرافیکی (GUI) (2 جلسه)
            </h3>
            <p className="text-gray-700">
              آزمون رابط کاربری گرافیکی و ابزارهای مربوطه
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              آزمون فازی و شناسایی آسیب‌پذیری‌ها (2 جلسه)
            </h3>
            <p className="text-gray-700">
              آزمون فازی و روش‌های شناسایی آسیب‌پذیری‌ها
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              مدیریت پروژه‌های آزمون (1 جلسه)
            </h3>
            <p className="text-gray-700">
              نوشتن طرح آزمون و پیاده‌سازی آزمون، دوگان آزمون، آزمون بازگشت،
              سروش آزمون
            </p>
          </div>
        </div>
      </div>

      {/* Software Tools */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          نرم‌افزار‌ها و ابزارهای مورد بحث
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              ابزارهای تست
            </h3>
            <p className="text-gray-700">JUnit, NUnit, PyTest</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              تحلیل کیفیت کد
            </h3>
            <p className="text-gray-700">SonarQube</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              تولید خودکار تست
            </h3>
            <p className="text-gray-700">EvoSuite, Randoop</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">آزمون فازی</h3>
            <p className="text-gray-700">AFL, DeepFuzz</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              تست رابط کاربری
            </h3>
            <p className="text-gray-700">Selenium</p>
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
            <p className="text-gray-700">تعداد 4 عدد تکلیف</p>
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
            P. Ammann and J. Offutt. Introduction to Software Testing. 2nd
            Edition, Cambridge University Press, 2017.
          </li>
          <li className="text-gray-700">
            P. C. Jorgensen and B. DeVries. Software Testing: A Craftsman's
            Approach. 5th Edition, CRC Press, 2021.
          </li>
          <li className="text-gray-700">
            R. Bierig, S. Brown, E. Galván, and J. Timoney. Essentials of
            Software Testing. Cambridge University Press, 2021.
          </li>
        </ol>
      </div>

      {/* Course Info Footer */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-bold text-gray-900">تهیه‌کننده:</span>
            <span className="text-gray-700 mr-2">مرتضی ذاکری</span>
          </div>
          <div>
            <span className="font-bold text-gray-900">نگارش:</span>
            <span className="text-gray-700 mr-2">۲.۰</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center space-x-4 space-x-reverse">
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg transition-colors">
          ثبت‌نام در دوره
        </button>
        <a
          href="/courses"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-8 rounded-lg transition-colors"
        >
          بازگشت به لیست دوره‌ها
        </a>
      </div>
    </MainLayout>
  );
}
