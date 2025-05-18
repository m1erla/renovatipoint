import React, { useState, useEffect, useMemo } from "react";
import { useCustomTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { categoryService } from "../../../services/categoryService";
import { slugToTranslationKey } from "../../../utils/slugify";
import { getTranslationKeyFromTurkishName } from "../../../utils/translationHelper";

// Import Heroicons (Tailwind's recommended icon set)
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  BoltIcon,
  HomeIcon,
  SwatchIcon,
  BeakerIcon,
  ComputerDesktopIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  TruckIcon,
  FireIcon,
  DevicePhoneMobileIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";

const Categories = () => {
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const isDarkMode = mode === "dark";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("add"); // "add" or "edit"
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "CategoryIcon", // Default icon
    isActive: true,
    image: "",
    backgroundImage: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Using mock data for now
      const response = await fetch("/data/categories/categories.json");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Simulate API delay
      setTimeout(() => {
        setCategories(data);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(t("admin.categories.toastFetchError"));
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleOpenDialog = (type, category = null) => {
    setDialogType(type);

    if (type === "edit" && category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon || "CategoryIcon",
        isActive: category.isActive,
        image: category.image || "",
        backgroundImage: category.backgroundImage || "",
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        icon: "CategoryIcon",
        isActive: true,
        image: "",
        backgroundImage: "",
      });
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Auto-generate slug from name
    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      }));
    }
  };

  const handleSubmit = async () => {
    // Form validation
    if (!formData.name || !formData.slug || !formData.description) {
      toast.error(t("common.formValidation.requiredFields"));
      return;
    }

    try {
      setLoading(true); // Show loading state
      if (dialogType === "add") {
        // Simulate adding a new category
        const newCategory = {
          ...formData,
          id: categories.length + 1, // Simple ID generation for mock
          expertCount: 0,
          serviceCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setCategories([...categories, newCategory]);
        toast.success(t("admin.categories.toastCreateSuccess"));
      } else {
        // Simulate updating a category
        const updatedCategories = categories.map((cat) =>
          cat.id === selectedCategory.id
            ? { ...cat, ...formData, updatedAt: new Date().toISOString() }
            : cat
        );
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setCategories(updatedCategories);
        toast.success(t("admin.categories.toastUpdateSuccess"));
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error during category operation:", error);
      toast.error(
        dialogType === "add"
          ? t("admin.categories.toastCreateError")
          : t("admin.categories.toastUpdateError")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    // Show confirmation dialog (implement a proper one if needed)
    if (!window.confirm(t("admin.categories.deleteConfirmText"))) {
      return;
    }

    try {
      setLoading(true);
      // Simulate deleting a category
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const updatedCategories = categories.filter(
        (cat) => cat.id !== categoryId
      );
      setCategories(updatedCategories);
      toast.success(t("admin.categories.toastDeleteSuccess"));
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(t("admin.categories.toastDeleteError"));
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // Paginate filtered categories
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const displayedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Icon options with components
  const iconComponents = {
    CategoryIcon: Squares2X2Icon,
    HomeIcon: HomeIcon,
    SwatchIcon: SwatchIcon,
    HomeModernIcon: HomeIcon,
    PencilIcon: PencilSquareIcon,
    BoltIcon: BoltIcon,
    BeakerIcon: BeakerIcon,
    ComputerDesktopIcon: ComputerDesktopIcon,
    ShieldCheckIcon: ShieldCheckIcon,
    SquaresPlusIcon: SquaresPlusIcon,
    TruckIcon: TruckIcon,
    FireIcon: FireIcon,
    DevicePhoneMobileIcon: DevicePhoneMobileIcon,
  };

  const iconOptions = Object.keys(iconComponents).map((key) => ({
    value: key,
    // Create a translation key like 'admin.categories.icon.HomeIcon'
    label: t(`admin.categories.icon.${key}`),
  }));

  // Render the selected icon component
  const renderIcon = (iconName) => {
    const IconComponent =
      iconComponents[iconName] || iconComponents.CategoryIcon;
    return <IconComponent className="w-6 h-6" />;
  };

  return (
    <div
      className={`p-6 rounded-lg ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1
          className={`text-2xl font-bold ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          {t("admin.categories.title")}
        </h1>

        <div className="flex gap-3 w-full sm:w-auto">
          <button
            className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium
              ${
                isDarkMode
                  ? "border-gray-600 text-gray-200 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              } 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={fetchCategories}
            disabled={loading}
            title={t("admin.categories.refreshButton")}
          >
            <ArrowPathIcon className="w-5 h-5 mr-1" />
            {t("admin.categories.refreshButton")}
          </button>

          <button
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => handleOpenDialog("add")}
            disabled={loading}
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            {t("admin.categories.addButton")}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div
          className={`relative rounded-md shadow-sm ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon
              className={`h-5 w-5 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
          </div>
          <input
            type="text"
            placeholder={t("admin.categories.searchPlaceholder")}
            className={`block w-full pl-10 pr-3 py-2 border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
            } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50`}
            value={searchTerm}
            onChange={handleSearchChange}
            disabled={loading}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : displayedCategories.length > 0 ? (
        <>
          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedCategories.map((category) => (
              <div
                key={category.id}
                className={`flex flex-col h-full rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                {/* Card Image & Icon */}
                <div className="relative h-0 pb-[56.25%]">
                  <img
                    src={category.image || "/images/placeholder-category.jpg"}
                    alt={category.name}
                    className="absolute h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-white">
                      {React.cloneElement(renderIcon(category.icon), {
                        className: "w-10 h-10",
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex-grow p-4">
                  <h2
                    className={`text-lg font-semibold mb-2 ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    {t(
                      getTranslationKeyFromTurkishName(
                        category.name,
                        "category"
                      )
                    )}
                  </h2>
                  <p
                    className={`text-sm mb-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {category.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        isDarkMode
                          ? "bg-blue-900 text-blue-100"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {t("admin.categories.card.expertsCount", {
                        count: category.expertCount,
                      })}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        isDarkMode
                          ? "bg-blue-900 text-blue-100"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {t("admin.categories.card.servicesCount", {
                        count: category.serviceCount,
                      })}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        category.isActive
                          ? isDarkMode
                            ? "bg-green-900 text-green-100"
                            : "bg-green-100 text-green-800"
                          : isDarkMode
                          ? "bg-red-900 text-red-100"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {category.isActive
                        ? t("admin.categories.statusActive")
                        : t("admin.categories.statusInactive")}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex justify-between p-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    className={`p-1.5 rounded-full ${
                      isDarkMode
                        ? "hover:bg-gray-700 text-gray-300"
                        : "hover:bg-gray-100 text-gray-600"
                    } transition-colors`}
                    onClick={() => handleOpenDialog("edit", category)}
                    disabled={loading}
                    title={t("admin.categories.editButton")}
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>

                  <button
                    className={`p-1.5 rounded-full ${
                      isDarkMode
                        ? "hover:bg-red-900 text-red-300"
                        : "hover:bg-red-100 text-red-600"
                    } transition-colors`}
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={loading}
                    title={t("admin.categories.deleteButton")}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700"
                      : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                  } text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                      ${
                        currentPage === index + 1
                          ? isDarkMode
                            ? "bg-gray-700 border-gray-700 text-white z-10"
                            : "bg-blue-50 border-blue-500 text-blue-600 z-10"
                          : isDarkMode
                          ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700"
                      : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                  } text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Squares2X2Icon
            className={`w-16 h-16 mb-4 ${
              isDarkMode ? "text-gray-600" : "text-gray-400"
            }`}
          />
          <h2 className="text-xl font-semibold mb-2">
            {searchTerm
              ? t("admin.categories.noSearchResults")
              : t("admin.categories.noCategories")}
          </h2>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {searchTerm
              ? t("admin.categories.adjustSearchFilter")
              : t("admin.categories.addFirstCategory")}
          </p>
        </div>
      )}

      {/* Category Add/Edit Modal */}
      {openDialog && (
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

            {/* This element centers the modal */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            {/* Modal panel */}
            <div
              className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              {/* Modal header */}
              <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                  {dialogType === "add"
                    ? t("admin.categories.dialogAddTitle")
                    : t("admin.categories.dialogEditTitle")}
                </h3>
                <button
                  type="button"
                  className={`p-1 rounded-full ${
                    isDarkMode
                      ? "text-gray-400 hover:bg-gray-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                  onClick={handleCloseDialog}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Form fields */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label
                      htmlFor="name"
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("admin.categories.dialogFieldName")} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
                          : "border-gray-300 focus:border-blue-500"
                      } focus:ring-blue-500 focus:outline-none focus:ring-1 py-2 px-3`}
                      disabled={loading}
                    />
                  </div>

                  {/* Slug field */}
                  <div>
                    <label
                      htmlFor="slug"
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("admin.categories.dialogFieldSlug")} *
                    </label>
                    <input
                      type="text"
                      name="slug"
                      id="slug"
                      required
                      value={formData.slug}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
                          : "border-gray-300 focus:border-blue-500"
                      } focus:ring-blue-500 focus:outline-none focus:ring-1 py-2 px-3`}
                      disabled={loading}
                    />
                    <p
                      className={`mt-1 text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("admin.categories.dialogFieldSlugHelp")}
                    </p>
                  </div>

                  {/* Description field */}
                  <div>
                    <label
                      htmlFor="description"
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("admin.categories.dialogFieldDescription")} *
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows="3"
                      required
                      value={formData.description}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
                          : "border-gray-300 focus:border-blue-500"
                      } focus:ring-blue-500 focus:outline-none focus:ring-1 py-2 px-3`}
                      disabled={loading}
                    ></textarea>
                  </div>

                  {/* Icon selection */}
                  <div>
                    <label
                      htmlFor="icon"
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("admin.categories.dialogFieldIcon")}
                    </label>
                    <select
                      name="icon"
                      id="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
                          : "border-gray-300 focus:border-blue-500"
                      } focus:ring-blue-500 focus:outline-none focus:ring-1 py-2 px-3`}
                      disabled={loading}
                    >
                      {iconOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Image URL field */}
                  <div>
                    <label
                      htmlFor="image"
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("admin.categories.dialogFieldImage")}
                    </label>
                    <input
                      type="text"
                      name="image"
                      id="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
                          : "border-gray-300 focus:border-blue-500"
                      } focus:ring-blue-500 focus:outline-none focus:ring-1 py-2 px-3`}
                      disabled={loading}
                    />
                    <p
                      className={`mt-1 text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("admin.categories.dialogFieldImageHelp")}
                    </p>
                  </div>

                  {/* Background Image URL field */}
                  <div>
                    <label
                      htmlFor="backgroundImage"
                      className={`block text-sm font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("admin.categories.dialogFieldBgImage")}
                    </label>
                    <input
                      type="text"
                      name="backgroundImage"
                      id="backgroundImage"
                      value={formData.backgroundImage}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
                          : "border-gray-300 focus:border-blue-500"
                      } focus:ring-blue-500 focus:outline-none focus:ring-1 py-2 px-3`}
                      disabled={loading}
                    />
                    <p
                      className={`mt-1 text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("admin.categories.dialogFieldBgImageHelp")}
                    </p>
                  </div>

                  {/* Active toggle */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={loading}
                    />
                    <label
                      htmlFor="isActive"
                      className={`ml-2 block text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("admin.categories.dialogFieldIsActive")}
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div
                className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {dialogType === "add" ? (
                    <>
                      <PlusIcon className="w-5 h-5 mr-1" />
                      {t("admin.categories.dialogSaveButton")}
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-5 h-5 mr-1" />
                      {t("admin.categories.dialogUpdateButton")}
                    </>
                  )}
                  {loading && (
                    <svg
                      className="animate-spin ml-1 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  className={`mt-3 w-full inline-flex justify-center rounded-md border ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  } px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={handleCloseDialog}
                  disabled={loading}
                >
                  {t("common.cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
