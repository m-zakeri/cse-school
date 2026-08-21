"use client";

import { useEffect } from "react";
import {
  ShieldCheckIcon,
  CheckCircleIcon,
} from "@/components/Icons";

export default function CustomModal({
  isOpen,
  type = "danger", // "danger" | "warning" | "success" | "info"
  title,
  message,
  confirmText = "تأیید",
  cancelText = "انصراف",
  isConfirm = true,
  onConfirm,
  onClose,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const iconColors = {
    danger: "bg-red-50 text-red-600 border-red-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    info: "bg-blue-50 text-blue-600 border-blue-100",
  };

  const confirmButtonColors = {
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20",
    warning: "bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-500/20",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20",
    info: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border ${
            iconColors[type] || iconColors.danger
          }`}
        >
          {type === "success" ? (
            <CheckCircleIcon className="w-8 h-8" />
          ) : (
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          )}
        </div>

        {/* Title & Message */}
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-2">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-3 border-t border-slate-100 justify-center">
          {isConfirm && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all order-2 sm:order-1"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all order-1 sm:order-2 ${
              confirmButtonColors[type] || confirmButtonColors.danger
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
