import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const AdList = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [adsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

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
    if (window.confirm("Bu ilanı silmek istediğinizden emin misiniz?")) {
      try {
        const token = localStorage.getItem("accessToken");
        await api.delete(`/api/v1/admin/ads/${adId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // İlan listesini güncelle
        setAds((prevAds) => prevAds.filter((ad) => ad.id !== adId));
        toast.success("İlan başarıyla silindi.");
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

      toast.success(
        `İlan durumu ${newStatus ? "aktif" : "pasif"} olarak güncellendi.`
      );
    } catch (error) {
      console.error("İlan durumu güncellenirken hata oluştu:", error);
      toast.error("İlan durumu güncellenirken bir hata oluştu.");
    }
  };

  // Arama ve filtreleme
  const filteredAds = ads.filter((ad) => {
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch =
      ad.title?.toLowerCase().includes(searchValue) ||
      ad.descriptions?.toLowerCase().includes(searchValue) ||
      ad.userName?.toLowerCase().includes(searchValue);

    const matchesCategory =
      !selectedCategory || ad.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sayfalama
  const indexOfLastAd = currentPage * adsPerPage;
  const indexOfFirstAd = indexOfLastAd - adsPerPage;
  const currentAds = filteredAds.slice(indexOfFirstAd, indexOfLastAd);
  const totalPages = Math.ceil(filteredAds.length / adsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">İlan Yönetimi</h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative flex-grow">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="İlan ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Başlık
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Sahibi
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Kategori
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Durum
              </th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">İşlemler</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  İlanlar yükleniyor...
                </td>
              </tr>
            ) : currentAds.length > 0 ? (
              currentAds.map((ad) => (
                <tr key={ad.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {ad.title}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {ad.userName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {ad.categoryName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        ad.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {ad.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => window.open(`/ads/${ad.id}`, "_blank")}
                        className="text-gray-600 hover:text-gray-900"
                        title="Görüntüle"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(ad)}
                        className={`${
                          ad.isActive
                            ? "text-red-600 hover:text-red-900"
                            : "text-green-600 hover:text-green-900"
                        }`}
                        title={ad.isActive ? "Pasif Yap" : "Aktif Yap"}
                      >
                        <span className="text-xs font-medium">
                          {ad.isActive ? "PASİF" : "AKTİF"}
                        </span>
                      </button>
                      <button
                        onClick={() => handleDeleteAd(ad.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Sil"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  İlan bulunamadı
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
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                currentPage === 1 ? "cursor-not-allowed" : ""
              }`}
            >
              <span className="sr-only">Önceki</span>
              &laquo;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === number
                      ? "bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  }`}
                >
                  {number}
                </button>
              )
            )}

            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                currentPage === totalPages ? "cursor-not-allowed" : ""
              }`}
            >
              <span className="sr-only">Sonraki</span>
              &raquo;
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AdList;
