import MainLayout from "@/components/Layout/MainLayout";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            دوره مورد نظر یافت نشد
          </h2>
          <p className="text-gray-600 mb-8">
            متأسفانه دوره‌ای با این شناسه وجود ندارد.
          </p>
          <a
            href="/courses"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg transition-colors"
          >
            بازگشت به لیست دوره‌ها
          </a>
        </div>
      </div>
    </MainLayout>
  );
}
