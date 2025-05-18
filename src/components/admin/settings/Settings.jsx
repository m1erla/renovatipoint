import React, { useState } from "react";
import { useCustomTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import api from "../../../utils/api";
import { toast } from "react-toastify";

const Settings = () => {
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const isDarkMode = mode === "dark";
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "Renovatipoint",
    siteDescription:
      "Profesyonel hizmetlerimizle evinizi ya da iş yerinizi baştan yaratın",
    contactEmail: "info@renovatipoint.com",
    contactPhone: "+90 555 123 4567",
    contactAddress: "İstanbul, Türkiye",
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    adApprovalRequired: true,
    maxFileSize: 5, // MB
    allowedFileTypes: "jpg,jpeg,png,pdf,doc,docx",
    maxImagesPerAd: 10,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // API çağrısı yapılacak
      // const token = localStorage.getItem("accessToken");
      // await api.post("/api/v1/admin/settings", settings, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      // Şu an için görsel amaçlı sadece bir başarı mesajı
      setTimeout(() => {
        toast.success(t("admin.settingsSaved"));
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Ayarlar kaydedilirken hata oluştu:", error);
      toast.error(t("admin.settingsError"));
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1
          className={`text-2xl font-semibold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {t("admin.settings")}
        </h1>
      </div>

      <div
        className={`bg-${
          isDarkMode ? "gray-800" : "white"
        } shadow overflow-hidden rounded-lg`}
      >
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="siteName"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("admin.siteName")}
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="siteName"
                  id="siteName"
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    isDarkMode ? "bg-gray-700 text-white border-gray-600" : ""
                  }`}
                  value={settings.siteName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="contactEmail"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("admin.contactEmail")}
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="contactEmail"
                  id="contactEmail"
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    isDarkMode ? "bg-gray-700 text-white border-gray-600" : ""
                  }`}
                  value={settings.contactEmail}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="contactPhone"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("admin.contactPhone")}
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="contactPhone"
                  id="contactPhone"
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    isDarkMode ? "bg-gray-700 text-white border-gray-600" : ""
                  }`}
                  value={settings.contactPhone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="maxFileSize"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("admin.maxFileSize")} (MB)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="maxFileSize"
                  id="maxFileSize"
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    isDarkMode ? "bg-gray-700 text-white border-gray-600" : ""
                  }`}
                  value={settings.maxFileSize}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="siteDescription"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("admin.siteDescription")}
              </label>
              <div className="mt-1">
                <textarea
                  name="siteDescription"
                  id="siteDescription"
                  rows={3}
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    isDarkMode ? "bg-gray-700 text-white border-gray-600" : ""
                  }`}
                  value={settings.siteDescription}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="contactAddress"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("admin.contactAddress")}
              </label>
              <div className="mt-1">
                <textarea
                  name="contactAddress"
                  id="contactAddress"
                  rows={2}
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    isDarkMode ? "bg-gray-700 text-white border-gray-600" : ""
                  }`}
                  value={settings.contactAddress}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="allowedFileTypes"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("admin.allowedFileTypes")} (csv)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="allowedFileTypes"
                  id="allowedFileTypes"
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    isDarkMode ? "bg-gray-700 text-white border-gray-600" : ""
                  }`}
                  value={settings.allowedFileTypes}
                  onChange={handleChange}
                />
              </div>
              <p
                className={`mt-2 text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("admin.fileTypesHelp")}
              </p>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="maintenanceMode"
                    name="maintenanceMode"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="maintenanceMode"
                    className={`font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("admin.maintenanceMode")}
                  </label>
                  <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                    {t("admin.maintenanceModeHelp")}
                  </p>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="allowRegistration"
                    name="allowRegistration"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={settings.allowRegistration}
                    onChange={handleChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="allowRegistration"
                    className={`font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("admin.allowRegistration")}
                  </label>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="adApprovalRequired"
                    name="adApprovalRequired"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={settings.adApprovalRequired}
                    onChange={handleChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="adApprovalRequired"
                    className={`font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {t("admin.adApprovalRequired")}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`px-4 py-3 ${
            isDarkMode ? "bg-gray-700" : "bg-gray-50"
          } text-right sm:px-6`}
        >
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? t("common.loading") : t("common.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
