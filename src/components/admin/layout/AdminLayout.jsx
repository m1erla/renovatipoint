import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useCustomTheme } from "../../../context/ThemeContext";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { mode } = useCustomTheme();

  return (
    <div
      className={`min-h-screen ${
        mode === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Ana içerik alanı */}
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
