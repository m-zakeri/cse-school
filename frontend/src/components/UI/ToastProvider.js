"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircleIcon, ShieldCheckIcon } from "@/components/Icons";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ title, message, type = "success", duration = 3500 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 6);
      const newToast = { id, title, message, type, duration };

      setToasts((prev) => [newToast, ...prev.slice(0, 4)]); // Max 5 toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast]
  );

  const toast = {
    success: (message, title = "عملیات موفق") =>
      addToast({ title, message, type: "success" }),
    error: (message, title = "خطا در عملیات") =>
      addToast({ title, message, type: "error" }),
    warning: (message, title = "توجه") =>
      addToast({ title, message, type: "warning" }),
    info: (message, title = "اطلاعیه") =>
      addToast({ title, message, type: "info" }),
    custom: addToast,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-5 left-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => {
          const typeStyles = {
            success: "bg-white border-emerald-200/90 text-slate-900 shadow-emerald-500/10",
            error: "bg-white border-red-200/90 text-slate-900 shadow-red-500/10",
            warning: "bg-white border-amber-200/90 text-slate-900 shadow-amber-500/10",
            info: "bg-white border-blue-200/90 text-slate-900 shadow-blue-500/10",
          };

          const iconStyles = {
            success: "bg-emerald-50 text-emerald-600 border-emerald-100",
            error: "bg-red-50 text-red-600 border-red-100",
            warning: "bg-amber-50 text-amber-600 border-amber-100",
            info: "bg-blue-50 text-blue-600 border-blue-100",
          };

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border shadow-xl transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in ${
                typeStyles[t.type] || typeStyles.info
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  iconStyles[t.type] || iconStyles.info
                }`}
              >
                {t.type === "success" ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : t.type === "error" ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <ShieldCheckIcon className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                {t.title && (
                  <h4 className="text-xs font-bold text-slate-900 mb-0.5">
                    {t.title}
                  </h4>
                )}
                <p className="text-xs text-slate-600 leading-snug">
                  {t.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-600 p-1 -mr-1 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
      custom: () => {},
    };
  }
  return ctx;
}
