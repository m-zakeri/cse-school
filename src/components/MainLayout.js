import Sidebar from "@/components/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 mr-80">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
