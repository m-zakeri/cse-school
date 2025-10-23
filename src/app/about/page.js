import MainLayout from "@/components/Layout/MainLayout";
import Link from "next/link";

export default function About() {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">درباره مدرسه</h1>
        <p className="text-gray-600">
          معرفی «مدرسه پاییزه امیرکبیر» و مسیرهای آموزشی تخصصی
        </p>
      </div>

      {/* Introduction */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            معرفی مدرسه پاییزه امیرکبیر
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              «مدرسه پاییزه امیرکبیر» با هدف ارائه‌ی آموزش‌های به‌روز و
              مهارت‌محور در حوزه‌ی مهندسی کامپیوتر برگزار می‌شود. تمرکز اصلی
              برنامه، توانمندسازی فراگیران برای حل مسائل واقعی و ورود مؤثر به
              صنعت است.
            </p>
            <p className="text-gray-700 mb-4">
              سرفصل‌ها توسط اعضای هیئت‌علمی و مدرسان باتجربه‌ی دانشکده مهندسی
              کامپیوتر دانشگاه امیرکبیر طراحی و ارائه می‌شود و موضوعاتی همچون
              برنامه‌نویسی، هوش مصنوعی، مهندسی نرم‌افزار و علم داده را پوشش
              می‌دهد.
            </p>
            <p className="text-gray-700">
              در پایان هر مسیر آموزشی، گواهی معتبر دو زبانه از سوی دانشگاه
              امیرکبیر برای شرکت‌کنندگان واجد شرایط صادر می‌گردد.
            </p>
          </div>
        </div>
      </section>

      {/* Goals */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">اهداف برنامه</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              آموزش تخصصی
            </h3>
            <p className="text-gray-600 text-sm">
              ارائه‌ی دوره‌های عمیق و کاربردی در گرایش‌های کلیدی کامپیوتر
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              آمادگی شغلی
            </h3>
            <p className="text-gray-600 text-sm">
              پرورش مهارت‌های عملی برای ورود سریع‌تر و مؤثرتر به بازار کار
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              دسترسی منعطف
            </h3>
            <p className="text-gray-600 text-sm">
              بهره‌مندی از آموزش‌های آنلاین با دسترسی ساده برای همه‌ی مخاطبان
            </p>
          </div>
        </div>
      </section>

      {/* Regulations */}
      <section className="mb-12">
        <div className="bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            آیین‌نامه و مقررات
          </h2>
          <p className="text-gray-700 mb-6">
            برای آگاهی از ضوابط ثبت‌نام، شیوه‌ی برگزاری و قوانین مدرسه پاییزه
            امیرکبیر، لطفاً بخش «شرایط و مقررات» را مطالعه نمایید.
          </p>
          <Link
            href="/terms"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors inline-block"
          >
            مطالعه مقررات
          </Link>
        </div>
      </section>

      {/* Contact */}
      <section>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            سوالی دارید؟
          </h2>
          <p className="text-gray-600 mb-6">
            در صورت نیاز به اطلاعات بیشتر، با ما تماس بگیرید
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
            >
              تماس با ما
            </Link>
            <Link
              href="/info"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg transition-colors"
            >
              سوالات متداول
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
