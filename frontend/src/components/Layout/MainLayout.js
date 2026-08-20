"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area (Offset by sidebar width on desktop) */}
      <div className="flex-1 flex flex-col lg:mr-72 min-w-0">
        <Header />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto w-full">{children}</div>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-slate-200/80 bg-white py-6 px-4 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© سامانه آموزش‌های تخصصی دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر (پلی‌تکنیک تهران)</p>
            <p className="text-slate-400">طراحی و توسعه با استانداردهای نوین وب</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
