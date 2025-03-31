import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import {
  TrashIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  PhotoIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";

const StorageManagement = () => {
  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchStorages();
  }, []);

  const fetchStorages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await api.get("/api/v1/admin/storages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStorages(response.data || []);
    } catch (error) {
      console.error("Dosyalar yüklenirken hata oluştu:", error);
      toast.error("Dosyalar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStorage = async (storageId) => {
    if (window.confirm("Bu dosyayı silmek istediğinizden emin misiniz?")) {
      try {
        const token = localStorage.getItem("accessToken");
        await api.delete(`/api/v1/admin/storages/${storageId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Dosya listesini güncelle
        setStorages((prevStorages) =>
          prevStorages.filter((storage) => storage.id !== storageId)
        );
        toast.success("Dosya başarıyla silindi.");
      } catch (error) {
        console.error("Dosya silinirken hata oluştu:", error);
        toast.error("Dosya silinirken bir hata oluştu.");
      }
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get(
        `/api/v1/admin/storages/download/${fileName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      // Dosyayı indir
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Dosya indirilirken hata oluştu:", error);
      toast.error("Dosya indirilirken bir hata oluştu.");
    }
  };

  // Dosya tipi ikonu belirleme
  const getFileIcon = (type) => {
    if (type?.startsWith("image/")) {
      return <PhotoIcon className="h-8 w-8 text-blue-500" />;
    } else if (type?.startsWith("application/pdf")) {
      return <DocumentIcon className="h-8 w-8 text-red-500" />;
    } else {
      return <FolderIcon className="h-8 w-8 text-yellow-500" />;
    }
  };

  // Filtreleme
  const filteredStorages = storages.filter((storage) => {
    // Önce arama terimini kontrol et
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch =
      storage.name?.toLowerCase().includes(searchValue) ||
      storage.type?.toLowerCase().includes(searchValue);

    // Sonra filtreyi kontrol et
    if (filter === "all") return matchesSearch;
    if (filter === "images")
      return matchesSearch && storage.type?.startsWith("image/");
    if (filter === "documents")
      return matchesSearch && storage.type?.startsWith("application/");
    return matchesSearch;
  });

  // Sayfalama
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStorages.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredStorages.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Depolama Yönetimi
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative flex-grow">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Dosya ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tüm Dosyalar</option>
            <option value="images">Resimler</option>
            <option value="documents">Dokümanlar</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-500">Dosyalar yükleniyor...</p>
        </div>
      ) : currentItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {currentItems.map((storage) => (
              <div
                key={storage.id}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                <div className="h-48 flex items-center justify-center p-4 bg-gray-50">
                  {storage.type?.startsWith("image/") ? (
                    <img
                      src={`/api/v1/admin/storages/view/${storage.name}`}
                      alt={storage.name}
                      className="h-full w-full object-contain object-center"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "path/to/placeholder.jpg";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      {getFileIcon(storage.type)}
                      <span className="mt-2 text-sm text-gray-500">
                        {storage.type}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col space-y-2 p-4">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                    {storage.name}
                  </h3>
                  <div className="flex flex-1 flex-col justify-end">
                    <p className="text-sm text-gray-500">
                      Kullanıcı: {storage.user?.name || "Bilinmiyor"}
                    </p>
                    <div className="flex justify-between mt-2">
                      <button
                        onClick={() => handleDownload(storage.name)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStorage(storage.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sayfalama */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
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
                  onClick={() =>
                    paginate(Math.min(totalPages, currentPage + 1))
                  }
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
        </>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Dosya bulunamadı
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Arama kriterlerinize uygun dosya bulunamadı.
          </p>
        </div>
      )}
    </div>
  );
};

export default StorageManagement;
