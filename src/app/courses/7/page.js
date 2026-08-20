import MainLayout from "@/components/Layout/MainLayout";

export default function CourseDetails({ searchParams }) {
  const fromSyllabus = searchParams?.from === "syllabus";
  
  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          جزئیات دوره: اصول رایانش ابری
        </h1>
        <p className="text-gray-600">اطلاعات کامل دوره اصول رایانش ابری</p>
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
              <p className="text-gray-700">اصول رایانش ابری</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                نام درس به انگلیسی
              </h3>
              <p className="text-gray-700">Principles of Cloud Computing</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                رشته، گرایش، نوع و واحد درس
              </h3>
              <p className="text-gray-700">
                مهندسي کامپيوتر – معماری سیستم‌های کامپیوتر، اختصاصی، 3 واحد
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
                سیستم‌های عامل، شبکه‌های کامپیوتری
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">هم نیازها</h3>
              <p className="text-gray-700">-</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">مطالب پیش نیاز</h3>
              <p className="text-gray-700">
                مفاهیم پایه سیستم‌های عامل و شبکه‌های کامپیوتری
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
          آشنایی با مفاهیم اولیه رایانش ابری، زیرساخت ابر، معماری آن و نحوه
          ایجاد کاربردهای مبتنی بر ابر. دانش‌پذیران مفاهیم مجازی‌سازی سیستم،
          شبکه و ذخیره‌ساز را می‌آموزند و با ابزارها و سیستم‌های مهمی چون
          Kubernetes و OpenStack آشنا می‌شوند.
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
              آشنایی با مفاهیم پایه رایانش ابری
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              شناخت زیرساخت‌های ابری داخلی و خارجی
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              آشنایی با معماری مراکز داده و مفاهیم مجازی‌سازی
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">
              آشنایی با سیستم‌های کلیدی مانند Kubernetes و OpenStack
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
            <span className="text-gray-700">مهندسان زیرساخت رایانش ابری</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 ml-2">•</span>
            <span className="text-gray-700">مهندسان DevOps و SRE</span>
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
              مقدمه‌ای بر رایانش ابری
            </h3>
            <ul className="space-y-1 text-gray-700 list-disc pr-5">
              <li>اصول، مزایا و چالش‌های رایانش ابری</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              مقدمه‌ای بر مجازی‌سازی
            </h3>
            <ul className="space-y-1 text-gray-700 list-disc pr-5">
              <li>مدل ماشین مرجع و مجازی‌سازی سطح سخت‌افزار</li>
              <li>مجازی‌سازی سطح سیستم‌عامل (ظرف اجرایی)</li>
              <li>مجازی‌سازی شبکه و ذخیره‌ساز و نقش آن در رایانش ابری</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              آشنایی با کوبرنتیز و OpenStack
            </h3>
            <ul className="space-y-1 text-gray-700 list-disc pr-5">
              <li>مقدمه‌ای بر Kubernetes</li>
              <li>معماری OpenStack Nova و OpenStack Neutron</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              تحلیل داده بزرگ در رایانش ابری
            </h3>
            <ul className="space-y-1 text-gray-700 list-disc pr-5">
              <li>مدل برنامه‌سازی MapReduce</li>
              <li>مقدمه‌ای بر Apache Hadoop و Apache Spark</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              توزیع بار برای خوشه‌های وب
            </h3>
            <ul className="space-y-1 text-gray-700 list-disc pr-5">
              <li>توزیع بار پویا و آگاه از تداخل</li>
              <li>مقدمه‌ای بر مقیاس‌پذیری خودکار (auto-scaling)</li>
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
            <p className="text-gray-700">3 تمرین عملی و یک پروژه عملی</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              نمره‌دهی پیشنهادی
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">تکالیف عملی:</span>
                <span className="font-bold text-gray-900">30%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">پروژه عملی:</span>
                <span className="font-bold text-gray-900">20%</span>
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
            Mastering Cloud Computing: Foundations and Applications Programming,
            Rajkumar Buyya et al., 2013.
          </li>
          <li className="text-gray-700">
            Understanding Full Virtualization, Paravirtualization, and Hardware
            Assist, VMware white paper.
          </li>
          <li className="text-gray-700">
            Hadoop, The Definitive Guide, Tom White, 2015.
          </li>
          <li className="text-gray-700">
            The State of the Art in Locally Distributed Web-Server Systems,
            Colajanni et al., 2002.
          </li>
          <li className="text-gray-700">
            DIAL: Reducing Tail Latencies for Cloud Applications via Dynamic
            Interference-aware Load Balancing, Javadi &amp; Gandhi, ICAC 2017.
          </li>
        </ol>
      </div>

      {/* Course Info Footer */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-bold text-gray-900">تهیه‌کننده:</span>
            <span className="text-gray-700 mr-2">سید احمد جوادی</span>
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
