import MainLayout from "@/components/Layout/MainLayout";

export default function CourseDetails({ searchParams }) {
  const fromSyllabus = searchParams?.from === "syllabus";
  
  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          جزئیات دوره: اصول و الگوها در مهندسی نرم‌افزار
        </h1>
        <p className="text-gray-600">
          اطلاعات کامل دوره اصول و الگوها در مهندسی نرم‌افزار
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
              <p className="text-gray-700">اصول و الگوها در مهندسی نرم‌افزار</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                نام درس به انگلیسی
              </h3>
              <p className="text-gray-700">
                Principles and Patterns in Software Engineering
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                رشته، گرایش، نوع و واحد درس
              </h3>
              <p className="text-gray-700">
                مهندسي کامپيوتر – نرم‌افزار، اختصاصی، 3 واحد
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">مقطع</h3>
              <p className="text-gray-700">کارشناسی ارشد</p>
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
                مفاهیم پایه مهندسی نرم‌افزار و برنامه‌سازی شی‎گرا به ویژه در
                زبان جاوا
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">سطح دوره</h3>
              <p className="text-gray-700">متوسط و پیشرفته</p>
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
          این درس دانش‌پذیران را با اصول و الگوهای طراحی و توسعه نرم‌افزار آشنا
          می‌کند. اصول مهندسی نرم‌افزار مانند قطب‌نما جهت درست ساخت سیستم را
          نشان می‌دهند و الگوهای طراحی ابزاری برای رسیدن به این اصول هستند. تخطی
          از اصول منجر به بوهای نرم‌افزار و بدهی فنی می‌شود؛ بنابراین شناخت درست
          الگوها، پادالگوها و روش‌های بازآرایی آنها محور اصلی این درس است.
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
              آشنایی با تفکر الگو-محور در مهندسی نرم‌افزار
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              یادگیری الگوهای پرکاربرد در طراحی و معماری نرم‌افزار
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              آشنایی با فنون تشخیص و اعمال خودکار الگوها
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
              مهندسان نرم‌افزار و برنامه‌نویسان شرکت‌های صنعتی
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
              مقدمه (1 جلسه)
            </h3>
            <ul className="space-y-1 text-gray-700 list-disc pr-5">
              <li>معنای اصول و الگوهای مهندسی نرم‌افزار</li>
              <li>معرفی منابع مهم در حوزه اصول و الگوها</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              اصول طراحی نرم‌افزار (2 جلسه)
            </h3>
            <ul className="space-y-1 text-gray-700 list-disc pr-5">
              <li>PHAME</li>
              <li>GRASP</li>
              <li>SOLID و سایر اصول طراحی</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              اصول مؤلفه و معماری (2 جلسه)
            </h3>
            <ul className="space-y-1 text-gray-700 list-disc pr-5">
              <li>اصول چسبندگی و اتصال مؤلفه‌ها</li>
              <li>متریک‌های سنجش چسبندگی و اتصال</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              الگوهای طراحی (8 جلسه)
            </h3>
            <ul className="space-y-1 text-gray-700 list-disc pr-5">
              <li>الگوهای تزریق وابستگی‌ها</li>
              <li>الگوهای آفرینشی</li>
              <li>الگوهای ساختاری</li>
              <li>الگوهای رفتاری</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              پادالگوها و بوهای طراحی (3 جلسه)
            </h3>
            <ul className="space-y-1 text-gray-700 list-disc pr-5">
              <li>بدهی فنی و بوهای طراحی بر اساس نقض اصول PHAME</li>
              <li>پژوهش‌های مرتبط با الگوها و پادالگوها</li>
              <li>بازآرایی و refactoring به سمت الگوهای صحیح</li>
            </ul>
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
        <ol className="space-y-3 text-sm list-decimal pr-5">
          <li className="text-gray-700">
            E. Gamma, R. Helm, R. Johnson, and J. Vlissides. Design Patterns,
            Addison-Wesley, 1995.
          </li>
          <li className="text-gray-700">
            Martin, Robert C. Clean Architecture, Prentice Hall, 2018.
          </li>
          <li className="text-gray-700">
            Suryanarayana, Girish., Samarthyam, Ganesh., Sharma, Tushar.
            Refactoring for Software Design Smells, Elsevier, 2014.
          </li>
          <li className="text-gray-700">
            Craig Larman. Applying UML and Patterns (2nd ed.), Prentice Hall,
            2001.
          </li>
          <li className="text-gray-700">
            J. Kerievsky. Refactoring to Patterns, Addison-Wesley, 2004.
          </li>
          <li className="text-gray-700">
            Fowler, M., &amp; Beck, K. Refactoring: Improving the Design of
            Existing Code (2nd ed.), Addison-Wesley, 2018.
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
            <span className="text-gray-700 mr-2">1.0</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!fromSyllabus && (
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
      )}
      {fromSyllabus && (
        <div className="mt-8 flex justify-center space-x-4 space-x-reverse">
          <a
            href="/syllabus"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-8 rounded-lg transition-colors"
          >
            بازگشت به سرفصل دوره‌ها
          </a>
        </div>
      )}
    </MainLayout>
  );
}
