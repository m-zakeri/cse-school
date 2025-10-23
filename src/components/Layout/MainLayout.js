"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 grid grid-cols-12">
      {/* Sidebar - 2 columns */}
      <div className="col-span-2">
        <Sidebar />
      </div>

      {/* Main Content - 10 columns */}
      <div className="col-span-10">
        <Header />
        <main className="px-6 py-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
