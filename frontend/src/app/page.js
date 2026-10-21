"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MainLayout from "@/components/Layout/MainLayout";
import { apiGetCourses, apiGetTerms } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { useCurrentTerm } from "@/lib/terms";
import { formatIsoShamsi } from "@/lib/jalali";
import { getAssetPath, toPersianDigits } from "@/lib/formatters";
import {
  AcademicCapIcon,
  AwardIcon,
  CalendarIcon,
  ChevronLeftIcon,
  UserPlusIcon,
  BookOpenIcon,
  PlayCircleIcon,
  CheckCircleIcon,
} from "@/components/Icons";

const STEPS = [
  { icon: UserPlusIcon, title: "ایجاد حساب", text: "با کد ملی، ایمیل و شمارهٔ همراه در چند لحظه ثبت‌نام کنید." },
  { icon: BookOpenIcon, title: "انتخاب دوره", text: "از میان دوره‌های ترم جاری، دوره یا دوره‌های دلخواه را انتخاب کنید." },
  { icon: PlayCircleIcon, title: "مشاهدهٔ کلاس‌ها", text: "ویدیوی جلسات را در پرتال خود ببینید؛ پخش از همان جایی که ماندید ادامه پیدا می‌کند." },
  { icon: AwardIcon, title: "دریافت گواهینامه", text: "پس از پایان دوره و آزمون، گواهینامهٔ رسمی دوزبانه صادر می‌شود." },
];

// The secretariat opens registration by making a term current, so that is what the
// badge reports; the deadline is shown only while it still lies ahead.
function registrationStatus(term) {
  if (!term) return null;
  const today = new Date().toISOString().slice(0, 10);
  if (term.registration_end && term.registration_end >= today) {
    return { tone: "emerald", text: `ثبت‌نام باز است — تا ${formatIsoShamsi(term.registration_end)}` };
  }
  return { tone: "emerald", text: "ثبت‌نام باز است" };
}

const TONES = {
  emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-400/30",
  blue: "bg-blue-500/10 text-blue-200 border-blue-400/30",
  amber: "bg-amber-500/10 text-amber-200 border-amber-400/30",
};

export default function Home() {
  const { term, loading: termLoading } = useCurrentTerm();
  const [courses, setCourses] = useState([]);
  const [terms, setTerms] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
    apiGetCourses()
      .then((list) => setCourses(Array.isArray(list) ? list.slice(0, 3) : []))
      .catch(() => setCourses([]));
    apiGetTerms().then(setTerms).catch(() => setTerms([]));
  }, []);

  const status = registrationStatus(term);
  const upcoming = terms.filter((t) => !t.is_active && t.start_date && t.start_date > new Date().toISOString().slice(0, 10));

  return (
    <MainLayout>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-12 mb-10 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          {term && (
            <div className="inline-flex flex-wrap items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-200 text-xs font-semibold">
                <CalendarIcon className="w-4 h-4 text-blue-300" />
                {term.title}
              </span>
              {status && (
                <span className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${TONES[status.tone]}`}>
                  {status.text}
                </span>
              )}
            </div>
          )}
          {!term && !termLoading && (
            <span className="inline-block mb-5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs">
              ترم جاری هنوز اعلام نشده است
            </span>
          )}

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            مدرسه کامپیوتر امیرکبیر
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-8 mb-8">
            دوره‌های تخصصی و مهارت‌محور دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر،
            با تدریس اعضای هیئت علمی، کلاس‌های ضبط‌شده و گواهینامهٔ رسمی دوزبانه.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-600/30 transition-all"
            >
              <span>مشاهدهٔ دوره‌ها</span>
              <ChevronLeftIcon className="w-4 h-4" />
            </Link>
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-semibold py-3 px-6 rounded-xl transition-all"
              >
                <AcademicCapIcon className="w-4 h-4" />
                <span>پرتال من</span>
              </Link>
            ) : (
              <Link
                href="/login?tab=signup"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-semibold py-3 px-6 rounded-xl transition-all"
              >
                <UserPlusIcon className="w-4 h-4" />
                <span>ایجاد حساب و ثبت‌نام</span>
              </Link>
            )}
          </div>
        </div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      </section>

      {courses.length > 0 && (
        <section className="mb-12" aria-labelledby="featured-heading">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 id="featured-heading" className="text-xl font-bold text-slate-900">
                دوره‌های {term ? term.title : "ترم جاری"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">چند دورهٔ این ترم؛ فهرست کامل را در صفحهٔ دوره‌ها ببینید.</p>
            </div>
            <Link href="/courses" className="text-xs font-bold text-blue-600 hover:underline shrink-0">
              همهٔ دوره‌ها ←
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {courses.map((c) => (
              <Link
                key={c.id}
                href={`/courses/${c.course_number}`}
                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-200 transition-all"
              >
                <div className="relative h-36 bg-slate-100">
                  <Image
                    src={getAssetPath(c.image_url || "/photos/coursepic/SE.jpg")}
                    alt={c.title_fa}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {c.title_fa}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1.5 truncate">
                    {c.instructor?.name || "عضو هیئت علمی"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-12" aria-labelledby="how-heading">
        <h2 id="how-heading" className="text-xl font-bold text-slate-900 mb-5">
          مراحل ثبت‌نام و یادگیری
        </h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-bold text-slate-400">گام {toPersianDigits(i + 1)}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-6">{step.text}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
        <Link
          href="/calendar"
          className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-blue-300 hover:shadow transition-all"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            تقویم آموزشی
          </div>
          <p className="text-xs text-slate-600 leading-6">
            تاریخ ثبت‌نام، شروع کلاس‌ها، آزمون و صدور گواهینامه را ببینید و به تقویم گوشی خود اضافه کنید.
            {upcoming.length > 0 && ` ترم بعدی: ${upcoming[0].title}.`}
          </p>
        </Link>
        <Link
          href="/about"
          className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-blue-300 hover:shadow transition-all"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
            <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
            دربارهٔ مدرسه و گواهینامه
          </div>
          <p className="text-xs text-slate-600 leading-6">
            با اهداف مدرسه، اعضای هیئت علمی و اعتبار گواهینامهٔ دانشگاه صنعتی امیرکبیر آشنا شوید.
          </p>
        </Link>
      </section>
    </MainLayout>
  );
}
