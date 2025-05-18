import React, { useState, useEffect, useMemo } from "react";
import { useCustomTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  CircularProgress,
  Divider,
  Switch,
  FormControlLabel,
  Pagination,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import RefreshIcon from "@mui/icons-material/Refresh";
import PublishIcon from "@mui/icons-material/Publish";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { slugify, slugToTranslationKey } from "../../../utils/slugify";
import { getTranslationKeyFromTurkishName } from "../../../utils/translationHelper";

const Services = () => {
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const theme = useTheme();
  const isDarkMode = mode === "dark";

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("add"); // "add" or "edit"
  const [selectedService, setSelectedService] = useState(null);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    categoryId: "",
    features: "",
    isPopular: false,
    isActive: true,
    image: "",
  });

  // Styles memoized
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
      filters: {
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        mb: 3,
        alignItems: { xs: "stretch", sm: "center" },
      },
      tableContainer: {
        backgroundColor: isDarkMode ? "rgb(31, 41, 55)" : "background.paper",
        boxShadow: theme.shadows[isDarkMode ? 0 : 1],
        borderRadius: 1,
        "& .MuiTableCell-head": {
          backgroundColor: isDarkMode
            ? "rgb(55, 65, 81)"
            : theme.palette.grey[100],
          color: isDarkMode ? "rgb(209, 213, 219)" : theme.palette.text.primary,
          fontWeight: 600,
        },
        "& .MuiTableCell-body": {
          color: isDarkMode ? "rgb(209, 213, 219)" : theme.palette.text.primary,
          borderBottom: `1px solid ${
            isDarkMode ? "rgb(55, 65, 81)" : theme.palette.divider
          }`,
        },
        "& .MuiTablePagination-root": {
          color: isDarkMode ? "rgb(209, 213, 219)" : theme.palette.text.primary,
        },
        "& .MuiTableSortLabel-icon": {
          color: isDarkMode ? "rgb(156, 163, 175)" : undefined,
        },
        "& .MuiTableSortLabel-root.Mui-active": {
          color: isDarkMode ? theme.palette.primary.light : undefined,
        },
        "& .MuiTableSortLabel-root:hover": {
          color: isDarkMode ? theme.palette.primary.light : undefined,
        },
      },
      dialog: {
        "& .MuiDialog-paper": {
          backgroundColor: isDarkMode ? "rgb(31, 41, 55)" : "background.paper",
          color: isDarkMode ? "rgb(209, 213, 219)" : "text.primary",
        },
      },
      dialogTitle: {
        backgroundColor: isDarkMode ? "rgb(31, 41, 55)" : "background.paper",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pr: 2,
      },
      dialogContent: {
        py: 2,
      },
      formField: {
        mb: 2,
        "& .MuiInputBase-input": {
          color: isDarkMode ? "rgb(209, 213, 219)" : "text.primary",
        },
        "& .MuiInputLabel-root": {
          color: isDarkMode ? "rgb(156, 163, 175)" : "text.secondary",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: isDarkMode ? "rgb(75, 85, 99)" : "rgba(0, 0, 0, 0.23)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: isDarkMode
            ? "rgb(107, 114, 128)"
            : "rgba(0, 0, 0, 0.87)",
        },
      },
      formSwitch: {
        "& .MuiSwitch-switchBase.Mui-checked": {
          color: theme.palette.primary.main,
        },
        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
          backgroundColor: theme.palette.primary.main,
        },
      },
      chip: {
        mr: 0.5,
        mb: 0.5,
      },
      actionButton: {
        color: isDarkMode ? "rgb(209, 213, 219)" : "text.secondary",
        "&:hover": {
          color: theme.palette.primary.main,
        },
      },
      noData: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        textAlign: "center",
      },
    }),
    [isDarkMode, theme]
  );

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      // Using mock data for now
      const response = await fetch("/data/services/services.json");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      // Simulate API delay
      setTimeout(() => {
        setServices(data);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error(t("admin.services.toastFetchError"));
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Using mock data for now
      const response = await fetch("/data/categories/categories.json");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(t("admin.services.toastFetchCategoriesError"));
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
    setPage(0);
  };

  const handleOpenDialog = (type, service = null) => {
    setDialogType(type);

    if (type === "edit" && service) {
      setSelectedService(service);
      setFormData({
        name: service.name,
        slug: service.slug,
        description: service.description,
        price: service.price,
        categoryId: service.categoryId.toString(), // Ensure it's string for Select
        features: Array.isArray(service.features)
          ? service.features.join("\n") // Join array to string for textarea
          : service.features || "",
        isPopular: service.isPopular || false,
        isActive: service.isActive,
        image: service.image || "",
      });
    } else {
      setSelectedService(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        price: 0,
        categoryId: "",
        features: "",
        isPopular: false,
        isActive: true,
        image: "",
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
    if (
      !formData.name ||
      !formData.slug ||
      !formData.description ||
      !formData.categoryId
    ) {
      toast.error(t("common.formValidation.requiredFields"));
      return;
    }

    // Parse features string to array
    const formattedData = {
      ...formData,
      features: formData.features
        .split("\n")
        .filter((item) => item.trim() !== ""),
      price: parseFloat(formData.price),
      categoryId: parseInt(formData.categoryId), // Ensure categoryId is number if needed by backend
    };

    try {
      setLoading(true); // Show loading state
      if (dialogType === "add") {
        // Simulate adding a new service
        const newService = {
          ...formattedData,
          id: services.length + 1, // Simple ID generation for mock
          orderCount: 0,
          rating: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setServices([...services, newService]);
        toast.success(t("admin.services.toastCreateSuccess"));
      } else {
        // Simulate updating a service
        const updatedServices = services.map((svc) =>
          svc.id === selectedService.id
            ? { ...svc, ...formattedData, updatedAt: new Date().toISOString() }
            : svc
        );
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setServices(updatedServices);
        toast.success(t("admin.services.toastUpdateSuccess"));
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error during service operation:", error);
      toast.error(
        dialogType === "add"
          ? t("admin.services.toastCreateError")
          : t("admin.services.toastUpdateError")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    // Show confirmation dialog
    if (!window.confirm(t("admin.services.deleteConfirmText"))) {
      return;
    }

    try {
      setLoading(true);
      // Simulate deleting a service
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const updatedServices = services.filter((svc) => svc.id !== serviceId);
      setServices(updatedServices);
      toast.success(t("admin.services.toastDeleteSuccess"));
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error(t("admin.services.toastDeleteError"));
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter services based on search term and category filter
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const nameMatch = service.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const descriptionMatch = service.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesSearch = nameMatch || descriptionMatch;

      const matchesCategory =
        categoryFilter === "all" ||
        service.categoryId.toString() === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, categoryFilter]);

  // Sort filtered services
  const sortedServices = useMemo(() => {
    return [...filteredServices].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      // Handle category name sorting
      if (orderBy === "categoryId") {
        aValue = getCategoryName(a.categoryId).toLowerCase();
        bValue = getCategoryName(b.categoryId).toLowerCase();
      }

      // Ensure consistent type comparison (e.g., strings)
      if (typeof aValue === "number") aValue = aValue.toString();
      if (typeof bValue === "number") bValue = bValue.toString();

      if (typeof aValue === "string" && typeof bValue === "string") {
        return order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        // Fallback for non-string types (though price is handled above)
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }
    });
  }, [filteredServices, order, orderBy, categories]); // Add categories dependency for getCategoryName

  // Paginate sorted services
  const paginatedServices = sortedServices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Get category name from ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (cat) => cat.id.toString() === categoryId.toString()
    );
    // Return translated category name or a fallback translation
    return category
      ? t(getTranslationKeyFromTurkishName(category.name, "category"))
      : t("common.unknownCategory");
  };

  // Format price
  const formatPrice = (price) => {
    // Use browser's locale for formatting - can be enhanced with language context
    return new Intl.NumberFormat(navigator.language, {
      style: "currency",
      currency: "TRY", // Assuming TRY, make dynamic if needed
    }).format(price);
  };

  const tableHeaders = [
    { id: "id", label: "#", width: "5%" },
    {
      id: "name",
      label: t("admin.services.table.name"),
      width: "20%",
      sortable: true,
    },
    {
      id: "description",
      label: t("admin.services.table.description"),
      width: "25%",
    }, // Need translation
    {
      id: "categoryId",
      label: t("admin.services.table.category"),
      width: "15%",
      sortable: true,
    },
    {
      id: "price",
      label: t("admin.services.table.price"),
      width: "10%",
      sortable: true,
    },
    { id: "status", label: t("admin.services.table.status"), width: "10%" },
    {
      id: "actions",
      label: t("admin.services.table.actions"),
      width: "15%",
      align: "right",
    },
  ];

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography variant="h5" component="h1" sx={styles.title}>
          {t("admin.services.title")}
        </Typography>

        <Box
          sx={{ display: "flex", gap: 2, width: { xs: "100%", sm: "auto" } }}
        >
          <Tooltip title={t("admin.services.refreshButton")}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              size="small"
              onClick={() => {
                fetchServices();
                fetchCategories();
              }}
              disabled={loading}
            >
              {t("admin.services.refreshButton")}
            </Button>
          </Tooltip>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog("add")}
            disabled={loading}
          >
            {t("admin.services.addButton")}
          </Button>
        </Box>
      </Box>

      <Box sx={styles.filters}>
        <TextField
          placeholder={t("admin.services.searchPlaceholder")}
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ ...styles.search, flex: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          disabled={loading}
        />

        <FormControl
          size="small"
          sx={{ minWidth: 200, flex: 1 }}
          disabled={loading}
        >
          <InputLabel id="category-filter-label">
            {t("admin.services.table.category")}
          </InputLabel>
          <Select
            labelId="category-filter-label"
            value={categoryFilter}
            label={t("admin.services.table.category")}
            onChange={handleCategoryFilterChange}
          >
            <MenuItem value="all">{t("admin.services.allCategories")}</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id.toString()}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : filteredServices.length > 0 ? (
        <TableContainer component={Paper} sx={styles.tableContainer}>
          <Table sx={{ minWidth: 650 }} aria-label="services table">
            <TableHead>
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableCell
                    key={header.id}
                    width={header.width}
                    align={header.align || "left"}
                    sortDirection={orderBy === header.id ? order : false}
                  >
                    {header.sortable ? (
                      <TableSortLabel
                        active={orderBy === header.id}
                        direction={orderBy === header.id ? order : "asc"}
                        onClick={() => handleRequestSort(header.id)}
                      >
                        {header.label}
                      </TableSortLabel>
                    ) : (
                      header.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedServices.map((service) => (
                <TableRow
                  key={service.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {service.id}
                  </TableCell>
                  <TableCell
                    sx={{
                      color:
                        styles.tableContainer["& .MuiTableCell-body"].color,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {service.image && (
                        <img
                          src={service.image}
                          alt={t(`services.${service.slug}`)}
                          style={{
                            width: 40,
                            height: 40,
                            marginRight: 10,
                            borderRadius: "4px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {t(`services.${service.slug}`)}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {service.description}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{getCategoryName(service.categoryId)}</TableCell>
                  <TableCell>{formatPrice(service.price)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      <Chip
                        label={
                          service.isActive
                            ? t("admin.services.statusActive")
                            : t("admin.services.statusInactive")
                        }
                        size="small"
                        color={service.isActive ? "success" : "error"}
                        variant="outlined"
                        sx={styles.chip}
                      />
                      {service.isPopular && (
                        <Chip
                          label={t("admin.services.popularYes")}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={styles.chip}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t("admin.services.previewButton")}>
                      <IconButton
                        size="small"
                        sx={styles.actionButton}
                        disabled={loading}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("admin.services.editButton")}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog("edit", service)}
                        sx={styles.actionButton}
                        disabled={loading}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("admin.services.deleteButton")}>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteService(service.id)}
                        color="error"
                        disabled={loading}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredServices.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            // Need translation for labelRowsPerPage
            // labelRowsPerPage={t("admin.table.rowsPerPage")}
            labelRowsPerPage="Rows per page:"
            sx={{ color: isDarkMode ? "text.secondary" : undefined }}
          />
        </TableContainer>
      ) : (
        <Box sx={styles.noData}>
          <HomeRepairServiceIcon
            sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            {searchTerm || categoryFilter !== "all"
              ? t("admin.services.noSearchResults")
              : t("admin.services.noServices")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {searchTerm || categoryFilter !== "all"
              ? t("admin.services.adjustSearchFilter") // Add this key
              : t("admin.services.addFirstService")}
          </Typography>
        </Box>
      )}

      {/* Service Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        sx={styles.dialog}
      >
        <DialogTitle sx={styles.dialogTitle}>
          {dialogType === "add"
            ? t("admin.services.dialogAddTitle")
            : t("admin.services.dialogEditTitle")}
          <IconButton
            onClick={handleCloseDialog}
            size="small"
            disabled={loading}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={styles.dialogContent}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label={t("admin.services.dialogFieldName")}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                sx={styles.formField}
                disabled={loading}
              />

              <TextField
                label={t("admin.services.dialogFieldSlug")}
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                helperText={t("admin.services.dialogFieldSlugHelp")}
                sx={styles.formField}
                disabled={loading}
              />

              <TextField
                label={t("admin.services.dialogFieldDescription")}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
                required
                sx={styles.formField}
                disabled={loading}
              />

              <TextField
                label={t("admin.services.dialogFieldPrice")}
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required // Price should likely be required
                sx={styles.formField}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₺</InputAdornment>
                  ),
                  inputProps: { min: 0, step: 0.01 }, // Allow decimals
                }}
              />

              <FormControl
                fullWidth
                margin="normal"
                sx={styles.formField}
                required
                disabled={loading}
              >
                <InputLabel id="category-select-label">
                  {t("admin.services.dialogFieldCategory")}
                </InputLabel>
                <Select
                  labelId="category-select-label"
                  name="categoryId"
                  value={formData.categoryId}
                  label={t("admin.services.dialogFieldCategory")}
                  onChange={handleInputChange}
                >
                  {/* Add a placeholder/default option? */}
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label={t("admin.services.dialogFieldFeatures")}
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={6}
                margin="normal"
                helperText={t("admin.services.dialogFieldFeaturesHelp")}
                sx={styles.formField}
                disabled={loading}
              />

              <TextField
                label={t("admin.services.dialogFieldImage")}
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                helperText={t("admin.services.dialogFieldImageHelp")}
                sx={styles.formField}
                disabled={loading}
              />

              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="isPopular"
                      checked={formData.isPopular}
                      onChange={handleInputChange}
                      color="primary"
                    />
                  }
                  label={t("admin.services.dialogFieldIsPopular")}
                  sx={styles.formSwitch}
                  disabled={loading}
                />
                <FormControlLabel
                  control={
                    <Switch
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      color="primary"
                    />
                  }
                  label={t("admin.services.dialogFieldIsActive")}
                  sx={styles.formSwitch}
                  disabled={loading}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseDialog}
            color="inherit"
            disabled={loading}
          >
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            startIcon={dialogType === "add" ? <AddIcon /> : <PublishIcon />}
            disabled={loading}
          >
            {dialogType === "add"
              ? t("admin.services.dialogSaveButton") // Use Save for Add
              : t("admin.services.dialogUpdateButton")}
            {loading && (
              <CircularProgress size={20} sx={{ ml: 1, color: "white" }} />
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Services;
