import MainLayout from "@/components/Layout/MainLayout";
import Link from "next/link";

export default function CourseDetails({ searchParams }) {
  const fromSyllabus = searchParams?.from === "syllabus";
  
  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          جزئیات دوره: کارآفرینی
        </h1>
        <p className="text-gray-600">اطلاعات کامل دوره کارآفرینی</p>
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
              <p className="text-gray-700">کارآفرینی</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                نام درس به انگلیسی
              </h3>
              <p className="text-gray-700">Entrepreneurship</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                رشته، گرایش، نوع و واحد درس
              </h3>
              <p className="text-gray-700">
                مهندسي کامپيوتر – نرم‌افزار، اختیاری، 3 واحد
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
              <p className="text-gray-700">-</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">هم نیازها</h3>
              <p className="text-gray-700">مهندسی نرم‌افزار</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">مطالب پیش نیاز</h3>
              <p className="text-gray-700">
                مفاهیم پایه مهندسی نرم‌افزار و برنامه‌سازی
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
          این درس دانش‌پذیران را با اصول، واژگان و مفاهیم ایجاد کسب‌وکارهای
          نوآورانه و کارآفرینی آشنا می‌سازد. هدف دوره افزایش شانس موفقیت در
          راه‌اندازی، اجرا و رشد شرکت‌های نوآور است و چارچوبی علمی و عملی برای
          طی مسیر سرمایه‌گذاری فراهم می‌کند تا تیم‌های کسب‌وکار سریع‌تر به
          موفقیت برسند یا در صورت لزوم زودتر مسیر ناکارآمد را رها کنند.
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
              تشکیل تیم مکمل و ایجاد فرهنگ نوآوری
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              تحلیل بازار، انتخاب بازار ساحلی و شناسایی فرضیات جهشی
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              طراحی و ساخت MVP و اجرای چرخه Build-Measure-Learn با پذیرندگان
              اولیه
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              آزمایش A/B، شناسایی موتورهای رشد و طراحی مدل کسب‌وکار پایدار
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              مدیریت مالی، جذب سرمایه خطرپذیر و برنامه‌ریزی برای خروج موفق (IPO)
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
              دانشجویان رشته‌های مهندسی و علوم پایه
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              علاقه‌مندان به تأسیس کسب‌وکار و شرکت‌های نوآور
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              علاقه‌مندان به پژوهش در حوزه کارآفرینی
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
            <ul className="space-y-1 text-gray-700 list-disc pr-5">
              <li>آشنایی با تاریخچه، تعاریف و انواع کارآفرینی</li>
              <li>بینش‌های رایج اشتباه و محرک‌های کارآفرینی</li>
              <li>تفاوت‌های کارآفرینی با مدیریت و خوداشتغالی</li>
              <li>نمونه‌های موفق و شکست‌خورده کارآفرینی</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              چالش‌های کارآفرینی تیمی و انفرادی (2 جلسه)
            </h3>
            <ul className="space-y-1 text-gray-700 list-disc pr-5">
              <li>چالش‌های راه‌اندازی کسب‌وکار تیمی و مدل 3R</li>
              <li>چالش‌های راه‌اندازی کسب‌وکار انفرادی</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              بخش‌بندی و انتخاب بازار (2 جلسه)
            </h3>
            <ul className="space-y-1 text-gray-700 list-disc pr-5">
              <li>ماتریس بخش‌بندی بازار و پژوهش اولیه و ثانویه</li>
              <li>استفاده از هوش مصنوعی برای پژوهش در بازار</li>
              <li>انتخاب بازار ساحلی و برآورد TAM و درآمد</li>
              <li>ایجاد پروفایل مشتری در بازار ساحلی</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              تولید و پرورش ایده‌های کسب‌وکار (1 جلسه)
            </h3>
            <ul className="space-y-1 text-gray-700 list-disc pr-5">
              <li>متدولوژی Lean و شیوه‌های تفکر (محاسباتی، طراحی، داده‌ای)</li>
              <li>ایده‌پردازی با جعبه مورفولوژیکی، طوفان فکری و تضادها</li>
              <li>شناسایی رقبا و مزایای رقابتی</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              مدل کسب‌وکار و چارچوب قیمت‌گذاری (2 جلسه)
            </h3>
            <ul className="space-y-1 text-gray-700 list-disc pr-5">
              <li>انواع مدل‌های کسب‌وکار و طراحی مدل</li>
              <li>چارچوب‌های قیمت‌گذاری و عبور از شکاف</li>
              <li>چارچوب‌ها و روش‌های تبلیغات</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              اقتصاد مهندسی در کسب‌وکار (1 جلسه)
            </h3>
            <ul className="space-y-1 text-gray-700 list-disc pr-5">
              <li>ارزش زمانی پول، بهره ساده و مرکب</li>
              <li>جریان‌های مالی، نرخ تنزیل و نرخ بازگشت سرمایه</li>
              <li>نقطه سربه‌سر</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              شاخص‌های عملکرد کلیدی (KPIs) (2 جلسه)
            </h3>
            <ul className="space-y-1 text-gray-700 list-disc pr-5">
              <li>ارزش طول عمر مشتری (LTV) و نرخ نگهداشت/ریزش</li>
              <li>هزینه جذب مشتری (CoCA)، نرخ تبدیل و NPS</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              هوش مالی کسب‌وکار (3 جلسه)
            </h3>
            <ul className="space-y-1 text-gray-700 list-disc pr-5">
              <li>حسابداری نقدی و تعهدی و صورت‌های مالی استاندارد</li>
              <li>انواع استهلاک، سهام عادی و ممتاز و سود سهام</li>
              <li>ارزش‌گذاری کسب‌وکار</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              توسعه طرح کسب‌وکار و ارائه‌های آن (1 جلسه)
            </h3>
            <ul className="space-y-1 text-gray-700 list-disc pr-5">
              <li>چشم‌انداز و مأموریت، قالب‌های طرح‌های کسب‌وکار</li>
              <li>طراحی جداول و محاسبات طرح کسب‌وکار</li>
              <li>تهیه pitch deck و فنون جذب سرمایه‌گذار</li>
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
                <span className="text-gray-700">تکالیف میدانی:</span>
                <span className="font-bold text-gray-900">20%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">پروژه (طرح کسب‌وکار):</span>
                <span className="font-bold text-gray-900">40%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">آزمون پایانی:</span>
                <span className="font-bold text-gray-900">40%</span>
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
            Aulet, Bill. Disciplined Entrepreneurship: 24 Steps to a Successful
            Startup, Wiley, 2024.
          </li>
          <li className="text-gray-700">
            Wasserman, Noam. The Founder's Dilemmas, Princeton University Press,
            2013.
          </li>
          <li className="text-gray-700">
            Ries, Eric. The Lean Startup, Crown Business, 2011.
          </li>
          <li className="text-gray-700">
            Thiel, Peter., Masters, Blake. Zero to One, Crown, 2014.
          </li>
          <li className="text-gray-700">
            Read, Stuart., Sarasvathy, Saras D., Dew, Nick., Wiltbank, Robert.
            Effectual Entrepreneurship, Routledge, 2017.
          </li>
          <li className="text-gray-700">
            Nandan, H. Fundamentals of Entrepreneurship, PHI Learning, 2013.
          </li>
          <li className="text-gray-700">
            Bock, Laszlo. Work Rules!, Grand Central Publishing, 2022.
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
