import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Divider,
  useTheme,
} from "@mui/material";
import { useCustomTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import PeopleIcon from "@mui/icons-material/People";
import PageviewIcon from "@mui/icons-material/Pageview";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

// Bu örnek verileri gerçek API'den alınacak verilerle değiştirin
const mockData = {
  usersStats: {
    total: 1250,
    new: 48,
    active: 785,
    experts: 320,
  },
  trafficStats: {
    views: 23500,
    uniqueVisitors: 5700,
    avgTime: "3:45",
    bounceRate: "28%",
  },
  serviceStats: {
    completed: 320,
    active: 145,
    cancelled: 28,
    satisfaction: "92%",
  },
  revenueStats: {
    total: "€43,250",
    thisMonth: "€7,820",
    lastMonth: "€6,540",
    growth: "+19.6%",
  },
};

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState(null);
  const { mode } = useCustomTheme();
  const { t } = useLanguage();
  const theme = useTheme();
  const isDarkMode = mode === "dark";

  useEffect(() => {
    // Gerçek uygulamada burada API'den veri çekilecek
    const fetchData = async () => {
      try {
        // API çağrısı simülasyonu
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setData(mockData);
      } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 600 }}
      >
        {t("admin.analytics")}
      </Typography>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label={t("admin.overview")} />
          <Tab label={t("admin.users")} />
          <Tab label={t("admin.traffic")} />
          <Tab label={t("admin.revenue")} />
        </Tabs>
      </Paper>

      {/* Genel Bakış */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Card
              sx={{
                height: "100%",
                bgcolor: isDarkMode ? "background.paper" : "#fff",
                boxShadow: theme.shadows[3],
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PeopleIcon
                    sx={{
                      color: theme.palette.primary.main,
                      fontSize: 36,
                      mr: 1,
                    }}
                  />
                  <Typography variant="h6">{t("admin.users")}</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 600 }}>
                  {data.usersStats.total}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "success.main", fontWeight: 500, mt: 1 }}
                >
                  +{data.usersStats.new} {t("admin.newUsers")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card
              sx={{
                height: "100%",
                bgcolor: isDarkMode ? "background.paper" : "#fff",
                boxShadow: theme.shadows[3],
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PageviewIcon
                    sx={{
                      color: theme.palette.info.main,
                      fontSize: 36,
                      mr: 1,
                    }}
                  />
                  <Typography variant="h6">{t("admin.pageViews")}</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 600 }}>
                  {data.trafficStats.views.toLocaleString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 1 }}
                >
                  {data.trafficStats.uniqueVisitors.toLocaleString()}{" "}
                  {t("admin.uniqueVisitors")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card
              sx={{
                height: "100%",
                bgcolor: isDarkMode ? "background.paper" : "#fff",
                boxShadow: theme.shadows[3],
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <AssignmentTurnedInIcon
                    sx={{
                      color: theme.palette.success.main,
                      fontSize: 36,
                      mr: 1,
                    }}
                  />
                  <Typography variant="h6">{t("admin.services")}</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 600 }}>
                  {data.serviceStats.completed}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 1 }}
                >
                  {data.serviceStats.active} {t("admin.activeServices")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card
              sx={{
                height: "100%",
                bgcolor: isDarkMode ? "background.paper" : "#fff",
                boxShadow: theme.shadows[3],
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <AttachMoneyIcon
                    sx={{
                      color: theme.palette.warning.main,
                      fontSize: 36,
                      mr: 1,
                    }}
                  />
                  <Typography variant="h6">{t("admin.revenue")}</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 600 }}>
                  {data.revenueStats.total}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "success.main", fontWeight: 500, mt: 1 }}
                >
                  {data.revenueStats.growth} {t("admin.monthOverMonth")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Detaylı İstatistikler - Genel Bakış */}
          <Grid item xs={12}>
            <Card
              sx={{
                mt: 3,
                bgcolor: isDarkMode ? "background.paper" : "#fff",
                boxShadow: theme.shadows[3],
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t("admin.keyMetrics")}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("admin.expertUsers")}
                    </Typography>
                    <Typography variant="h6">
                      {data.usersStats.experts}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("admin.averageSessionTime")}
                    </Typography>
                    <Typography variant="h6">
                      {data.trafficStats.avgTime}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("admin.customerSatisfaction")}
                    </Typography>
                    <Typography variant="h6">
                      {data.serviceStats.satisfaction}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("admin.currentMonthRevenue")}
                    </Typography>
                    <Typography variant="h6">
                      {data.revenueStats.thisMonth}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Kullanıcı İstatistikleri */}
      {activeTab === 1 && (
        <Card
          sx={{
            p: 3,
            bgcolor: isDarkMode ? "background.paper" : "#fff",
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="h5" gutterBottom>
            {t("admin.userStatistics")}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                {t("admin.totalUsers")}
              </Typography>
              <Typography variant="h3" gutterBottom>
                {data.usersStats.total}
              </Typography>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.activeUsers")}
                  </Typography>
                  <Typography variant="h6">{data.usersStats.active}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.newUsersThisMonth")}
                  </Typography>
                  <Typography variant="h6">{data.usersStats.new}</Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                {t("admin.userCategories")}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.standardUsers")}
                  </Typography>
                  <Typography variant="h6">
                    {data.usersStats.total - data.usersStats.experts}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.expertUsers")}
                  </Typography>
                  <Typography variant="h6">
                    {data.usersStats.experts}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Trafik İstatistikleri */}
      {activeTab === 2 && (
        <Card
          sx={{
            p: 3,
            bgcolor: isDarkMode ? "background.paper" : "#fff",
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="h5" gutterBottom>
            {t("admin.trafficAnalytics")}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                {t("admin.visitorOverview")}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.totalPageViews")}
                  </Typography>
                  <Typography variant="h6">
                    {data.trafficStats.views.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.uniqueVisitors")}
                  </Typography>
                  <Typography variant="h6">
                    {data.trafficStats.uniqueVisitors.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                {t("admin.performanceMetrics")}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.averageSessionDuration")}
                  </Typography>
                  <Typography variant="h6">
                    {data.trafficStats.avgTime}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.bounceRate")}
                  </Typography>
                  <Typography variant="h6">
                    {data.trafficStats.bounceRate}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Gelir İstatistikleri */}
      {activeTab === 3 && (
        <Card
          sx={{
            p: 3,
            bgcolor: isDarkMode ? "background.paper" : "#fff",
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="h5" gutterBottom>
            {t("admin.revenueAnalytics")}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                {t("admin.revenueOverview")}
              </Typography>
              <Typography variant="h3" gutterBottom>
                {data.revenueStats.total}
              </Typography>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.thisMonth")}
                  </Typography>
                  <Typography variant="h6">
                    {data.revenueStats.thisMonth}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.lastMonth")}
                  </Typography>
                  <Typography variant="h6">
                    {data.revenueStats.lastMonth}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                {t("admin.growthMetrics")}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.monthlyGrowth")}
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {data.revenueStats.growth}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.completedServices")}
                  </Typography>
                  <Typography variant="h6">
                    {data.serviceStats.completed}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      )}
    </Box>
  );
};

export default Analytics;
