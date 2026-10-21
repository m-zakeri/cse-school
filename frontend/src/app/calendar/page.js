"use client";

import { useEffect, useMemo, useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import Link from "next/link";
import { apiGetTerms } from "@/lib/api";
import { formatIsoRange, formatIsoShamsi } from "@/lib/jalali";
import { toPersianDigits } from "@/lib/formatters";
import { buildTermEvents, downloadTermIcs } from "@/lib/ics";
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  PhoneIcon,
} from "@/components/Icons";

/** The calendar entries of one term, in the order they happen. Missing dates are skipped. */
function buildEvents(term) {
  return [
    {
      key: "reg-start",
      label: "شروع فرآیند ثبت‌نام",
      value: formatIsoShamsi(term.registration_start),
      tone: "blue",
      icon: ClockIcon,
    },
    {
      key: "reg-end",
      label: "مهلت نهایی ثبت‌نام",
      value: formatIsoShamsi(term.registration_end),
      tone: "indigo",
      icon: ClockIcon,
    },
    {
      key: "start",
      label: "افتتاحیه و آغاز کلاس‌ها",
      value: formatIsoShamsi(term.start_date),
      tone: "emerald",
      icon: CheckCircleIcon,
    },
    {
      key: "makeup",
      label: "جلسات رفع اشکال و جبرانی",
      value: formatIsoRange(term.makeup_start, term.makeup_end),
      tone: "amber",
      icon: ClockIcon,
    },
    {
      key: "exam",
      label: "آزمون و ارزیابی پایانی",
      value: formatIsoRange(term.exam_start, term.exam_end),
      tone: "purple",
      icon: ClockIcon,
    },
    {
      key: "end",
      label: "پایان ترم",
      value: formatIsoShamsi(term.end_date),
      tone: "slate",
      icon: CheckCircleIcon,
    },
    {
      key: "cert",
      label: "صدور گواهینامه‌های رسمی",
      value: formatIsoShamsi(term.certificate_date),
      tone: "slate",
      icon: CheckCircleIcon,
    },
  ].filter((e) => e.value);
}

const TONES = {
  blue: "bg-blue-100 text-blue-600",
  indigo: "bg-indigo-100 text-indigo-600",
  emerald: "bg-emerald-100 text-emerald-600",
  amber: "bg-amber-100 text-amber-600",
  purple: "bg-purple-100 text-purple-600",
  slate: "bg-slate-200 text-slate-700",
};

