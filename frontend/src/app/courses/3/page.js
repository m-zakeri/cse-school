import MainLayout from "@/components/Layout/MainLayout";
import Link from "next/link";

export default function CourseDetails({ searchParams }) {
  const fromSyllabus = searchParams?.from === "syllabus";
  
  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          جزئیات دوره: برنامه نویسی شی گرا (جاوا)
        </h1>
        <p className="text-gray-600">
          اطلاعات کامل دوره برنامه نویسی شی گرا (جاوا)
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
              <p className="text-gray-700">برنامه نویسی شی گرا (جاوا)</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                نام درس به انگلیسی
              </h3>
              <p className="text-gray-700">
                Object-Oriented Programming (Java)
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
              <p className="text-gray-700">
                مبانی برنامه‌نویسی یا برنامه سازی ساخت یافته
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">هم نیازها</h3>
              <p className="text-gray-700">-</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">مطالب پیش نیاز</h3>
              <p className="text-gray-700">مفاهیم پایه برنامه نویسی</p>
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
          در این درس، مفاهیم برنامه‌نویسی شیءگرا در قالب زبان برنامه‌نویسی جاوا
          تدریس می‌شود. همچنین ویژگی‌های ذاتی زبان جاوا، امکانات برنامه‌سازی در
          جاوا، تفاوت رویکرد جاوا با زبان‌های مشابه در موارد مختلف، برنامه‌سازی
          همروند و کیفیت نرم‌افزار مورد توجه قرار می‌گیرد.
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
              آشنایی با مفاهیم پایه‌ای شی‌گرایی مانند کلاس، شیء، متد و ویژگی
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              درک اصول چهارگانه شی‌گرایی شامل کپسوله‌سازی، وراثت، چندریختی و
              انتزاع
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              توانایی طراحی و پیاده‌سازی کلاس‌ها و ارتباط بین آن‌ها در قالب
              پروژه‌های کوچک
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              آشنایی با مدیریت خطا و استثناها (Exception Handling) در جاوا
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              به‌کارگیری مجموعه‌ها (Collections) و انواع داده‌های پیشرفته در حل
              مسائل
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
              آشنایی با زبان جاوا و مفاهیم اولیه برنامه‌سازی در جاوا (۲ جلسه)
            </h3>
            <p className="text-gray-700">
              تاریخچه و ویژگی‌های زبان جاوا، متغیر، متد، شرط، حلقه، داده‌های
              اولیه (Primitive Data Types)، رشته، آرایه
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              مقدمه‌ای بر طراحی و برنامه‌سازی شیءگرا (۱ جلسه)
            </h3>
            <p className="text-gray-700">
              مفاهیم اولیه شیءگرایی، طرز تفکر و طراحی شیءگرا، رویکرد شیءگرا در
              مقابل سایر رویکردها، لفاف‌بندی، واسط، رده، بسته، دسترسی
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              برنامه‌سازی شیءگرا در جاوا (۴ جلسه)
            </h3>
            <p className="text-gray-700">
              نحوه تعریف کلاس‌ها، اشیاء در حافظه و مدیریت حافظه، بارگذاری اولیه
              و مرگ اشیاء در حافظه، زباله‌روب (Garbage Collector)، روش‌های ارسال
              پارامتر در زبان‌های مختلف و جاوا، سازنده، this، اعضای ایستا، بسته
              (package)، نمودار UML Class Diagram
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              وراثت (۱ جلسه)
            </h3>
            <p className="text-gray-700">
              مفهوم وراثت، Protected, abstract, super
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              چندریختی (۱ جلسه)
            </h3>
            <p className="text-gray-700">چندریختی با کمک وراثت، اعضای final</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              واسط (interface) (۱ جلسه)
            </h3>
            <p className="text-gray-700">
              کاربرد واسط، وراثت چندگانه با کمک واسط
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              مدیریت خطا و استثنا (۱ جلسه)
            </h3>
            <p className="text-gray-700">
              مدل سنتی مدیریت خطا، چارچوب مدیریت خطا در جاوا، مزایای این مدل،
              Finally, Runtime Exception
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              داده‌های عام (Generics) (۱ جلسه)
            </h3>
            <p className="text-gray-700">
              متدها و کلاس‌های عام، کاربردها، تولید و استفاده از کلاس‌های عام،
              کلاس‌های عام و وراثت
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              مجموعه‌ها و ظرف‌ها (Containers) (۱ جلسه)
            </h3>
            <p className="text-gray-700">
              ساختمان‌داده‌های موجود در جاوا، Colections, ArrayList, LinkedList,
              Set, Map, Iterator
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              فایل، جویبار و شبکه (۱ جلسه)
            </h3>
            <p className="text-gray-700">
              ورودی و خروجی در فایل، Serialization، برنامه‌سازی تحت شبکه
              (socket)
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              برنامه‌سازی همروند (۱ جلسه)
            </h3>
            <p className="text-gray-700">
              نیاز به همروندی، همروندی در جاوا، طول عمر یک thread، آشنایی اولیه
              با مفاهیم Synchronization و critical section
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Reflection (۱ جلسه)
            </h3>
            <p className="text-gray-700">
              نیاز به RTTI، RTTI در جاوا، کاربردها
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
              زبان برنامه‌نویسی
            </h3>
            <p className="text-gray-700">Java</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">محیط توسعه</h3>
            <p className="text-gray-700">IDE (IntelliJ IDEA, Eclipse, ...)</p>
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
            P. Deitel, H. Deitel. Java How to Program, Early Objects. 11th
            Edition, Pearson Education, 2017.
          </li>
          <li className="text-gray-700">
            B. Eckel. Thinking in Java. 4th Edition, Prentice Hall, 2006.
          </li>
          <li className="text-gray-700">
            M. Fowler, K. Beck, J. Brant, W. Opdyke, and D. Roberts.
            Refactoring: Improving the Design of Existing Code. Addison-Wesley,
            1999.
          </li>
          <li className="text-gray-700">
            K. Sierra, B. Bates, and T. Gee. Head First Java. 3rd Edition,
            O'Reilly Media, Inc, 2022.
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
