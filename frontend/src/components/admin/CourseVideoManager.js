"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  apiGetCourseVideos,
  apiUploadCourseVideo,
  apiUpdateCourseVideo,
  apiDeleteCourseVideo,
} from "@/lib/api";
import { toPersianDigits } from "@/lib/formatters";
import { VideoCameraIcon, TrashIcon } from "@/components/Icons";

function formatSize(bytes) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) return `${toPersianDigits((mb / 1024).toFixed(1))} گیگابایت`;
  return `${toPersianDigits(mb.toFixed(1))} مگابایت`;
}

const EMPTY_FORM = { title: "", order_index: "", is_free_preview: false };

export default function CourseVideoManager({ courseId }) {
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const fileInputRef = useRef(null);

  const refresh = useCallback(() => {
    apiGetCourseVideos(courseId)
      .then((list) => Array.isArray(list) && setVideos(list))
      .catch(() => {});
  }, [courseId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    if (!file) {
      setErr("ابتدا یک فایل ویدیویی انتخاب کنید.");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", form.title.trim() || file.name);
    fd.append(
      "order_index",
      String(Number(form.order_index) || videos.length + 1)
    );
    fd.append("is_free_preview", form.is_free_preview ? "true" : "false");

    setUploading(true);
    setProgress(0);
    try {
      await apiUploadCourseVideo(courseId, fd, setProgress);
      setMsg("ویدیو با موفقیت بارگذاری شد.");
      setForm(EMPTY_FORM);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      refresh();
    } catch (e2) {
      setErr(e2.message || "بارگذاری ویدیو ناموفق بود.");
    } finally {
      setUploading(false);
    }
  };

  const toggleFreePreview = async (v) => {
    try {
      await apiUpdateCourseVideo(courseId, v.id, {
        is_free_preview: !v.is_free_preview,
      });
      refresh();
    } catch (e2) {
      setErr(e2.message || "به‌روزرسانی ویدیو ناموفق بود.");
    }
  };

  const remove = async (v) => {
    if (!window.confirm(`ویدیوی «${v.title}» حذف شود؟`)) return;
    try {
      await apiDeleteCourseVideo(courseId, v.id);
      refresh();
    } catch (e2) {
      setErr(e2.message || "حذف ویدیو ناموفق بود.");
    }
  };

  return (
    <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60">
      <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
        <VideoCameraIcon className="w-4 h-4 text-blue-600" />
        <span>ویدیوهای دوره</span>
      </h3>
      <p className="text-[11px] text-slate-500 mb-4">
        فایل‌ها روی سرور فضای ذخیره‌سازی نگهداری می‌شوند و فقط برای دانشجویان
        ثبت‌نام‌شده قابل پخش هستند. گزینه «پیش‌نمایش رایگان» ویدیو را برای همه
        باز می‌کند.
      </p>

      {msg && (
        <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px]">
          {msg}
        </div>
      )}
      {err && (
        <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[11px]">
          {err}
        </div>
      )}

      {videos.length > 0 ? (
        <ul className="space-y-2 mb-4">
          {videos.map((v, i) => (
            <li
              key={v.id}
              className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
            >
              <span className="w-5 h-5 rounded bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                {toPersianDigits(i + 1)}
              </span>
              <span className="flex-1 min-w-0 truncate font-semibold text-slate-800">
                {v.title}
              </span>
              {v.size_bytes > 0 && (
                <span className="text-[10px] text-slate-400 shrink-0">
                  {formatSize(v.size_bytes)}
                </span>
              )}
              <label className="flex items-center gap-1 text-[10px] text-slate-500 shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={v.is_free_preview}
                  onChange={() => toggleFreePreview(v)}
                />
                رایگان
              </label>
              <button
                type="button"
                onClick={() => remove(v)}
                className="text-red-500 hover:text-red-700 shrink-0"
                aria-label="حذف ویدیو"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[11px] text-slate-400 mb-4">
          هنوز ویدیویی برای این دوره بارگذاری نشده است.
        </p>
      )}

      <form onSubmit={handleUpload} className="space-y-2.5">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-[11px] text-slate-600 file:ml-3 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:px-3 file:py-1.5 file:text-[11px] file:font-semibold"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="عنوان جلسه (اختیاری)"
            className="sm:col-span-2 p-2 bg-white border border-slate-200 rounded-lg text-[11px] outline-hidden focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="number"
            min="1"
            value={form.order_index}
            onChange={(e) => setForm({ ...form, order_index: e.target.value })}
            placeholder="ترتیب"
            className="p-2 bg-white border border-slate-200 rounded-lg text-[11px] outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_free_preview}
            onChange={(e) =>
              setForm({ ...form, is_free_preview: e.target.checked })
            }
          />
          پیش‌نمایش رایگان (بدون نیاز به ثبت‌نام)
        </label>

        {uploading && (
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-[11px] disabled:opacity-50"
        >
          {uploading
            ? `در حال بارگذاری... ${toPersianDigits(progress)}٪`
            : "بارگذاری ویدیو"}
        </button>
      </form>
    </div>
  );
}
