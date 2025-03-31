import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  PhotoIcon,
  NewspaperIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useCustomTheme } from "../../../context/ThemeContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { mode } = useCustomTheme();
  const isDarkMode = mode === "dark";

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: HomeIcon },
    { name: "Kullanıcılar", href: "/admin/users", icon: UsersIcon },
    { name: "İlanlar", href: "/admin/ads", icon: NewspaperIcon },
    { name: "Depolama", href: "/admin/storage", icon: PhotoIcon },
  ];

  return (
    <>
      {/* Mobil kenar çubuğu */}
      <div className={`lg:hidden fixed inset-0 z-40 ${isOpen ? "" : "hidden"}`}>
        {/* Arkaplan overlay */}
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`fixed inset-y-0 left-0 flex w-64 flex-col ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <span
              className={`text-xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Admin Panel
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className={`rounded-md p-2 ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center rounded-md px-2 py-2 text-sm font-medium
                    ${
                      isActive
                        ? isDarkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-100 text-gray-900"
                        : isDarkMode
                        ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 h-6 w-6 flex-shrink-0
                      ${
                        isActive
                          ? isDarkMode
                            ? "text-gray-300"
                            : "text-gray-500"
                          : isDarkMode
                          ? "text-gray-400 group-hover:text-gray-300"
                          : "text-gray-400 group-hover:text-gray-500"
                      }
                    `}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Masaüstü kenar çubuğu */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div
          className={`flex min-h-0 flex-1 flex-col border-r ${
            isDarkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex h-16 items-center px-4">
            <span
              className={`text-xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Admin Panel
            </span>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center rounded-md px-2 py-2 text-sm font-medium
                    ${
                      isActive
                        ? isDarkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-100 text-gray-900"
                        : isDarkMode
                        ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 h-6 w-6 flex-shrink-0
                      ${
                        isActive
                          ? isDarkMode
                            ? "text-gray-300"
                            : "text-gray-500"
                          : isDarkMode
                          ? "text-gray-400 group-hover:text-gray-300"
                          : "text-gray-400 group-hover:text-gray-500"
                      }
                    `}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
