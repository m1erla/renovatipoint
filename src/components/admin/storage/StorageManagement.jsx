import React, { useState, useEffect, useMemo } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { useCustomTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import {
  Box,
  Typography,
  Card,
  Grid,
  CircularProgress,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Pagination,
  Paper,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Tooltip,
  useTheme,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import GetAppIcon from "@mui/icons-material/GetApp";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FolderIcon from "@mui/icons-material/Folder";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const StorageManagement = () => {
  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [filter, setFilter] = useState("all");
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const theme = useTheme();
  const isDarkMode = mode === "dark";

  // Stilleri memoize et
  const styles = useMemo(
    () => ({
      container: {
        p: 3,
        backgroundColor: isDarkMode ? "rgb(17, 24, 39)" : "background.paper",
        borderRadius: 1,
      },
      title: {
        mb: 3,
        color: isDarkMode ? "rgb(243, 244, 246)" : "text.primary",
      },
      paper: {
        backgroundColor: isDarkMode ? "rgb(31, 41, 55)" : "background.paper",
        boxShadow: theme.shadows[3],
        borderRadius: 1,
        p: 2,
      },
      header: {
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        mb: 3,
        gap: 2,
      },
      search: {
        backgroundColor: isDarkMode ? "rgb(55, 65, 81)" : "background.paper",
        borderRadius: 1,
        "& .MuiInputBase-input": {
          color: isDarkMode ? "rgb(209, 213, 219)" : "text.primary",
        },
        "& .MuiInputAdornment-root": {
          color: isDarkMode ? "rgb(156, 163, 175)" : "text.secondary",
        },
        width: { xs: "100%", sm: "auto" },
        flexGrow: { xs: 1, sm: 0 },
      },
      filterSelect: {
        minWidth: 150,
        backgroundColor: isDarkMode ? "rgb(55, 65, 81)" : "background.paper",
        "& .MuiSelect-select": {
          color: isDarkMode ? "rgb(209, 213, 219)" : "text.primary",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: isDarkMode ? "rgb(75, 85, 99)" : "rgba(0, 0, 0, 0.23)",
        },
        "& .MuiSvgIcon-root": {
          color: isDarkMode ? "rgb(209, 213, 219)" : "text.primary",
        },
      },
      actionButton: {
        color: isDarkMode ? "rgb(209, 213, 219)" : "text.secondary",
        "&:hover": {
          color: theme.palette.primary.main,
        },
      },
      card: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: isDarkMode ? "rgb(31, 41, 55)" : "white",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[6],
        },
      },
      cardMedia: {
        height: 0,
        paddingTop: "75%", // 4:3 aspect ratio
        backgroundColor: isDarkMode ? "rgb(55, 65, 81)" : "rgb(245, 245, 245)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      fileIcon: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: 60,
        color: isDarkMode ? "rgb(156, 163, 175)" : "rgba(0, 0, 0, 0.3)",
      },
      cardContent: {
        flexGrow: 1,
        p: 2,
      },
      fileName: {
        color: isDarkMode ? "rgb(229, 231, 235)" : "text.primary",
        fontWeight: 500,
        mb: 1,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
      fileType: {
        mt: 1,
        color: isDarkMode ? "rgb(156, 163, 175)" : "text.secondary",
        fontSize: "0.75rem",
      },
      userName: {
        mt: 0.5,
        color: isDarkMode ? "rgb(156, 163, 175)" : "text.secondary",
        fontSize: "0.875rem",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
      cardActions: {
        display: "flex",
        justifyContent: "space-between",
        p: 1,
        pt: 0,
      },
      noData: {
        textAlign: "center",
        py: 8,
        color: isDarkMode ? "rgb(156, 163, 175)" : "text.secondary",
      },
      paginationContainer: {
        display: "flex",
        justifyContent: "center",
        mt: 4,
      },
      pagination: {
        "& .MuiPaginationItem-root": {
          color: isDarkMode ? "rgb(209, 213, 219)" : "text.primary",
        },
        "& .Mui-selected": {
          backgroundColor: isDarkMode
            ? "rgba(59, 130, 246, 0.16)"
            : "rgba(25, 118, 210, 0.12)",
        },
      },
    }),
    [isDarkMode, theme]
  );

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
      toast.error(t("error.loadingStorageFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStorage = async (storageId) => {
    if (window.confirm(t("admin.confirmDeleteFile"))) {
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
        toast.success(t("admin.fileDeleted"));
      } catch (error) {
        console.error("Dosya silinirken hata oluştu:", error);
        toast.error(t("error.deletingFileFailed"));
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
      toast.error(t("error.downloadingFileFailed"));
    }
  };

  const handleRefresh = () => {
    fetchStorages();
  };

  // Dosya tipi ikonu belirleme
  const getFileIcon = (type) => {
    if (type?.startsWith("image/")) {
      return (
        <ImageIcon sx={{ fontSize: 60, color: theme.palette.info.main }} />
      );
    } else if (type?.startsWith("application/pdf")) {
      return (
        <PictureAsPdfIcon
          sx={{ fontSize: 60, color: theme.palette.error.main }}
        />
      );
    } else if (type?.startsWith("application/")) {
      return (
        <InsertDriveFileIcon
          sx={{ fontSize: 60, color: theme.palette.warning.main }}
        />
      );
    } else {
      return (
        <FolderIcon sx={{ fontSize: 60, color: theme.palette.warning.light }} />
      );
    }
  };

  // Dosya tipini okunabilir hale getir
  const getReadableFileType = (type) => {
    if (!type) return t("admin.unknownType");

    if (type.startsWith("image/")) {
      return `${t("admin.image")} (${type.split("/")[1].toUpperCase()})`;
    } else if (type === "application/pdf") {
      return "PDF";
    } else if (type.startsWith("application/")) {
      return type.split("/")[1].toUpperCase();
    } else {
      return type;
    }
  };

  // Arama ve filtreleme
  const filteredStorages = useMemo(() => {
    return storages.filter((storage) => {
      // Önce arama terimini kontrol et
      const searchValue = searchTerm.toLowerCase();
      const matchesSearch =
        (storage.name?.toLowerCase().includes(searchValue) ?? false) ||
        (storage.type?.toLowerCase().includes(searchValue) ?? false) ||
        (storage.user?.name?.toLowerCase().includes(searchValue) ?? false);

      // Sonra filtreyi kontrol et
      if (filter === "all") return matchesSearch;
      if (filter === "images")
        return matchesSearch && (storage.type?.startsWith("image/") ?? false);
      if (filter === "documents")
        return (
          matchesSearch && (storage.type?.startsWith("application/") ?? false)
        );
      return matchesSearch;
    });
  }, [searchTerm, filter, storages]);

  // Sayfalama
  const totalPages = Math.ceil(filteredStorages.length / itemsPerPage);
  const currentItems = filteredStorages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography variant="h5" component="h1" sx={styles.title}>
          {t("admin.storage")}
        </Typography>

        <Box
          sx={{ display: "flex", gap: 2, width: { xs: "100%", sm: "auto" } }}
        >
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            size="small"
          >
            {t("admin.refresh")}
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            size="small"
          >
            {t("admin.uploadFile")}
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <TextField
          placeholder={t("admin.searchFiles")}
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ ...styles.search, flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ width: { xs: "100%", sm: 200 } }}>
          <InputLabel id="file-filter-label">{t("admin.fileType")}</InputLabel>
          <Select
            labelId="file-filter-label"
            value={filter}
            label={t("admin.fileType")}
            onChange={handleFilterChange}
            sx={styles.filterSelect}
          >
            <MenuItem value="all">{t("admin.allFiles")}</MenuItem>
            <MenuItem value="images">{t("admin.imagesOnly")}</MenuItem>
            <MenuItem value="documents">{t("admin.documentsOnly")}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 8,
          }}
        >
          <CircularProgress />
          <Typography
            sx={{
              mt: 2,
              color: isDarkMode ? "rgb(156, 163, 175)" : "text.secondary",
            }}
          >
            {t("admin.loadingFiles")}
          </Typography>
        </Box>
      ) : currentItems.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {currentItems.map((storage) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={storage.id}>
                <Card sx={styles.card}>
                  <CardMedia sx={styles.cardMedia} title={storage.name}>
                    {storage.type?.startsWith("image/") ? (
                      <img
                        src={`/api/v1/admin/storages/view/${storage.name}`}
                        alt={storage.name}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          padding: "16px",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "path/to/placeholder.jpg";
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        {getFileIcon(storage.type)}
                      </Box>
                    )}
                  </CardMedia>

                  <CardContent sx={styles.cardContent}>
                    <Tooltip title={storage.name || ""}>
                      <Typography variant="subtitle1" sx={styles.fileName}>
                        {storage.name}
                      </Typography>
                    </Tooltip>

                    <Chip
                      label={getReadableFileType(storage.type)}
                      size="small"
                      color={
                        storage.type?.startsWith("image/") ? "info" : "default"
                      }
                      sx={{ height: 24, fontSize: "0.75rem" }}
                    />

                    <Typography variant="body2" sx={styles.userName}>
                      {t("admin.owner")}:{" "}
                      {storage.user?.name || t("admin.unknown")}
                    </Typography>
                  </CardContent>

                  <CardActions sx={styles.cardActions}>
                    <Tooltip title={t("admin.downloadFile")}>
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(storage.name)}
                        sx={styles.actionButton}
                      >
                        <GetAppIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={t("admin.deleteFile")}>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteStorage(storage.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Sayfalama */}
          {totalPages > 1 && (
            <Box sx={styles.paginationContainer}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                sx={styles.pagination}
              />
            </Box>
          )}
        </>
      ) : (
        <Paper sx={styles.paper}>
          <Box sx={styles.noData}>
            <FolderIcon sx={{ fontSize: 60, color: "grey.500", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {t("admin.noFilesFound")}
            </Typography>
            <Typography variant="body2">
              {t("admin.noFilesFoundDescription")}
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default StorageManagement;
