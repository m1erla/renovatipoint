import React, { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../../utils/api";
import { useCustomTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";

// MUI Icons
import PersonIcon from "@mui/icons-material/Person";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import PhotoIcon from "@mui/icons-material/Photo";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";

const Dashboard = () => {
  console.log("Dashboard component rendering");

  const [stats, setStats] = useState({
    userCount: 0,
    adCount: 0,
    storageCount: 0,
    totalRevenue: 0,
    userChange: 5.3, // Örnek değişim oranları (yüzde)
    adChange: 12.8,
    storageChange: -3.6,
    revenueChange: 8.2,
  });
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [popularAds, setPopularAds] = useState([]);
  const [error, setError] = useState(null);
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const isDarkMode = mode === "dark";

  const fetchStats = useCallback(async () => {
    try {
      console.log("Dashboard: Fetching stats...");
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      console.log(
        "Dashboard: Using token:",
        token ? "Token exists" : "No token"
      );

      // Fall back to mock data if API fails
      try {
        const response = await api.get("/api/v1/admin/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Dashboard: API response:", response.data);

        setStats((prevStats) => ({
          ...prevStats,
          userCount: response.data.userCount || 0,
          adCount: response.data.adCount || 0,
          storageCount: response.data.storageCount || 0,
          totalRevenue: response.data.totalRevenue || 0,
        }));
      } catch (apiError) {
        console.error("Dashboard: API error:", apiError);
        console.log("Dashboard: Using mock data instead");

        // Keep existing stats, don't update them from API
        // This allows the dashboard to show some data even if the API fails
      }

      // Always set activities and ads data (mock data)
      setActivities([
        {
          id: 1,
          user: "John Doe",
          action: t("admin.actionLogin"),
          date: "2023-06-15",
        },
        {
          id: 2,
          user: "Alice Smith",
          action: t("admin.actionCreateAd"),
          date: "2023-06-14",
        },
        {
          id: 3,
          user: "Bob Johnson",
          action: t("admin.actionUpdateProfile"),
          date: "2023-06-14",
        },
        {
          id: 4,
          user: "Emma Wilson",
          action: t("admin.actionContact"),
          date: "2023-06-13",
        },
        {
          id: 5,
          user: "Michael Brown",
          action: t("admin.actionPayment"),
          date: "2023-06-12",
        },
      ]);

      setPopularAds([
        { id: 1, title: "Ev Tadilatı", owner: "John Smith", visits: 158 },
        { id: 2, title: "Bahçe Düzenleme", owner: "Emma Davis", visits: 143 },
        {
          id: 3,
          title: "Mutfak Yenileme",
          owner: "Thomas Wilson",
          visits: 126,
        },
        {
          id: 4,
          title: "Banyo Dekorasyonu",
          owner: "Sophie Miller",
          visits: 112,
        },
        { id: 5, title: "Çatı Tamiri", owner: "Robert Johnson", visits: 98 },
      ]);
    } catch (error) {
      console.error("Dashboard: Error loading stats:", error);
      setError(t("admin.errorLoadingStats"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    console.log("Dashboard: Running useEffect");
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    {
      name: t("admin.stats.totalUsers"),
      value: loading ? "..." : stats.userCount,
      change: stats.userChange,
      icon: PersonIcon,
      color: "bg-blue-500",
      hoverColor: isDarkMode ? "hover:bg-blue-600" : "hover:bg-blue-400",
    },
    {
      name: t("admin.stats.activeAds"),
      value: loading ? "..." : stats.adCount,
      change: stats.adChange,
      icon: NewspaperIcon,
      color: "bg-green-500",
      hoverColor: isDarkMode ? "hover:bg-green-600" : "hover:bg-green-400",
    },
    {
      name: t("admin.stats.storedFiles"),
      value: loading ? "..." : stats.storageCount,
      change: stats.storageChange,
      icon: PhotoIcon,
      color: "bg-purple-500",
      hoverColor: isDarkMode ? "hover:bg-purple-600" : "hover:bg-purple-400",
    },
    {
      name: t("admin.stats.totalRevenue"),
      value: loading ? "..." : `${stats.totalRevenue}₺`,
      change: stats.revenueChange,
      icon: MonetizationOnIcon,
      color: "bg-yellow-500",
      hoverColor: isDarkMode ? "hover:bg-yellow-600" : "hover:bg-yellow-400",
    },
  ];

  // Memoize edilen stil değişkenleri
  const styles = useMemo(() => {
    return {
      title: `text-2xl font-semibold ${
        isDarkMode ? "text-white" : "text-gray-900"
      }`,
      card: `overflow-hidden rounded-lg ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } px-4 py-5 shadow-sm sm:p-6 transition-all duration-300 hover:shadow-lg ${
        isDarkMode ? "hover:bg-gray-750" : "hover:bg-gray-50"
      } border ${isDarkMode ? "border-gray-700" : "border-gray-100"}`,
      sectionCard: `rounded-lg ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } p-6 shadow-sm transition-all duration-300 hover:shadow-lg ${
        isDarkMode ? "hover:bg-gray-750" : "hover:bg-gray-50"
      } border ${isDarkMode ? "border-gray-700" : "border-gray-100"}`,
      sectionTitle: `text-lg font-medium ${
        isDarkMode ? "text-white" : "text-gray-900"
      } mb-4`,
      table: `min-w-full divide-y ${
        isDarkMode ? "divide-gray-700" : "divide-gray-200"
      }`,
      tableHead: isDarkMode ? "bg-gray-750" : "bg-gray-50",
      tableHeadCell: `py-3.5 pl-4 pr-3 text-left text-sm font-semibold ${
        isDarkMode ? "text-gray-200" : "text-gray-900"
      }`,
      tableBody: `divide-y ${
        isDarkMode ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"
      }`,
      tableCell: `px-3 py-4 text-sm ${
        isDarkMode ? "text-gray-300" : "text-gray-500"
      }`,
      tableLoading: `py-4 text-center text-sm ${
        isDarkMode ? "text-gray-400" : "text-gray-500"
      }`,
      iconWrapper: `flex-shrink-0 rounded-md p-3 transition-colors duration-200`,
    };
  }, [isDarkMode]);

  return (
    <div className="space-y-6">
      <h1 className={styles.title}>{t("admin.dashboard")}</h1>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" p={3}>
          <CircularProgress />
          <Typography variant="body1" ml={2}>
            {t("common.loading")}
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <>
          {/* İstatistik Kartları */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <div key={stat.name} className={styles.card}>
                <div className="flex items-center">
                  <div
                    className={`${styles.iconWrapper} ${stat.color} ${stat.hoverColor}`}
                  >
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
                      } flex items-center`}
                    >
                      {stat.value}
                      {stat.change && (
                        <span
                          className={`ml-2 flex items-center text-sm ${
                            stat.change > 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {stat.change > 0 ? (
                            <ArrowUpwardIcon className="mr-1 h-4 w-4" />
                          ) : (
                            <ArrowDownwardIcon className="mr-1 h-4 w-4" />
                          )}
                          {Math.abs(stat.change)}%
                        </span>
                      )}
                    </dd>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Grafik ve Tablo Alanı */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>{t("admin.activities")}</h2>
              <div
                className={`overflow-hidden shadow ring-1 ${
                  isDarkMode ? "ring-gray-700" : "ring-black ring-opacity-5"
                } md:rounded-lg`}
              >
                <table className={styles.table}>
                  <thead className={styles.tableHead}>
                    <tr>
                      <th className={styles.tableHeadCell}>
                        {t("admin.user")}
                      </th>
                      <th className={styles.tableHeadCell}>
                        {t("admin.action")}
                      </th>
                      <th className={styles.tableHeadCell}>
                        {t("admin.date")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
                    {activities.length > 0 ? (
                      activities.map((activity) => (
                        <tr key={activity.id}>
                          <td className={styles.tableCell}>{activity.user}</td>
                          <td className={styles.tableCell}>
                            {activity.action}
                          </td>
                          <td className={styles.tableCell}>{activity.date}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className={styles.tableLoading}>
                          {t("admin.noActivityData")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>{t("admin.popularAds")}</h2>
              <div
                className={`overflow-hidden shadow ring-1 ${
                  isDarkMode ? "ring-gray-700" : "ring-black ring-opacity-5"
                } md:rounded-lg`}
              >
                <table className={styles.table}>
                  <thead className={styles.tableHead}>
                    <tr>
                      <th className={styles.tableHeadCell}>{t("admin.ad")}</th>
                      <th className={styles.tableHeadCell}>
                        {t("admin.owner")}
                      </th>
                      <th className={styles.tableHeadCell}>
                        {t("admin.visits")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
                    {popularAds.length > 0 ? (
                      popularAds.map((ad) => (
                        <tr key={ad.id}>
                          <td
                            className={`px-3 py-4 text-sm font-medium ${
                              isDarkMode ? "text-gray-300" : "text-gray-900"
                            }`}
                          >
                            {ad.title}
                          </td>
                          <td className={styles.tableCell}>{ad.owner}</td>
                          <td className={styles.tableCell}>{ad.visits}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className={styles.tableLoading}>
                          {t("admin.noAdData")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
