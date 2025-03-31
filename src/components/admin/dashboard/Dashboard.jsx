import React, { useState, useEffect } from "react";
import {
  UserIcon,
  NewspaperIcon,
  PhotoIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import api from "../../../utils/api";
import { useCustomTheme } from "../../../context/ThemeContext";

const Dashboard = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    adCount: 0,
    storageCount: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const { mode } = useCustomTheme();
  const isDarkMode = mode === "dark";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get("/api/v1/admin/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats({
          userCount: response.data.userCount || 0,
          adCount: response.data.adCount || 0,
          storageCount: response.data.storageCount || 0,
          totalRevenue: response.data.totalRevenue || 0,
        });
      } catch (error) {
        console.error("İstatistikler yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      name: "Toplam Kullanıcı",
      value: loading ? "..." : stats.userCount,
      icon: UserIcon,
      color: "bg-blue-500",
    },
    {
      name: "Aktif İlanlar",
      value: loading ? "..." : stats.adCount,
      icon: NewspaperIcon,
      color: "bg-green-500",
    },
    {
      name: "Depolanan Dosyalar",
      value: loading ? "..." : stats.storageCount,
      icon: PhotoIcon,
      color: "bg-purple-500",
    },
    {
      name: "Toplam Kazanç",
      value: loading ? "..." : `${stats.totalRevenue}₺`,
      icon: CurrencyDollarIcon,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="space-y-6">
      <h1
        className={`text-2xl font-semibold ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Dashboard
      </h1>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className={`overflow-hidden rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } px-4 py-5 shadow sm:p-6`}
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt
                  className={`truncate text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {stat.name}
                </dt>
                <dd
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stat.value}
                </dd>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grafik ve Tablo Alanı */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div
          className={`rounded-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 shadow`}
        >
          <h2
            className={`text-lg font-medium ${
              isDarkMode ? "text-white" : "text-gray-900"
            } mb-4`}
          >
            Son Aktiviteler
          </h2>
          <div
            className={`overflow-hidden shadow ring-1 ${
              isDarkMode ? "ring-gray-700" : "ring-black ring-opacity-5"
            } md:rounded-lg`}
          >
            <table className="min-w-full divide-y divide-gray-300">
              <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th
                    className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold ${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    Kullanıcı
                  </th>
                  <th
                    className={`px-3 py-3.5 text-left text-sm font-semibold ${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    İşlem
                  </th>
                  <th
                    className={`px-3 py-3.5 text-left text-sm font-semibold ${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    Tarih
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDarkMode
                    ? "divide-gray-700 bg-gray-800"
                    : "divide-gray-200 bg-white"
                }`}
              >
                {loading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className={`py-4 text-center text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Yükleniyor...
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className={`py-4 text-center text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Aktivite verisi şu anda mevcut değil
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className={`rounded-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 shadow`}
        >
          <h2
            className={`text-lg font-medium ${
              isDarkMode ? "text-white" : "text-gray-900"
            } mb-4`}
          >
            Popüler İlanlar
          </h2>
          <div
            className={`overflow-hidden shadow ring-1 ${
              isDarkMode ? "ring-gray-700" : "ring-black ring-opacity-5"
            } md:rounded-lg`}
          >
            <table className="min-w-full divide-y divide-gray-300">
              <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th
                    className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold ${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    İlan
                  </th>
                  <th
                    className={`px-3 py-3.5 text-left text-sm font-semibold ${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    Sahip
                  </th>
                  <th
                    className={`px-3 py-3.5 text-left text-sm font-semibold ${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    Ziyaret
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDarkMode
                    ? "divide-gray-700 bg-gray-800"
                    : "divide-gray-200 bg-white"
                }`}
              >
                {loading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className={`py-4 text-center text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Yükleniyor...
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className={`py-4 text-center text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      İlan verisi şu anda mevcut değil
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
