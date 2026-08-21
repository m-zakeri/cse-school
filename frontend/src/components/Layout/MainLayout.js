"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { ThemeProvider } from "@/components/UI/ThemeProvider";
import { ToastProvider } from "@/components/UI/ToastProvider";

export default function MainLayout({ children }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
          {/* Sidebar Navigation */}
          <Sidebar />

          {/* Main Content Area (Offset by sidebar width on desktop) */}
          <div className="flex-1 flex flex-col lg:mr-72 min-w-0">
            <Header />
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
              <div className="max-w-6xl mx-auto w-full">{children}</div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
              <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                <p>© سامانه آموزش‌های تخصصی دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر (پلی‌تکنیک تهران)</p>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  توسعه داده شده توسط <span className="text-slate-800 dark:text-slate-200 font-bold">حسین زارعی‌نژاد</span>
                </p>
              </div>
            </footer>
          </div>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
