import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { tr, enUS } from "date-fns/locale";
import {
  MagnifyingGlassIcon,
  EnvelopeIcon,
  InboxIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  FunnelIcon,
  ChevronDownIcon,
  CheckIcon,
  TrashIcon,
  FlagIcon,
  CheckCircleIcon,
  XCircleIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline"; // Veya solid, ihtiyaca göre
import { useCustomTheme } from "../../../context/ThemeContext"; // useTheme yerine useCustomTheme kullanıyoruz

// Mock veri oluşturalım, gerçek projede API'den gelecek
const mockMessages = [
  {
    id: "msg1",
    sender: { name: "Ahmet Yılmaz", isExpert: true },
    recipient: { name: "Mehmet Demir", isExpert: false },
    content: "Projeniz için detay bilgileri göndermeniz mümkün mü?",
    status: "unread",
    isReported: false,
    timestamp: "2023-09-15T14:30:00Z",
  },
  {
    id: "msg2",
    sender: { name: "Ayşe Kaya", isExpert: false },
    recipient: { name: "Leyla Yıldız", isExpert: true },
    content: "Tadilat için teklif aldım, ne zaman başlayabiliriz?",
    status: "read",
    isReported: true,
    timestamp: "2023-09-14T10:15:00Z",
  },
  {
    id: "msg3",
    sender: { name: "Can Özkan", isExpert: true },
    recipient: { name: "Zeynep Demir", isExpert: false },
    content: "Proje planlarınızı inceledim, birkaç önerim olacak.",
    status: "unread",
    isReported: false,
    timestamp: "2023-09-16T09:45:00Z",
  },
  {
    id: "msg4",
    sender: { name: "Deniz Aydın", isExpert: false },
    recipient: { name: "Murat Kaya", isExpert: true },
    content: "Mutfak tadilatı için randevu alabilir miyim?",
    status: "read",
    isReported: false,
    timestamp: "2023-09-13T16:20:00Z",
  },
  {
    id: "msg5",
    sender: { name: "Ece Yıldız", isExpert: true },
    recipient: { name: "Burak Şahin", isExpert: false },
    content: "Projenizdeki değişiklikler için güncel çizimleri gönderdim.",
    status: "unread",
    isReported: false,
    timestamp: "2023-09-16T11:30:00Z",
  },
];

const Messages = () => {
  const { t, i18n } = useTranslation();
  const { mode } = useCustomTheme(); // isDarkMode yerine mode kullanıyoruz
  const isDarkMode = mode === "dark"; // mode'dan isDarkMode türetiyoruz
  const language = i18n.language;

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0); // 0: All, 1: Unread, 2: Reported
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [dateFilter, setDateFilter] = useState("all"); // 'all', 'today', 'thisWeek', 'thisMonth'
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(null); // Hangi mesajın menüsünün açık olduğunu tutar (message.id)

  const tabs = useMemo(
    () => [
      {
        label: t("admin.messages.tabs.all"),
        icon: <EnvelopeIcon className="w-5 h-5 mr-2" />,
        count: messages.length, // Tüm mesaj sayısı (gerekirse)
      },
      {
        label: t("admin.messages.tabs.unread"),
        icon: <InboxIcon className="w-5 h-5 mr-2" />,
        count: messages.filter((msg) => msg.status === "unread").length,
      },
      {
        label: t("admin.messages.tabs.reported"),
        icon: <ExclamationTriangleIcon className="w-5 h-5 mr-2" />,
        count: messages.filter((msg) => msg.isReported).length,
      },
    ],
    [t, messages]
  );

  const filterMessages = useCallback(() => {
    let filtered = [...messages];

    // Arama sorgusuna göre filtrele
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (msg) =>
          msg.sender.name.toLowerCase().includes(lowerCaseQuery) ||
          msg.recipient.name.toLowerCase().includes(lowerCaseQuery) ||
          msg.content.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Sekmeye göre filtrele
    switch (activeTab) {
      case 1: // Okunmamış mesajlar
        filtered = filtered.filter((msg) => msg.status === "unread");
        break;
      case 2: // Rapor edilmiş mesajlar
        filtered = filtered.filter((msg) => msg.isReported);
        break;
      case 0: // Tüm mesajlar (default)
      default:
        break;
    }

    // Tarihe göre filtrele
    if (dateFilter !== "all") {
      const now = new Date();
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      let startDate;

      switch (dateFilter) {
        case "today":
          startDate = startOfToday;
          break;
        case "thisWeek":
          startDate = new Date(startOfToday);
          startDate.setDate(
            startDate.getDate() -
              startDate.getDay() +
              (startDate.getDay() === 0 ? -6 : 1)
          ); // Haftanın başlangıcı (Pazartesi)
          break;
        case "thisMonth":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        filtered = filtered.filter(
          (msg) => new Date(msg.timestamp) >= startDate
        );
      }
    }

    setFilteredMessages(filtered);
  }, [messages, searchQuery, activeTab, dateFilter]);

  useEffect(() => {
    // API'den mesajları çekme simülasyonu
    const fetchMessages = async () => {
      setLoading(true);
      try {
        // API çağrısı simülasyonu
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Gerçek API çağrısında bu veriler dinamik olarak gelecek
        const fetchedMessages = mockMessages.map((msg) => ({
          ...msg,
          // Rastgele avatar ekleyelim (gerçek uygulamada API'den gelmeli)
          sender: {
            ...msg.sender,
            avatar: `https://i.pravatar.cc/40?u=${msg.sender.name}`,
          },
          recipient: {
            ...msg.recipient,
            avatar: `https://i.pravatar.cc/40?u=${msg.recipient.name}`,
          },
        }));
        setMessages(fetchedMessages);
      } catch (error) {
        console.error(t("admin.messages.errors.fetch"), error);
        // Kullanıcıya hata mesajı gösterilebilir (örn: toast notification)
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [t]); // t'yi dependency array'e ekleyelim

  // Filtreleme ve arama işlemlerini optimize et
  useEffect(() => {
    filterMessages();
  }, [filterMessages]); // filterMessages dependency olarak eklendi

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleTabChange = (index) => {
    setActiveTab(index);
    setSelectedMessage(null); // Sekme değiştiğinde seçili mesajı temizle
  };

  const handleMessageSelect = (message) => {
    setSelectedMessage(message);

    // Mesaj okunmamışsa, okundu olarak işaretle (API çağrısı gerekebilir)
    if (message.status === "unread") {
      markAsRead(message.id);
    }
  };

  const handleFilterMenuToggle = () => {
    setFilterMenuOpen((prev) => !prev);
  };

  const handleActionMenuToggle = (messageId, event) => {
    event.stopPropagation(); // Arka plana tıklamayı engelle
    setActionMenuOpen((prev) => (prev === messageId ? null : messageId));
  };

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    setFilterMenuOpen(false);
  };

  const refreshMessages = async () => {
    setLoading(true);
    setSelectedMessage(null); // Yenileme sırasında seçili mesajı temizle
    try {
      // API çağrısı simülasyonu
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Gerçek API çağrısı ile mesaj listesi güncellenecek
      const fetchedMessages = mockMessages.map((msg) => ({
        // Tekrar mock veri alıyoruz simülasyon için
        ...msg,
        sender: {
          ...msg.sender,
          avatar: `https://i.pravatar.cc/40?u=${
            msg.sender.name
          }${Math.random()}`, // Avatarı değiştirelim
        },
        recipient: {
          ...msg.recipient,
          avatar: `https://i.pravatar.cc/40?u=${
            msg.recipient.name
          }${Math.random()}`,
        },
      }));
      setMessages(fetchedMessages); // Yeni veriyle state'i güncelle
      // filterMessages() otomatik olarak tetiklenecek (useEffect dependency)
      console.log("Mesajlar yenilendi."); // Bildirim eklenebilir
    } catch (error) {
      console.error(t("admin.messages.errors.refresh"), error);
      // Kullanıcıya hata mesajı gösterilebilir
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (messageId) => {
    // API'ye PUT/PATCH isteği gönderilebilir
    console.log(`Marking message ${messageId} as read (API call simulation)`);
    const updatedMessages = messages.map((msg) =>
      msg.id === messageId ? { ...msg, status: "read" } : msg
    );
    setMessages(updatedMessages);

    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage({ ...selectedMessage, status: "read" });
    }
    // filterMessages() otomatik olarak tetiklenecek
  };

  const deleteMessage = (messageId) => {
    // Kullanıcı onayı
    if (window.confirm(t("admin.messages.confirmDelete"))) {
      // API'ye DELETE isteği gönderilebilir
      console.log(`Deleting message ${messageId} (API call simulation)`);
      const updatedMessages = messages.filter((msg) => msg.id !== messageId);
      setMessages(updatedMessages);

      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage(null); // Silinen mesaj seçiliyse temizle
      }
      setActionMenuOpen(null); // Menüyü kapat
      // filterMessages() otomatik olarak tetiklenecek
      // Başarı bildirimi gösterilebilir
    }
  };

  const reportMessage = (messageId) => {
    // API'ye PUT/PATCH isteği gönderilebilir (isReported durumunu değiştirmek için)
    const messageToUpdate = messages.find((msg) => msg.id === messageId);
    if (!messageToUpdate) return;

    const newReportStatus = !messageToUpdate.isReported;
    console.log(
      `Setting report status for message ${messageId} to ${newReportStatus} (API call simulation)`
    );

    const updatedMessages = messages.map((msg) =>
      msg.id === messageId ? { ...msg, isReported: newReportStatus } : msg
    );
    setMessages(updatedMessages);

    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage({
        ...selectedMessage,
        isReported: newReportStatus,
      });
    }
    setActionMenuOpen(null); // Menüyü kapat
    // filterMessages() otomatik olarak tetiklenecek
    // Başarı bildirimi gösterilebilir (Raporlandı / Rapor kaldırıldı)
  };

  const formatMessageDate = useCallback(
    (dateString) => {
      try {
        const date = new Date(dateString);
        // Kısa formatlama (örn: "5 May 2023, 14:30" veya "Bugün, 14:30")
        // Daha gelişmiş formatlama için date-fns içindeki formatDistanceToNow veya benzeri kullanılabilir
        return format(date, "d MMM yyyy, HH:mm", {
          locale: language === "tr" ? tr : enUS,
        });
      } catch (error) {
        console.error("Date formatting error:", error);
        return dateString; // Hata durumunda orijinal string'i döndür
      }
    },
    [language]
  );

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean) // Boş stringleri filtrele
      .slice(0, 2) // En fazla 2 harf al
      .join("")
      .toUpperCase();
  };

  const dateFilterOptions = useMemo(
    () => ({
      all: t("admin.messages.filterOptions.allTime"),
      today: t("admin.messages.filterOptions.today"),
      thisWeek: t("admin.messages.filterOptions.thisWeek"),
      thisMonth: t("admin.messages.filterOptions.thisMonth"),
    }),
    [t]
  );

  return (
    <div className={`container mx-auto p-4 ${isDarkMode ? "dark" : ""}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {t("admin.messages.title")}
        </h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={refreshMessages}
            disabled={loading}
            className={`flex items-center px-3 py-1.5 border rounded-md text-sm font-medium transition-colors
                        ${
                          loading
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                            : "border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-700"
                        }`}
            aria-label={t("admin.messages.refreshButton")}
          >
            <ArrowPathIcon
              className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`}
            />
            {t("admin.messages.refreshButton")}
          </button>

          {/* Filter Button & Dropdown */}
          <div className="relative">
            <button
              onClick={handleFilterMenuToggle}
              className="flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-haspopup="true"
              aria-expanded={filterMenuOpen}
              aria-label={t("admin.messages.filterButton")}
            >
              <FunnelIcon className="w-4 h-4 mr-1" />
              {dateFilterOptions[dateFilter]}
              <ChevronDownIcon className="w-4 h-4 ml-1" />
            </button>
            {filterMenuOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="filter-menu-button"
                tabIndex="-1"
              >
                {Object.entries(dateFilterOptions).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleDateFilterChange(key)}
                    className={`flex items-center w-full px-4 py-2 text-sm text-left transition-colors
                                ${
                                  dateFilter === key
                                    ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }
                              `}
                    role="menuitem"
                    tabIndex="-1"
                  >
                    {dateFilter === key && (
                      <CheckIcon className="w-4 h-4 mr-2" />
                    )}
                    <span className={dateFilter !== key ? "ml-6" : ""}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder={t("admin.messages.searchPlaceholder")}
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
          aria-label={t("admin.messages.searchPlaceholder")}
        />
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
        <nav className="-mb-px flex space-x-4 sm:space-x-8" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              onClick={() => handleTabChange(index)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center transition-colors focus:outline-none
                            ${
                              activeTab === index
                                ? "border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500"
                            }`}
              aria-current={activeTab === index ? "page" : undefined}
            >
              {React.cloneElement(tab.icon, {
                className: `w-5 h-5 mr-1.5 ${
                  activeTab === index
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                }`,
              })}
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 hidden sm:inline-block py-0.5 px-2 rounded-full text-xs font-medium
                                ${
                                  activeTab === index
                                    ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
                                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Loading or Content */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <ArrowPathIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            {t("admin.loading")}
          </span>
        </div>
      ) : (
        <div
          className="flex flex-col md:flex-row border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800"
          style={{ height: "calc(100vh - 250px)" }}
        >
          {" "}
          {/* Adjust height as needed */}
          {/* Message List */}
          <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            {filteredMessages.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMessages.map((message) => (
                  <li key={message.id}>
                    <button
                      onClick={() => handleMessageSelect(message)}
                      className={`w-full text-left p-3 flex items-start space-x-3 transition-colors focus:outline-none
                                                    ${
                                                      selectedMessage?.id ===
                                                      message.id
                                                        ? "bg-indigo-50 dark:bg-gray-700"
                                                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                                    }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                          message.sender.isExpert
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }`}
                      >
                        {message.sender.avatar ? (
                          <img
                            src={message.sender.avatar}
                            alt={message.sender.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          getInitials(message.sender.name)
                        )}
                      </div>

                      {/* Message Info */}
                      <div className="flex-1 min-w-0 relative">
                        <div className="flex justify-between items-center mb-0.5">
                          <p
                            className={`text-sm font-semibold truncate ${
                              message.status === "unread"
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {message.sender.name}
                          </p>
                          {message.status === "unread" && (
                            <span
                              className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 ml-2"
                              aria-label={t("admin.messages.unreadIndicator")}
                            ></span>
                          )}
                        </div>
                        <p
                          className={`text-sm truncate ${
                            message.status === "unread"
                              ? "text-gray-600 dark:text-gray-300"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {message.content}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {formatMessageDate(message.timestamp)}
                          </span>
                          {message.isReported && (
                            <span
                              className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              title={t("admin.messages.reportedChip")}
                            >
                              <ExclamationTriangleIcon className="w-3 h-3 mr-0.5" />
                              {t("admin.messages.reportedChipShort")}
                            </span>
                          )}
                        </div>

                        {/* Action Menu Button (Mobile might need adjustment) */}
                        <div className="absolute top-2 right-0">
                          <button
                            onClick={(e) =>
                              handleActionMenuToggle(message.id, e)
                            }
                            className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none"
                            aria-label={t("admin.messages.actions.moreActions")}
                            aria-haspopup="true"
                            aria-expanded={actionMenuOpen === message.id}
                          >
                            <EllipsisVerticalIcon className="w-5 h-5" />
                          </button>
                          {/* Action Menu Dropdown */}
                          {actionMenuOpen === message.id && (
                            <div
                              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
                              role="menu"
                              aria-orientation="vertical"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(message.id);
                                  setActionMenuOpen(null);
                                }}
                                disabled={message.status === "read"}
                                className={`w-full text-left flex items-center px-4 py-2 text-sm transition-colors ${
                                  message.status === "read"
                                    ? "text-gray-400 cursor-not-allowed dark:text-gray-600"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                                role="menuitem"
                              >
                                <CheckCircleIcon className="w-4 h-4 mr-2" />{" "}
                                {t("admin.messages.actions.markAsRead")}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  reportMessage(message.id);
                                }}
                                className={`w-full text-left flex items-center px-4 py-2 text-sm transition-colors ${
                                  message.isReported
                                    ? "text-yellow-700 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-gray-700"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                                role="menuitem"
                              >
                                <FlagIcon className="w-4 h-4 mr-2" />{" "}
                                {message.isReported
                                  ? t("admin.messages.actions.unreport")
                                  : t("admin.messages.actions.report")}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteMessage(message.id);
                                }}
                                className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                                role="menuitem"
                              >
                                <TrashIcon className="w-4 h-4 mr-2" />{" "}
                                {t("admin.messages.actions.delete")}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-500 dark:text-gray-400">
                <InboxIcon className="w-12 h-12 mb-3 text-gray-400 dark:text-gray-500" />
                <p className="text-lg font-medium">
                  {t("admin.messages.noMessagesFoundTitle")}
                </p>
                <p className="text-sm">
                  {t("admin.messages.noMessagesFoundDescription")}
                </p>
              </div>
            )}
          </div>
          {/* Message Detail */}
          <div className="w-full md:w-2/3 p-4 sm:p-6 flex flex-col overflow-y-auto">
            {selectedMessage ? (
              <>
                {/* Detail Header */}
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-3">
                      {/* Sender Avatar */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-semibold ${
                          selectedMessage.sender.isExpert
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }`}
                      >
                        {selectedMessage.sender.avatar ? (
                          <img
                            src={selectedMessage.sender.avatar}
                            alt={selectedMessage.sender.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          getInitials(selectedMessage.sender.name)
                        )}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          {selectedMessage.sender.name}
                          {selectedMessage.sender.isExpert && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {t("admin.messages.expertChip")}
                            </span>
                          )}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t("admin.messages.recipientLabel", {
                            recipient: selectedMessage.recipient.name,
                          })}
                          {selectedMessage.recipient.isExpert && (
                            <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {t("admin.messages.expertChip")}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {formatMessageDate(selectedMessage.timestamp)}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons (Desktop) */}
                    <div className="hidden sm:flex items-center space-x-1">
                      <button
                        onClick={() => markAsRead(selectedMessage.id)}
                        disabled={selectedMessage.status === "read"}
                        className={`p-1.5 rounded-full transition-colors ${
                          selectedMessage.status === "read"
                            ? "text-gray-400 cursor-not-allowed dark:text-gray-600"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                        }`}
                        title={t("admin.messages.actions.markAsRead")}
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => reportMessage(selectedMessage.id)}
                        className={`p-1.5 rounded-full transition-colors ${
                          selectedMessage.isReported
                            ? "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-gray-700"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                        }`}
                        title={
                          selectedMessage.isReported
                            ? t("admin.messages.actions.unreport")
                            : t("admin.messages.actions.report")
                        }
                      >
                        <FlagIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="p-1.5 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-colors"
                        title={t("admin.messages.actions.delete")}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-grow prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                  <p>{selectedMessage.content}</p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                <EnvelopeIcon className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-500" />
                <p className="text-lg font-medium">
                  {t("admin.messages.selectMessagePromptTitle")}
                </p>
                <p className="text-sm">
                  {t("admin.messages.selectMessagePromptDescription")}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
