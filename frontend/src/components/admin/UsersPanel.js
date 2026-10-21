"use client";

import { useCallback, useEffect, useState } from "react";
import { apiGetUsersAdmin, apiResetUserPassword, apiSetUserActive } from "@/lib/api";
import { toPersianDigits } from "@/lib/formatters";
import { UsersIcon, SearchIcon } from "@/components/Icons";

const ROLE_LABELS = { ADMIN: "مدیر", INSTRUCTOR: "استاد", STUDENT: "دانشجو" };

/**
 * Accounts: find a student, issue a temporary password for someone who forgot
 * theirs, or lock/unlock an account. The temporary password is shown once, here,
 * so the secretariat can pass it on; the student must replace it at next login.
 */
export default function UsersPanel({ currentUserId }) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [state, setState] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");
  const [issued, setIssued] = useState(null); // { full_name, temporary_password }
  const [copied, setCopied] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async (q) => {
    setState("loading");
    try {
      const list = await apiGetUsersAdmin(q);
      setUsers(Array.isArray(list) ? list : []);
      setState("ready");
    } catch (err) {
      setError(err.message || "دریافت فهرست کاربران ممکن نشد.");
      setState("error");
    }
  }, []);

  // Search as the admin types, without hammering the API on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => load(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query, load]);

  const resetPassword = async (user) => {
    if (
      !window.confirm(
        `برای «${user.full_name}» کلمه عبور موقت جدید صادر شود؟ کلمه عبور فعلی او از کار می‌افتد.`
      )
    ) {
      return;
    }
    setBusyId(user.id);
    setError("");
    try {
      const res = await apiResetUserPassword(user.id);
      setIssued(res);
      setCopied(false);
      setUsers((list) => list.map((u) => (u.id === user.id ? { ...u, must_change_password: true } : u)));
    } catch (err) {
      setError(err.message || "صدور کلمه عبور موقت ممکن نشد.");
    } finally {
      setBusyId(null);
    }
  };

  const toggleActive = async (user) => {
    setBusyId(user.id);
    setError("");
    try {
      const updated = await apiSetUserActive(user.id, !user.is_active);
      setUsers((list) => list.map((u) => (u.id === user.id ? { ...u, is_active: updated.is_active } : u)));
    } catch (err) {
      setError(err.message || "تغییر وضعیت حساب ممکن نشد.");
    } finally {
      setBusyId(null);
    }
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(issued.temporary_password);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm mb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <UsersIcon className="w-5 h-5 text-blue-600" />
          <span>حساب‌های کاربری ({toPersianDigits(users.length)})</span>
        </h2>
        <div className="relative">
          <SearchIcon className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="جستجوی کاربر"
            placeholder="نام، ایمیل، کد ملی یا شماره همراه..."
            className="w-full lg:w-80 pr-9 pl-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
          />
        </div>
      </div>

      {issued && (
        <div role="status" className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
          <p className="font-bold mb-2">
            کلمه عبور موقت «{issued.full_name}» صادر شد. این کلمه عبور فقط همین یک بار نمایش داده می‌شود.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <code className="px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-sm font-mono tracking-wider select-all dir-ltr">
              {issued.temporary_password}
            </code>
            <button
              type="button"
              onClick={copyPassword}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              {copied ? "کپی شد" : "کپی"}
            </button>
            <button
              type="button"
              onClick={() => setIssued(null)}
              className="px-3 py-1.5 rounded-lg bg-white border border-emerald-200 hover:bg-emerald-100 font-semibold"
            >
              بستن
            </button>
          </div>
          <p className="mt-2 text-emerald-800">
            آن را از راهی امن به دانشجو بدهید. دانشجو پس از ورود باید کلمه عبور جدید انتخاب کند.
          </p>
        </div>
      )}

      {error && (
        <div role="alert" className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      {state === "loading" && users.length === 0 ? (
        <p className="text-xs text-slate-400 py-10 text-center">در حال بارگذاری...</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-slate-500 py-10 text-center">کاربری با این مشخصات یافت نشد.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">نام</th>
                <th className="py-3 px-4">ایمیل و تماس</th>
                <th className="py-3 px-4">کد ملی</th>
                <th className="py-3 px-4 text-center">نقش</th>
                <th className="py-3 px-4 text-center">دوره‌ها</th>
                <th className="py-3 px-4 text-center">وضعیت</th>
                <th className="py-3 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const isSelf = u.id === currentUserId;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{u.full_name}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="font-mono dir-ltr text-right">{u.email}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.phone_number}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{toPersianDigits(u.national_id)}</td>
                    <td className="py-3 px-4 text-center">{ROLE_LABELS[u.role] || u.role}</td>
                    <td className="py-3 px-4 text-center">{toPersianDigits(u.enrollment_count)}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          u.is_active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                        }`}
                      >
                        {u.is_active ? "فعال" : "غیرفعال"}
                      </span>
                      {u.must_change_password && (
                        <span className="block mt-1 text-[10px] text-amber-600">رمز موقت</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                          type="button"
                          disabled={busyId === u.id}
                          onClick={() => resetPassword(u)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold disabled:opacity-50"
                        >
                          رمز موقت
                        </button>
                        {!isSelf && (
                          <button
                            type="button"
                            disabled={busyId === u.id}
                            onClick={() => toggleActive(u)}
                            className={`px-2.5 py-1.5 rounded-lg font-semibold disabled:opacity-50 ${
                              u.is_active
                                ? "bg-red-50 hover:bg-red-100 text-red-700"
                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {u.is_active ? "غیرفعال‌سازی" : "فعال‌سازی"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
