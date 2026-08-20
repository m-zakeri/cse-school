import MainLayout from "@/components/Layout/MainLayout";
import Link from "next/link";

export default function CourseDetails({ searchParams }) {
  const fromSyllabus = searchParams?.from === "syllabus";
  
  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          جزئیات دوره: یادگیری ماشین
        </h1>
        <p className="text-gray-600">اطلاعات کامل دوره یادگیری ماشین</p>
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
              <p className="text-gray-700">یادگیری ماشین</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                نام درس به انگلیسی
              </h3>
              <p className="text-gray-700">Machine Learning</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                رشته، گرایش، نوع و واحد درس
              </h3>
              <p className="text-gray-700">
                مهندسی کامپیوتر – هوش مصنوعی، اختصاصی، 3 واحد
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
              <p className="text-gray-700">داده کاوی یا بازیابی اطلاعات</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">هم نیازها</h3>
              <p className="text-gray-700">-</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">مطالب پیش نیاز</h3>
              <p className="text-gray-700">آمار و احتمال مهندسی و جبر خطی</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">سطح دوره</h3>
              <p className="text-gray-700">متوسط</p>
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
          هدف از مبحث یادگیری ماشین مطالعه الگوریتمهایی است که قادر به یادگیری
          از داده ها و تجربیات هستند. هر زمینه‌ای که در آن کاربر نیاز به درک و
          تحلیل داده ها دارد، یک حوزه بالقوه برای بکارگیری یادگیری ماشین است. در
          این درس مفاهیم یادگیری ماشین مطرح شده و جنبه های مهم عملی و نظری آن
          معرفی و تحلیل خواهد شد. در این درس به طور عمده رویکردهای یادگیری تحت
          نظارت و بدون نظارت مورد بحث قرار گرفته و در نهایت آشنایی مختصری با
          یادگیری تقویتی صورت خواهد گرفت.
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
            <span className="text-gray-700">آشنایی با مفهوم یادگیری ماشین</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              آشنایی با مدلهای اصلی یادگیری ماشین
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
              مهندسین علاقه مند به هوش مصنوعی، داده کاوی و یادگیری ماشین
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              علاقه‌مندان به پژوهش در حوزه هوش مصنوعی
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
          8 هفته کلاس درس (24 ساعت – 16 جلسه 90 دقیقه‌ای) + 1 هفته رفع اشکال و 1
          هفته ارزیابی (3 ساعت)
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
              مقدمات و مثالهای کاربردی
            </h3>
            <p className="text-gray-700">
              تحت نظارت (رگرسیون و دسته بندی)، بدون نظارت، تقویتی، انتقالی، فعال
              و ...
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              پیش پردازش داده‌ها
            </h3>
            <p className="text-gray-700">
              پاکسازی داده‌ها، مدیریت مقادیر گمشده و پرت، نرمال سازی
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              یادگیری تحت نظارت - رگرسیون
            </h3>
            <p className="text-gray-700">
              همبستگی، رگرسیون خطی، بایاس و واریانس، بیش برازش، گرادیان نزولی،
              رگرسیون غیر خطی و چند متغیره، رگرسیون منظم شده، مصالحه بایاس و
              واریانس، ارزیابی الگوریتمهای رگرسیون
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              یادگیری تحت نظارت – دسته بندی
            </h3>
            <p className="text-gray-700">
              نزدیکترین کا همسایه، ارزیابی الگوریتمهای دسته بندی، درخت تصمیم،
              شبکه های بیزین، رگرسیون لجستیکی، ماشین بردار پشتیبان، مدلهای تجمعی
              و ترکیبی
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              یادگیری بدون نظارت
            </h3>
            <p className="text-gray-700">
              تحلیل مولفه اصلی، خوشه بندی (مبتنی بر تقسیم فضا، چگالی، سلسله
              مراتبی و احتمالاتی)
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              یادگیری تقویتی
            </h3>
            <p className="text-gray-700">
              مقدمات و مثالهای کاربردی، توابع ارزش و کیفیت، یادگیری کیو
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
            <p className="text-gray-700">۲ تمرین تئوری و 2 پروژه عملی</p>
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
            Learning from data: a short course, Malik Magdon-Ismail and Yaser S.
            Abu-Mostafa, 2012
          </li>
          <li className="text-gray-700">
            Introduction to Machine Learning, Ethem Alpaydin, MIT Press, 2020
          </li>
          <li className="text-gray-700">
            Machine Learning: A Probabilistic Perspective, Kevin Murphy, MIT
            Press, 2013
          </li>
          <li className="text-gray-700">
            Pattern Recognition and Machine Learning, Christopher M. Bishop.
            Springer, 2006
          </li>
          <li className="text-gray-700">
            Machine Learning, Tom Mitchell, McGraw-Hill, 1997
          </li>
        </ol>
      </div>

      {/* Course Info Footer */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-bold text-gray-900">تهیه‌کننده:</span>
            <span className="text-gray-700 mr-2">احسان ناظرفرد</span>
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
