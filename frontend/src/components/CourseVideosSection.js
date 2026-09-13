"use client";

import { useEffect, useState } from "react";
import { apiGetCourseVideos, apiGetVideoPlayback } from "@/lib/api";
import { toPersianDigits } from "@/lib/formatters";
import {
  VideoCameraIcon,
  PlayCircleIcon,
  LockClosedIcon,
} from "@/components/Icons";

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return null;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${toPersianDigits(m)}:${toPersianDigits(String(s).padStart(2, "0"))}`;
}

export default function CourseVideosSection({ courseIdentifier }) {
  const [videos, setVideos] = useState([]);
  const [ready, setReady] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [playback, setPlayback] = useState(null); // { url, content_type }
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    apiGetCourseVideos(courseIdentifier)
      .then((list) => {
        if (alive && Array.isArray(list)) setVideos(list);
      })
      .catch(() => {
        // No backend (static site) or none defined yet — just hide the section.
      })
      .finally(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, [courseIdentifier]);

  const handlePlay = async (video) => {
    if (activeId === video.id) {
      setActiveId(null);
      setPlayback(null);
      return;
    }
    setLoadingId(video.id);
    setError("");
    try {
      const data = await apiGetVideoPlayback(courseIdentifier, video.id);
      setActiveId(video.id);
      setPlayback({ url: data.url, contentType: data.content_type });
    } catch (err) {
      setError(err.message || "پخش ویدیو ممکن نشد.");
    } finally {
      setLoadingId(null);
    }
  };

  if (!ready || videos.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs print:hidden">
      <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
        <VideoCameraIcon className="w-5 h-5 text-blue-600" />
        <span>ویدیوهای دوره</span>
      </h2>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">
        فیلم جلسات این دوره. مشاهده کامل ویدیوها پس از ثبت‌نام در دوره امکان‌پذیر
        است.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-xs">
          {error}
        </div>
      )}

      <div className="space-y-2.5">
        {videos.map((v, idx) => {
          const duration = formatDuration(v.duration_seconds);
          const isActive = activeId === v.id;
          return (
            <div
              key={v.id}
              className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 overflow-hidden"
            >
              <div className="flex items-center gap-3 p-3.5">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                  {toPersianDigits(idx + 1)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                    {v.title}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    {duration && <span>{duration}</span>}
                    {v.is_free_preview && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        پیش‌نمایش رایگان
                      </span>
                    )}
                  </div>
                </div>

                {v.locked ? (
                  <span className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                    <LockClosedIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">ویژه ثبت‌نام‌شدگان</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePlay(v)}
                    disabled={loadingId === v.id}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 disabled:opacity-50 shrink-0"
                  >
                    <PlayCircleIcon className="w-4 h-4" />
                    <span>
                      {loadingId === v.id
                        ? "در حال بارگذاری..."
                        : isActive
                        ? "بستن"
                        : "پخش"}
                    </span>
                  </button>
                )}
              </div>

              {isActive && playback && (
                <div className="px-3.5 pb-3.5">
                  <video
                    key={playback.url}
                    controls
                    autoPlay
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full rounded-xl bg-black aspect-video"
                  >
                    <source src={playback.url} type={playback.contentType} />
                    مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                  </video>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
