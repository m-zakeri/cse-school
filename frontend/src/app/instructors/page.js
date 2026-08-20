import MainLayout from "@/components/Layout/MainLayout";
import InstructorCard from "@/components/InstructorCard";
import { instructors } from "@/data/sampleData";
import { UsersIcon, AcademicCapIcon, BuildingIcon } from "@/components/Icons";

export default function Instructors() {
  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
          <UsersIcon className="w-4 h-4 text-blue-600" />
          <span>کادر علمی و آموزشی</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          اساتید و اعضای هیئت علمی
        </h1>
        <p className="text-slate-600 text-sm">
          مدرسین برجسته و اعضای هیئت علمی دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر
        </p>
      </div>

      {/* Instructors Grid */}
      <section className="mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instructors.map((instructor) => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>
      </section>

      {/* Additional Faculty Info */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6">
          ترکیب کادر آموزشی دوره‌ها
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                اعضای هیئت علمی و اساتید مدعو
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                تدریس دوره‌ها توسط اعضای هیئت علمی دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر با تکیه بر استانداردهای آکادمیک بین‌المللی.
              </p>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <BuildingIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                متخصصان و منتورهای صنعتی
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                همراهی دستیاران آموزشی و منتورهای فعال در صنعت نرم‌افزار جهت هدایت پروژه‌های عملی و انتقال تجربیات بازار کار.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
