import React, { useState, useEffect, useMemo } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  UserPlusIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useCustomTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const isDarkMode = mode === "dark";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await api.get("/api/v1/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data || []);
    } catch (error) {
      console.error("Kullanıcılar yüklenirken hata oluştu:", error);
      toast.error("Kullanıcılar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      try {
        const token = localStorage.getItem("accessToken");
        await api.delete(`/api/v1/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Kullanıcı listesini güncelle
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        toast.success("Kullanıcı başarıyla silindi.");
      } catch (error) {
        console.error("Kullanıcı silinirken hata oluştu:", error);
        toast.error("Kullanıcı silinirken bir hata oluştu.");
      }
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

  // Filtreleme, arama ve sıralama işlemleri
  const processedUsers = useMemo(() => {
    let result = [...users];

    // Arama
    if (searchTerm) {
      const searchValue = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchValue) ||
          user.surname?.toLowerCase().includes(searchValue) ||
          user.email?.toLowerCase().includes(searchValue) ||
          user.phoneNumber?.toLowerCase().includes(searchValue)
      );
    }

    // Rol filtresi
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Sıralama
    result.sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case "name":
          valueA = `${a.name} ${a.surname}`.toLowerCase();
          valueB = `${b.name} ${b.surname}`.toLowerCase();
          break;
        case "email":
          valueA = a.email.toLowerCase();
          valueB = b.email.toLowerCase();
          break;
        case "role":
          valueA = a.role.toLowerCase();
          valueB = b.role.toLowerCase();
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
  }, [users, searchTerm, roleFilter, sortBy, sortOrder]);

  // Sayfalama
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = processedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(processedUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // CSV dışa aktarma fonksiyonu
  const exportToCSV = () => {
    try {
      // CSV başlıkları
      const headers = [
        "ID",
        t("admin.name"),
        t("admin.email"),
        t("admin.phone"),
        t("admin.role"),
        t("admin.registrationDate"),
      ];

      // Kullanıcı verilerini CSV formatına dönüştürme
      const userDataCSV = processedUsers.map((user) => {
        return [
          user.id,
          `${user.name} ${user.surname}`,
          user.email,
          user.phoneNumber || "-",
          user.role,
          new Date(user.createdAt).toLocaleDateString() || "-",
        ];
      });

      // CSV içeriğini oluştur
      const csvContent = [
        headers.join(","),
        ...userDataCSV.map((row) => row.join(",")),
      ].join("\n");

      // CSV dosyasını indirme
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `users_export_${new Date().toISOString().split("T")[0]}.csv`
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
      addButton: `inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold ${
        isDarkMode
          ? "bg-blue-600 text-white hover:bg-blue-500"
          : "bg-blue-600 text-white hover:bg-blue-700"
      } shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`,
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
      roleChip: (role) => {
        let bgColor, textColor;
        if (role === "ADMIN") {
          bgColor = isDarkMode ? "bg-purple-900" : "bg-purple-100";
          textColor = isDarkMode ? "text-purple-200" : "text-purple-800";
        } else if (role === "EXPERT") {
          bgColor = isDarkMode ? "bg-blue-900" : "bg-blue-100";
          textColor = isDarkMode ? "text-blue-200" : "text-blue-800";
        } else {
          bgColor = isDarkMode ? "bg-green-900" : "bg-green-100";
          textColor = isDarkMode ? "text-green-200" : "text-green-800";
        }
        return `inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${bgColor} ${textColor}`;
      },
      exportButton: `inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold ${
        isDarkMode
          ? "bg-green-600 text-white hover:bg-green-500"
          : "bg-green-600 text-white hover:bg-green-700"
      } shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600`,
    };
  }, [isDarkMode]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>{t("admin.userManagement")}</h1>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
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
              placeholder={t("admin.searchUsers")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className={styles.filterSelect}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">{t("admin.allRoles")}</option>
            <option value="ADMIN">{t("admin.adminRole")}</option>
            <option value="EXPERT">{t("admin.expertRole")}</option>
            <option value="USER">{t("admin.userRole")}</option>
          </select>

          <button
            className={styles.exportButton}
            onClick={exportToCSV}
            title={t("admin.exportUsers")}
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span>{t("admin.export")}</span>
          </button>

          <button
            className={styles.addButton}
            onClick={() => navigate("/admin/users/create")}
          >
            <UserPlusIcon className="h-5 w-5" />
            <span>{t("admin.addUser")}</span>
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
                onClick={() => handleSortChange("name")}
              >
                <div className="flex items-center">
                  {t("admin.name")}
                  {sortBy === "name" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                className={styles.tableHeadCell}
                onClick={() => handleSortChange("email")}
              >
                <div className="flex items-center">
                  {t("admin.email")}
                  {sortBy === "email" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className={styles.tableHeadCell}>{t("admin.phone")}</th>
              <th
                className={styles.tableHeadCell}
                onClick={() => handleSortChange("role")}
              >
                <div className="flex items-center">
                  {t("admin.role")}
                  {sortBy === "role" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
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
                  {t("admin.loadingUsers")}
                </td>
              </tr>
            ) : currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className={
                    isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                  }
                >
                  <td className={styles.tableCell}>
                    {user.name} {user.surname}
                  </td>
                  <td
                    className={`whitespace-nowrap px-3 py-4 text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {user.email}
                  </td>
                  <td
                    className={`whitespace-nowrap px-3 py-4 text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {user.phoneNumber}
                  </td>
                  <td
                    className={`whitespace-nowrap px-3 py-4 text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    <span className={styles.roleChip(user.role)}>
                      {user.role}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className={`${styles.actionButton} text-blue-600`}
                        onClick={() => navigate(`/admin/users/${user.id}/view`)}
                        title={t("admin.view")}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        className={`${styles.actionButton} text-yellow-600`}
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                        title={t("admin.edit")}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        className={`${styles.actionButton} text-red-600`}
                        onClick={() => handleDeleteUser(user.id)}
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
                  {t("admin.noUsersFound")}
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

export default UserList;
