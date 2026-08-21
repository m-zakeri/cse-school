import { Suspense } from "react";
import CourseDetailClient from "./CourseDetailClient";

export async function generateStaticParams() {
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
    { id: "7" },
  ];
}

export default async function CourseDetailsPage({ params }) {
  const resolvedParams = await params;
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-slate-400">
          در حال بارگذاری...
        </div>
      }
    >
      <CourseDetailClient params={resolvedParams} />
    </Suspense>
  );
}
