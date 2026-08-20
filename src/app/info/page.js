import MainLayout from "@/components/Layout/MainLayout";

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
              </h3>
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
    </MainLayout>
  );
}
