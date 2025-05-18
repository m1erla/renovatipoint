import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { useCustomTheme } from "../../../context/ThemeContext";
import { toast } from "react-toastify";

// Import icons (assuming you're using heroicons which works well with Tailwind)
import {
  MagnifyingGlassIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  XCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

// Mock Data - Replace with actual API calls
const mockPayments = [
  {
    id: "PAY-1234567",
    userId: 101,
    userName: "Ahmet Yılmaz",
    amount: 650.0,
    currency: "EUR",
    description: "Ev renovasyonu danışmanlık hizmeti",
    status: "completed",
    paymentMethod: "credit_card",
    createdAt: "2023-03-28T10:30:00",
    processedAt: "2023-03-28T10:35:00",
  },
  {
    id: "PAY-2345678",
    userId: 102,
    userName: "Fatma Demir",
    amount: 320.5,
    currency: "EUR",
    description: "Bahçe tasarımı hizmeti",
    status: "pending",
    paymentMethod: "bank_transfer",
    createdAt: "2023-03-29T14:22:00",
    processedAt: null,
  },
  {
    id: "PAY-3456789",
    userId: 103,
    userName: "Mehmet Kaya",
    amount: 150.0,
    currency: "EUR",
    description: "Tadilat danışmanlığı",
    status: "failed",
    paymentMethod: "credit_card",
    createdAt: "2023-03-30T09:45:00",
    processedAt: "2023-03-30T09:47:00",
    failReason: "Insufficient funds",
  },
  {
    id: "PAY-4567890",
    userId: 104,
    userName: "Ayşe Şahin",
    amount: 850.0,
    currency: "EUR",
    description: "İç mimari tasarım hizmeti",
    status: "completed",
    paymentMethod: "paypal",
    createdAt: "2023-03-25T16:10:00",
    processedAt: "2023-03-25T16:15:00",
  },
  {
    id: "PAY-5678901",
    userId: 105,
    userName: "Ali Öztürk",
    amount: 450.0,
    currency: "EUR",
    description: "Mobilya seçimi danışmanlığı",
    status: "completed",
    paymentMethod: "credit_card",
    createdAt: "2023-03-26T11:20:00",
    processedAt: "2023-03-26T11:25:00",
  },
  {
    id: "PAY-6789012",
    userId: 106,
    userName: "Zeynep Yılmaz",
    amount: 220.0,
    currency: "EUR",
    description: "Peyzaj mimarlığı danışmanlığı",
    status: "refunded",
    paymentMethod: "credit_card",
    createdAt: "2023-03-27T13:40:00",
    processedAt: "2023-03-27T13:45:00",
    refundedAt: "2023-03-28T10:15:00",
  },
];

const Payments = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState(0);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const { mode } = useCustomTheme();
  const { t, language } = useLanguage();
  const isDarkMode = mode === "dark";

  useEffect(() => {
    // Simulate fetching payments from API
    const fetchPayments = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setPayments(mockPayments);
        setFilteredPayments(mockPayments); // Initially show all
      } catch (error) {
        console.error("Error fetching payments:", error);
        toast.error(t("admin.payments.toastFetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [t]);

  useEffect(() => {
    // Filter payments when search query or filter changes
    const filterPayments = () => {
      let filtered = [...payments];

      // Filter by search query
      if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (payment) =>
            payment.id.toLowerCase().includes(lowerCaseQuery) ||
            payment.userName.toLowerCase().includes(lowerCaseQuery) ||
            payment.description.toLowerCase().includes(lowerCaseQuery)
        );
      }

      // Filter by status (based on active tab)
      const tabStatusMap = [
        "all",
        "completed",
        "pending",
        "failed",
        "refunded",
      ];
      const currentStatusFilter = tabStatusMap[activeTab];

      if (currentStatusFilter !== "all") {
        filtered = filtered.filter(
          (payment) => payment.status === currentStatusFilter
        );
      }

      // Apply the dropdown status filter if it's not "all"
      if (statusFilter !== "all") {
        filtered = filtered.filter(
          (payment) => payment.status === statusFilter
        );
      }

      setFilteredPayments(filtered);
    };

    filterPayments();
  }, [searchQuery, statusFilter, payments, activeTab]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
  };

  // Determine badge color and icon based on status
  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        label: t("admin.payments.status.completed"),
        bgColor: "bg-green-100 dark:bg-green-900",
        textColor: "text-green-800 dark:text-green-100",
        icon: <CheckCircleIcon className="h-4 w-4 mr-1" />,
      },
      pending: {
        label: t("admin.payments.status.pending"),
        bgColor: "bg-yellow-100 dark:bg-yellow-900",
        textColor: "text-yellow-800 dark:text-yellow-100",
        icon: <ClockIcon className="h-4 w-4 mr-1" />,
      },
      failed: {
        label: t("admin.payments.status.failed"),
        bgColor: "bg-red-100 dark:bg-red-900",
        textColor: "text-red-800 dark:text-red-100",
        icon: <XCircleIcon className="h-4 w-4 mr-1" />,
      },
      refunded: {
        label: t("admin.payments.status.refunded"),
        bgColor: "bg-blue-100 dark:bg-blue-900",
        textColor: "text-blue-800 dark:text-blue-100",
        icon: <BanknotesIcon className="h-4 w-4 mr-1" />,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Translate payment method key to text
  const getPaymentMethodText = (method) => {
    const key = `admin.payments.paymentMethods.${method || "unknown"}`;
    return t(key, method);
  };

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString(language);
    } catch (error) {
      return dateString;
    }
  };

  // Format currency amount
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat(language === "tr" ? "tr-TR" : "en-US", {
      style: "currency",
      currency: currency || "TRY",
    }).format(amount);
  };

  // Summary data for tabs (calculate once)
  const tabPanelData = useMemo(() => {
    const completedPayments = payments.filter((p) => p.status === "completed");
    const pendingPayments = payments.filter((p) => p.status === "pending");
    const failedPayments = payments.filter((p) => p.status === "failed");
    const refundedPayments = payments.filter((p) => p.status === "refunded");

    const calculateTotal = (items) =>
      items.reduce((sum, item) => sum + item.amount, 0);

    return [
      {
        label: t("admin.payments.tabs.all"),
        count: payments.length,
        total: formatCurrency(calculateTotal(payments), "EUR"),
      },
      {
        label: t("admin.payments.tabs.completed"),
        count: completedPayments.length,
        total: formatCurrency(calculateTotal(completedPayments), "EUR"),
      },
      {
        label: t("admin.payments.tabs.pending"),
        count: pendingPayments.length,
        total: formatCurrency(calculateTotal(pendingPayments), "EUR"),
      },
      {
        label: t("admin.payments.tabs.failed"),
        count: failedPayments.length,
        total: formatCurrency(calculateTotal(failedPayments), "EUR"),
      },
      {
        label: t("admin.payments.tabs.refunded"),
        count: refundedPayments.length,
        total: formatCurrency(calculateTotal(refundedPayments), "EUR"),
      },
    ];
  }, [payments, formatCurrency, t]);

  // Main container and dark mode classes
  const containerClasses = isDarkMode
    ? "bg-gray-900 text-gray-100 p-6 rounded-lg"
    : "bg-white text-gray-800 p-6 rounded-lg shadow";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("admin.payments.title")}</h1>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        {tabPanelData.map((data, index) => (
          <div
            key={index}
            className={`${index === 0 ? "md:col-span-12" : "md:col-span-3"}`}
          >
            <div
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white shadow"
              } rounded-lg p-4 h-full transition-transform hover:translate-y-[-4px] hover:shadow-lg`}
            >
              <h3 className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
                {data.label}
              </h3>
              <p className="text-3xl font-semibold text-blue-600 dark:text-blue-400 my-2">
                {data.count}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("admin.payments.table.amount")}: {data.total}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        className={`flex overflow-x-auto border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        } mb-6`}
      >
        {tabPanelData.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === index
                ? `border-b-2 border-blue-500 text-blue-600 dark:text-blue-400`
                : `text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200`
            }`}
            onClick={() => handleTabChange(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t("admin.payments.searchPlaceholder")}
            className={`pl-10 pr-4 py-2 w-full rounded-md ${
              isDarkMode
                ? "bg-gray-800 text-gray-100 border-gray-700 focus:border-blue-500"
                : "bg-white text-gray-900 border-gray-300 focus:border-blue-500"
            } border focus:ring-blue-500 focus:outline-none focus:ring-1`}
            value={searchQuery}
            onChange={handleSearchChange}
            disabled={loading}
          />
        </div>

        <div className="w-full sm:w-48">
          <label htmlFor="status-filter" className="sr-only">
            {t("admin.payments.statusFilterLabel")}
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className={`w-full py-2 px-3 rounded-md border ${
              isDarkMode
                ? "bg-gray-800 text-gray-100 border-gray-700"
                : "bg-white text-gray-900 border-gray-300"
            } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
            disabled={loading}
          >
            <option value="all">{t("admin.payments.allStatuses")}</option>
            <option value="completed">
              {t("admin.payments.status.completed")}
            </option>
            <option value="pending">
              {t("admin.payments.status.pending")}
            </option>
            <option value="failed">{t("admin.payments.status.failed")}</option>
            <option value="refunded">
              {t("admin.payments.status.refunded")}
            </option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div
        className={`rounded-lg overflow-hidden ${
          isDarkMode ? "bg-gray-800" : "bg-white shadow"
        }`}
      >
        <div className="overflow-x-auto max-h-[calc(100vh-450px)]">
          {" "}
          {/* Adjusted max height */}
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead
              className={
                isDarkMode
                  ? "bg-gray-700 sticky top-0 z-10"
                  : "bg-gray-50 sticky top-0 z-10"
              }
            >
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  {t("admin.payments.table.id")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  {t("admin.payments.table.user")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  {t("admin.payments.table.amount")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  {t("admin.payments.table.date")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  {t("admin.payments.table.method")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  {t("admin.payments.table.status")}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  {t("admin.payments.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDarkMode ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className={`${
                      isDarkMode
                        ? "hover:bg-gray-700 even:bg-gray-800 odd:bg-gray-750"
                        : "hover:bg-gray-50 even:bg-white odd:bg-gray-50"
                    } transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {payment.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(payment.amount, payment.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {getPaymentMethodText(payment.paymentMethod)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(payment)}
                        className={`p-1 rounded-full ${
                          isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                        } mr-2 text-gray-400 hover:text-blue-500`}
                        disabled={loading}
                        title={t("admin.payments.actions.viewDetails")}
                      >
                        <span className="sr-only">
                          {t("admin.payments.actions.viewDetails")}
                        </span>
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        className={`p-1 rounded-full ${
                          isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                        } text-gray-400 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                        disabled={payment.status !== "completed" || loading}
                        title={t("admin.payments.actions.downloadInvoice")}
                        onClick={() => {
                          /* Implement invoice download */
                        }}
                      >
                        <span className="sr-only">
                          {t("admin.payments.actions.downloadInvoice")}
                        </span>
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    {t("admin.payments.noSearchResults")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for payment details */}
      {detailDialogOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={handleCloseDialog}
            ></div>

            {/* Modal panel */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className={`inline-block align-bottom ${
                isDarkMode
                  ? "bg-gray-800 text-gray-100"
                  : "bg-white text-gray-900"
              } rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}
            >
              {selectedPayment && (
                <>
                  <div
                    className={`px-4 py-5 ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-50"
                    } sm:px-6 border-b ${
                      isDarkMode ? "border-gray-600" : "border-gray-200"
                    }`}
                  >
                    <h3
                      className="text-lg leading-6 font-medium"
                      id="modal-title"
                    >
                      {t("admin.payments.dialog.title")} - {selectedPayment.id}
                    </h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <dl className="space-y-3">
                      <div
                        className={`flex justify-between py-2 border-b ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <dt
                          className={`font-medium ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {t("admin.payments.dialog.userName")}
                        </dt>
                        <dd className="font-medium text-right">
                          {selectedPayment.userName}
                        </dd>
                      </div>
                      <div
                        className={`flex justify-between py-2 border-b ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <dt
                          className={`font-medium ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {t("admin.payments.dialog.amount")}
                        </dt>
                        <dd className="font-medium text-right">
                          {formatCurrency(
                            selectedPayment.amount,
                            selectedPayment.currency
                          )}
                        </dd>
                      </div>
                      <div
                        className={`flex justify-between py-2 border-b ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <dt
                          className={`font-medium ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {t("admin.payments.dialog.description")}
                        </dt>
                        <dd className="font-medium text-right">
                          {selectedPayment.description}
                        </dd>
                      </div>
                      <div
                        className={`flex justify-between py-2 border-b ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <dt
                          className={`font-medium ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {t("admin.payments.dialog.paymentMethod")}
                        </dt>
                        <dd className="font-medium text-right">
                          {getPaymentMethodText(selectedPayment.paymentMethod)}
                        </dd>
                      </div>
                      <div
                        className={`flex justify-between items-center py-2 border-b ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <dt
                          className={`font-medium ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {t("admin.payments.dialog.status")}
                        </dt>
                        <dd>{getStatusBadge(selectedPayment.status)}</dd>
                      </div>
                      <div
                        className={`flex justify-between py-2 border-b ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <dt
                          className={`font-medium ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {t("admin.payments.dialog.createdAt")}
                        </dt>
                        <dd className="font-medium text-right">
                          {formatDate(selectedPayment.createdAt)}
                        </dd>
                      </div>
                      <div
                        className={`flex justify-between py-2 border-b ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <dt
                          className={`font-medium ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {t("admin.payments.dialog.processedAt")}
                        </dt>
                        <dd className="font-medium text-right">
                          {formatDate(selectedPayment.processedAt)}
                        </dd>
                      </div>
                      {selectedPayment.status === "failed" &&
                        selectedPayment.failReason && (
                          <div
                            className={`flex justify-between py-2 border-b ${
                              isDarkMode ? "border-gray-700" : "border-gray-200"
                            }`}
                          >
                            <dt
                              className={`font-medium ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {t("admin.payments.dialog.failReason")}
                            </dt>
                            <dd className="font-medium text-red-500 text-right">
                              {selectedPayment.failReason}
                            </dd>
                          </div>
                        )}
                      {selectedPayment.status === "refunded" &&
                        selectedPayment.refundedAt && (
                          <div
                            className={`flex justify-between py-2 border-b ${
                              isDarkMode ? "border-gray-700" : "border-gray-200"
                            }`}
                          >
                            <dt
                              className={`font-medium ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {t("admin.payments.dialog.refundedAt")}
                            </dt>
                            <dd className="font-medium text-right">
                              {formatDate(selectedPayment.refundedAt)}
                            </dd>
                          </div>
                        )}
                    </dl>
                  </div>
                  <div
                    className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    {selectedPayment.status === "completed" && (
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                        onClick={() => {
                          /* Implement invoice download */
                        }}
                        disabled={loading}
                      >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        {t("admin.payments.actions.downloadInvoice")}
                      </button>
                    )}
                    <button
                      type="button"
                      className={`mt-3 w-full inline-flex justify-center rounded-md border ${
                        isDarkMode
                          ? "border-gray-600 hover:bg-gray-600 text-gray-100"
                          : "border-gray-300 hover:bg-gray-50 text-gray-700"
                      } shadow-sm px-4 py-2 bg-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50`}
                      onClick={handleCloseDialog}
                      disabled={loading}
                    >
                      {t("admin.payments.dialog.closeButton")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