function termPhase(term) {
  if (term.is_active) return { label: "ترم جاری — ثبت‌نام باز", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  const today = new Date().toISOString().slice(0, 10);
  if (term.start_date && term.start_date > today) {
    return { label: "ترم آتی", cls: "bg-blue-50 text-blue-700 border-blue-200" };
  }
  if (term.end_date && term.end_date < today) {
    return { label: "ترم گذشته", cls: "bg-slate-100 text-slate-600 border-slate-200" };
  }
  return { label: "ثبت‌نام بسته", cls: "bg-amber-50 text-amber-700 border-amber-200" };
}

export default function Calendar() {
  const [terms, setTerms] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [state, setState] = useState("loading"); // loading | ready | error

  useEffect(() => {
    apiGetTerms()
      .then((list) => {
        setTerms(list || []);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  // Default to the current term; fall back to the newest one.
  const selected = useMemo(() => {
    if (!terms.length) return null;
    return (
      terms.find((t) => t.id === selectedId) ||
      terms.find((t) => t.is_active) ||
      terms[0]
    );
  }, [terms, selectedId]);

  const events = selected ? buildEvents(selected) : [];
  const phase = selected ? termPhase(selected) : null;
  const others = terms.filter((t) => selected && t.id !== selected.id);

  return (
    <MainLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
          <CalendarIcon className="w-4 h-4 text-blue-600" />
          <span>زمان‌بندی و تقویم آموزشی</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          تقویم آموزشی و تاریخ‌های مهم
        </h1>
        <p className="text-slate-600 text-sm">
          برنامه زمانی فرآیند ثبت‌نام، برگزاری کلاس‌ها و ارزیابی پایان‌ترم دانشکده مهندسی کامپیوتر
        </p>
      </div>

      {state === "loading" && (
        <p className="text-xs text-slate-400 py-12 text-center">در حال بارگذاری تقویم آموزشی...</p>
      )}

      {state === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-xs rounded-2xl p-5 mb-8">
          دریافت تقویم آموزشی از سامانه ممکن نشد. لطفاً صفحه را مجدداً بارگذاری نمایید.
        </div>
      )}

      {state === "ready" && !selected && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-10 text-center text-sm text-slate-500 mb-10">
          هنوز ترمی در تقویم آموزشی تعریف نشده است.
        </div>
      )}

      {selected && (
        <>
          {/* Term switcher */}
          {terms.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-5 no-scrollbar">
              <span className="text-xs text-slate-400 font-medium shrink-0 ml-1">انتخاب ترم:</span>
              {terms.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedId(t.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    t.id === selected.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {t.title.replace(/^ترم\s+/, "")}
                  {t.is_active ? " (جاری)" : ""}
                </button>
              ))}
            </div>
          )}

          {/* Selected term */}
          <section className="mb-10">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    تقویم آموزشی {selected.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    مدرسه کامپیوتر امیرکبیر • {toPersianDigits(selected.course_count)} دوره
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${phase.cls}`}>
                  {phase.label}
                </span>
              </div>

              {events.length === 0 ? (
                <p className="text-sm text-slate-500 py-6 text-center">
                  تاریخ‌های این ترم هنوز اعلام نشده است.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.map((ev) => {
                    const Icon = ev.icon;
                    return (
                      <div
                        key={ev.key}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3"
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${TONES[ev.tone]}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-500 font-medium">{ev.label}</p>
                          <p className="text-sm font-bold text-slate-900 mt-0.5">{ev.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-3">
                {buildTermEvents(selected).length > 0 && (
                  <button
                    type="button"
                    onClick={() => downloadTermIcs(selected)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    افزودن تاریخ‌ها به تقویم گوشی یا رایانه (.ics)
                  </button>
                )}
                <Link
                  href={selected.is_active ? "/courses" : `/courses?term=${encodeURIComponent(selected.code)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800"
                >
                  مشاهده دوره‌های {selected.title}
                </Link>
              </div>
            </div>
          </section>

          {/* Other terms */}
          {others.length > 0 && (
            <section className="mb-10">
              <h2 className="text-lg font-bold text-slate-900 mb-6">ترم‌های دیگر</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {others.map((t) => {
                  const p = termPhase(t);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelectedId(t.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-right bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:border-blue-300 hover:shadow transition-all"
                    >
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${p.cls}`}>
                        {p.label}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-3 mb-2">{t.title}</h3>
                      <div className="space-y-2 text-xs text-slate-600">
                        {t.registration_start && (
                          <p>
                            شروع ثبت‌نام:{" "}
                            <span className="font-semibold text-slate-800">
                              {formatIsoShamsi(t.registration_start)}
                            </span>
                          </p>
                        )}
                        {t.start_date && (
                          <p>
                            آغاز کلاس‌ها:{" "}
                            <span className="font-semibold text-slate-800">
                              {formatIsoShamsi(t.start_date)}
                            </span>
                          </p>
                        )}
                        <p>
                          تعداد دوره‌ها:{" "}
                          <span className="font-semibold text-slate-800">
                            {toPersianDigits(t.course_count)}
                          </span>
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}

      {/* Support Card */}
      <section className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-8 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-base font-bold text-white mb-1">
            پرسشی درباره زمان‌بندی یا تداخل کلاس‌ها دارید؟
          </h3>
          <p className="text-xs text-slate-300">
            کارشناسان آموزش آماده راهنمایی شما جهت انتخاب بهینه دوره‌ها هستند.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-3 px-5 rounded-xl transition-all shrink-0"
        >
          <PhoneIcon className="w-4 h-4" />
          <span>تماس با دبیرخانه</span>
        </Link>
      </section>
    </MainLayout>
  );
}
