"use client";

import { useEffect, useRef, useState } from "react";
import { apiGetCourseVideos, apiGetVideoPlayback, apiSaveVideoProgress } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { toPersianDigits } from "@/lib/formatters";
import {
  VideoCameraIcon,
  PlayCircleIcon,
  LockClosedIcon,
  CheckCircleIcon,
} from "@/components/Icons";

const SAVE_EVERY_MS = 10000;
// Don't bother resuming from the first seconds or the very end.
const RESUME_MIN = 5;

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
  const videoRef = useRef(null);
  const refreshAttempts = useRef(0);
  const lastSaved = useRef(0);

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

  // The section renders after the data arrives, so the browser's own anchor
  // jump (e.g. from the dashboard's "videos" link) has already missed it.
  useEffect(() => {
    if (ready && videos.length > 0 && window.location.hash === "#videos") {
      document.getElementById("videos")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [ready, videos.length]);

  // Remember where the student stopped. Guests (free previews) have no account to
  // save to; a failed save must never interrupt the lecture.
  const saveProgress = (video, force = false) => {
    const el = videoRef.current;
    if (!el || !video || !getCurrentUser()) return;
    const now = Date.now();
    if (!force && now - lastSaved.current < SAVE_EVERY_MS) return;
    lastSaved.current = now;
    const position = Math.floor(el.currentTime || 0);
    const duration = Number.isFinite(el.duration) ? Math.floor(el.duration) : null;
    if (position < 1) return;
    apiSaveVideoProgress(courseIdentifier, video.id, position, duration)
      .then((p) =>
        setVideos((list) =>
          list.map((v) =>
            v.id === video.id
              ? { ...v, progress_seconds: p.position_seconds, completed: p.completed }
              : v
          )
        )
      )
      .catch(() => {});
  };

  const handlePlay = async (video) => {
    if (activeId === video.id) {
      saveProgress(video, true);
      setActiveId(null);
      setPlayback(null);
      return;
    }
    if (activeId) {
      const previous = videos.find((v) => v.id === activeId);
      saveProgress(previous, true);
    }
    setLoadingId(video.id);
    setError("");
    refreshAttempts.current = 0;
    try {
      const data = await apiGetVideoPlayback(courseIdentifier, video.id);
      setActiveId(video.id);
      lastSaved.current = Date.now();
      const resumeAt =
        video.progress_seconds > RESUME_MIN && !video.completed ? video.progress_seconds : 0;
      setPlayback({ url: data.url, contentType: data.content_type, resumeAt });
    } catch (err) {
      setError(err.message || "پخش ویدیو ممکن نشد.");
    } finally {
      setLoadingId(null);
    }
  };

  // Playback links are short-lived. When one lapses mid-lecture the browser's
  // next range request is refused, so fetch a fresh link and resume from the
  // same second instead of leaving the student with a dead player.
  const handleVideoError = async () => {
    if (!activeId || refreshAttempts.current >= 2) {
      setError("پخش ویدیو با خطا مواجه شد. صفحه را بازخوانی کنید.");
      return;
    }
    refreshAttempts.current += 1;
    const resumeAt = videoRef.current?.currentTime || 0;
    try {
      const data = await apiGetVideoPlayback(courseIdentifier, activeId);
      setPlayback({ url: data.url, contentType: data.content_type, resumeAt });
    } catch (err) {
      setError(err.message || "پخش ویدیو ممکن نشد.");
    }
  };

  if (!ready || videos.length === 0) return null;

  const activeIndex = videos.findIndex((v) => v.id === activeId);
  const nextVideo = activeIndex >= 0 ? videos.slice(activeIndex + 1).find((v) => !v.locked) : null;
  const doneCount = videos.filter((v) => v.completed).length;

  return (
    <div
      id="videos"
      className="scroll-mt-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs print:hidden"
    >
      <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
        <VideoCameraIcon className="w-5 h-5 text-blue-600" />
        <span>ویدیوهای دوره</span>
        {doneCount > 0 && (
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
            {toPersianDigits(doneCount)} از {toPersianDigits(videos.length)} جلسه دیده شده
          </span>
        )}
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
                    {v.completed && (
                      <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold">
                        <CheckCircleIcon className="w-3 h-3" />
                        دیده شده
                      </span>
                    )}
                    {!v.completed && v.progress_seconds > RESUME_MIN && (
                      <span className="text-blue-600 font-semibold">
                        ادامه از {formatDuration(v.progress_seconds)}
                      </span>
                    )}
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
                        : !v.completed && v.progress_seconds > RESUME_MIN
                        ? "ادامه"
                        : "پخش"}
                    </span>
                  </button>
                )}
              </div>

              {isActive && playback && (
                <div className="px-3.5 pb-3.5">
                  <video
                    key={playback.url}
                    ref={videoRef}
                    onError={handleVideoError}
                    onTimeUpdate={() => saveProgress(v)}
                    onPause={() => saveProgress(v, true)}
                    onEnded={() => saveProgress(v, true)}
                    onLoadedMetadata={(e) => {
                      if (playback.resumeAt) e.currentTarget.currentTime = playback.resumeAt;
                    }}
                    controls
                    autoPlay
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full rounded-xl bg-black aspect-video"
                  >
                    <source src={playback.url} type={playback.contentType} />
                    مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                  </video>
                  {nextVideo && (
                    <button
                      type="button"
                      onClick={() => handlePlay(nextVideo)}
                      className="mt-2.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      جلسه بعدی: {nextVideo.title} ←
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
