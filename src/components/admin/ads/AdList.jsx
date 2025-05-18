import React, { useState, useEffect, useMemo } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useCustomTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useNavigate } from "react-router-dom";

const AdList = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [adsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const isDarkMode = mode === "dark";
  const navigate = useNavigate();

  useEffect(() => {
    fetchAds();
    fetchCategories();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await api.get("/api/v1/admin/ads", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAds(response.data || []);
    } catch (error) {
      console.error("İlanlar yüklenirken hata oluştu:", error);
      toast.error("İlanlar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/v1/categories");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Kategoriler yüklenirken hata oluştu:", error);
    }
  };

  const handleDeleteAd = async (adId) => {
    if (window.confirm(t("admin.confirmDeleteAd"))) {
      try {
        const token = localStorage.getItem("accessToken");
        await api.delete(`/api/v1/admin/ads/${adId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // İlan listesini güncelle
        setAds((prevAds) => prevAds.filter((ad) => ad.id !== adId));
        toast.success(t("admin.adDeleted"));
      } catch (error) {
        console.error("İlan silinirken hata oluştu:", error);
        toast.error("İlan silinirken bir hata oluştu.");
      }
    }
  };

  const handleToggleStatus = async (ad) => {
    try {
      const token = localStorage.getItem("accessToken");
      const newStatus = !ad.isActive;

      await api.patch(
        `/api/v1/admin/ads/${ad.id}/status`,
        { isActive: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // İlan listesini güncelle
      setAds((prevAds) =>
        prevAds.map((item) =>
          item.id === ad.id ? { ...item, isActive: newStatus } : item
        )
      );

      toast.success(t("admin.statusUpdated"));
    } catch (error) {
      console.error("İlan durumu güncellenirken hata oluştu:", error);
      toast.error("İlan durumu güncellenirken bir hata oluştu.");
    }
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // CSV dışa aktarma fonksiyonu
  const exportToCSV = () => {
    try {
      // CSV başlıkları
      const headers = [
        "ID",
        t("admin.title"),
        t("admin.owner"),
        t("admin.category"),
        t("admin.status"),
        t("admin.date"),
      ];

      // İlan verilerini CSV formatına dönüştürme
      const adDataCSV = processedAds.map((ad) => {
        return [
          ad.id,
          ad.title,
          ad.userName,
          ad.categoryName,
          ad.isActive ? t("admin.active") : t("admin.inactive"),
          new Date(ad.createdAt).toLocaleDateString() || "-",
        ];
      });

      // CSV içeriğini oluştur
      const csvContent = [
        headers.join(","),
        ...adDataCSV.map((row) => row.join(",")),
      ].join("\n");

      // CSV dosyasını indirme
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `ads_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(t("admin.exportSuccess"));
    } catch (error) {
      console.error("CSV dışa aktarma hatası:", error);
      toast.error(t("admin.exportError"));
    }
  };

  // Arama, filtreleme ve sıralama işlemleri
  const processedAds = useMemo(() => {
    let result = [...ads];

    // Arama
    if (searchTerm) {
      const searchValue = searchTerm.toLowerCase();
      result = result.filter(
        (ad) =>
          ad.title?.toLowerCase().includes(searchValue) ||
          ad.descriptions?.toLowerCase().includes(searchValue) ||
          ad.userName?.toLowerCase().includes(searchValue)
      );
    }

    // Kategori filtresi
    if (selectedCategory) {
      result = result.filter((ad) => ad.categoryId === selectedCategory);
    }

    // Durum filtresi
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      result = result.filter((ad) => ad.isActive === isActive);
    }

    // Sıralama
    result.sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case "title":
          valueA = a.title?.toLowerCase() || "";
          valueB = b.title?.toLowerCase() || "";
          break;
        case "userName":
          valueA = a.userName?.toLowerCase() || "";
          valueB = b.userName?.toLowerCase() || "";
          break;
        case "categoryName":
          valueA = a.categoryName?.toLowerCase() || "";
          valueB = b.categoryName?.toLowerCase() || "";
          break;
        case "date":
          valueA = new Date(a.createdAt || 0);
          valueB = new Date(b.createdAt || 0);
          break;
        default:
          valueA = a[sortBy];
          valueB = b[sortBy];
      }

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [ads, searchTerm, selectedCategory, statusFilter, sortBy, sortOrder]);

  // Sayfalama
  const indexOfLastAd = currentPage * adsPerPage;
  const indexOfFirstAd = indexOfLastAd - adsPerPage;
  const currentAds = processedAds.slice(indexOfFirstAd, indexOfLastAd);
  const totalPages = Math.ceil(processedAds.length / adsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Dark mode için stillerimizi memoize edelim
  const styles = useMemo(() => {
    return {
      container: `space-y-6`,
      header: `flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6`,
      headerTitle: `text-2xl font-semibold ${
        isDarkMode ? "text-white" : "text-gray-900"
      }`,
      table: `min-w-full divide-y ${
        isDarkMode ? "divide-gray-700" : "divide-gray-300"
      }`,
      tableHead: `${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`,
      tableHeadCell: `py-3.5 pl-4 pr-3 text-left text-sm font-semibold ${
        isDarkMode ? "text-gray-200" : "text-gray-900"
      } cursor-pointer hover:bg-opacity-80`,
      tableBody: `divide-y ${
        isDarkMode ? "divide-gray-700 bg-gray-900" : "divide-gray-200 bg-white"
      }`,
      tableCell: `whitespace-nowrap py-4 pl-4 pr-3 text-sm ${
        isDarkMode ? "text-gray-300" : "text-gray-900"
      }`,
      searchInput: `block w-full rounded-md border-0 py-1.5 pl-10 pr-3 ${
        isDarkMode
          ? "bg-gray-800 text-white placeholder:text-gray-400 ring-1 ring-inset ring-gray-700 focus:ring-blue-500"
          : "text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600"
      } sm:text-sm sm:leading-6`,
      filterSelect: `rounded-md border-0 py-1.5 pl-3 pr-10 ${
        isDarkMode
          ? "bg-gray-800 text-white ring-1 ring-inset ring-gray-700 focus:ring-blue-500"
          : "text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-blue-600"
      } sm:text-sm sm:leading-6`,
      exportButton: `inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold ${
        isDarkMode
          ? "bg-green-600 text-white hover:bg-green-500"
          : "bg-green-600 text-white hover:bg-green-700"
      } shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600`,
      addButton: `inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold ${
        isDarkMode
          ? "bg-blue-600 text-white hover:bg-blue-500"
          : "bg-blue-600 text-white hover:bg-blue-700"
      } shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`,
      refreshButton: `inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold ${
        isDarkMode
          ? "bg-gray-600 text-white hover:bg-gray-500"
          : "bg-gray-600 text-white hover:bg-gray-700"
      } shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600`,
      actionButton: `flex items-center justify-center rounded-md p-2 ${
        isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
      } transition-colors duration-200`,
      paginationButton: (active) =>
        `relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
          active
            ? isDarkMode
              ? "bg-blue-600 text-white"
              : "bg-blue-600 text-white"
            : isDarkMode
            ? "text-gray-300 ring-1 ring-inset ring-gray-700 hover:bg-gray-700"
            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        }`,
      statusChip: (isActive) => {
        const bgColor = isActive
          ? isDarkMode
            ? "bg-green-900"
            : "bg-green-100"
          : isDarkMode
          ? "bg-red-900"
          : "bg-red-100";
        const textColor = isActive
          ? isDarkMode
            ? "text-green-200"
            : "text-green-800"
          : isDarkMode
          ? "text-red-200"
          : "text-red-800";
        return `inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${bgColor} ${textColor}`;
      },
      statusButton: (isActive) => {
        const textColor = isActive
          ? "text-red-600 hover:text-red-900"
          : "text-green-600 hover:text-green-900";
        return `${styles.actionButton} ${textColor}`;
      },
    };
  }, [isDarkMode]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>{t("admin.adManagement")}</h1>

        <div className="flex flex-wrap gap-3 md:flex-row w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className={`h-5 w-5 ${
                  isDarkMode ? "text-gray-400" : "text-gray-400"
                }`}
              />
            </div>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={t("admin.searchAds")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className={styles.filterSelect}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">{t("admin.allCategories")}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">{t("admin.allStatus")}</option>
            <option value="active">{t("admin.active")}</option>
            <option value="inactive">{t("admin.inactive")}</option>
          </select>

          <button
            className={styles.refreshButton}
            onClick={fetchAds}
            title={t("admin.refresh")}
          >
            <ArrowPathIcon className="h-5 w-5" />
            <span>{t("admin.refresh")}</span>
          </button>

          <button
            className={styles.exportButton}
            onClick={exportToCSV}
            title={t("admin.exportAds")}
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span>{t("admin.export")}</span>
          </button>

          <button
            className={styles.addButton}
            onClick={() => navigate("/admin/ads/create")}
            title={t("admin.createAd")}
          >
            <PlusCircleIcon className="h-5 w-5" />
            <span>{t("admin.createAd")}</span>
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden shadow ring-1 ${
          isDarkMode ? "ring-gray-700" : "ring-black ring-opacity-5"
        } rounded-lg`}
      >
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th
                className={styles.tableHeadCell}
                onClick={() => handleSortChange("title")}
              >
                <div className="flex items-center">
                  {t("admin.title")}
                  {sortBy === "title" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className={styles.tableHeadCell}
                onClick={() => handleSortChange("userName")}
              >
                <div className="flex items-center">
                  {t("admin.owner")}
                  {sortBy === "userName" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className={styles.tableHeadCell}
                onClick={() => handleSortChange("categoryName")}
              >
                <div className="flex items-center">
                  {t("admin.category")}
                  {sortBy === "categoryName" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className={styles.tableHeadCell}>{t("admin.status")}</th>
              <th
                className={`relative py-3.5 pl-3 pr-4 ${
                  isDarkMode ? "text-gray-200" : ""
                }`}
              >
                <span className="sr-only">{t("admin.actions")}</span>
              </th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className={`py-10 text-center ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {t("admin.loadingAds")}
                </td>
              </tr>
            ) : currentAds.length > 0 ? (
              currentAds.map((ad) => (
                <tr
                  key={ad.id}
                  className={
                    isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                  }
                >
                  <td className={styles.tableCell}>{ad.title}</td>
                  <td
                    className={`whitespace-nowrap px-3 py-4 text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {ad.userName}
                  </td>
                  <td
                    className={`whitespace-nowrap px-3 py-4 text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {ad.categoryName}
                  </td>
                  <td
                    className={`whitespace-nowrap px-3 py-4 text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    <span className={styles.statusChip(ad.isActive)}>
                      {ad.isActive ? t("admin.active") : t("admin.inactive")}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => window.open(`/ads/${ad.id}`, "_blank")}
                        className={`${styles.actionButton} text-blue-600`}
                        title={t("admin.view")}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/ads/${ad.id}`)}
                        className={`${styles.actionButton} text-yellow-600`}
                        title={t("admin.edit")}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(ad)}
                        className={styles.statusButton(ad.isActive)}
                        title={
                          ad.isActive
                            ? t("admin.makeInactive")
                            : t("admin.makeActive")
                        }
                      >
                        <span className="text-xs font-medium">
                          {ad.isActive
                            ? t("admin.deactivate")
                            : t("admin.activate")}
                        </span>
                      </button>
                      <button
                        onClick={() => handleDeleteAd(ad.id)}
                        className={`${styles.actionButton} text-red-600`}
                        title={t("admin.delete")}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className={`py-10 text-center ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {t("admin.noAdsFound")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <nav
            className={`isolate inline-flex -space-x-px rounded-md shadow-sm ${
              isDarkMode ? "bg-gray-800" : ""
            }`}
            aria-label="Pagination"
          >
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                isDarkMode
                  ? "text-gray-400 ring-1 ring-inset ring-gray-700"
                  : "text-gray-400 ring-1 ring-inset ring-gray-300"
              } ${
                currentPage === 1
                  ? "cursor-not-allowed"
                  : isDarkMode
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-50"
              }`}
            >
              <span className="sr-only">{t("admin.prev")}</span>
              &laquo;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={styles.paginationButton(currentPage === number)}
                >
                  {number}
                </button>
              )
            )}

            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                isDarkMode
                  ? "text-gray-400 ring-1 ring-inset ring-gray-700"
                  : "text-gray-400 ring-1 ring-inset ring-gray-300"
              } ${
                currentPage === totalPages
                  ? "cursor-not-allowed"
                  : isDarkMode
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-50"
              }`}
            >
              <span className="sr-only">{t("admin.next")}</span>
              &raquo;
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AdList;
