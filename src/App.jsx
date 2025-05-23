import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider as MUIThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { Box } from "@mui/material";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/Shared/Footer";

// Auth Components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ExpertRegister from "./components/Auth/ExpertRegister";
import { AuthProvider } from "./context/AuthContext";

// Profile Components
import ExpertProfile from "./components/Profile/ExpertProfile";
import UserProfile from "./components/Profile/UserProfile";

// Payment Components
import SepaPayment from "./components/Payment/SepaPayment";
import SetupSepaPayment from "./components/Payment/SetupSepaPayment";
import PaymentConfirmation from "./components/Shared/PaymentConfirmation";

// Chat Components
import Chat from "./components/Chat/Chat";
import ChatRoom from "./components/Chat/ChatRoom";

// Ad Components
import CreateAd from "./components/Ads/CreateAd";
import MyAds from "./components/Ads/MyAds";
import AdList from "./components/Ads/AdList";
import AdDetail from "./components/Ads/AdDetail";

// Page Components
import HomePage from "./components/pages/HomePage";
import RequestList from "./components/pages/RequestList";
import CategoryDetail from "./components/pages/CategoryDetail";
import ServiceDetail from "./components/pages/ServiceDetail";
import ExpertPage from "./components/pages/ExpertPage";

// Company Pages
import AboutUs from "./components/pages/company/AboutUs";
import Careers from "./components/pages/company/Careers";
import ContactUs from "./components/pages/company/ContactUs";

// Services Pages
import HomeRenovation from "./components/pages/services/HomeRenovation";
import GardenDesign from "./components/pages/services/GardenDesign";
import SpecialProjects from "./components/pages/services/SpecialProjects";
import ServicesPage from "./components/pages/services/Services";

// Support Pages
import HelpCenter from "./components/pages/support/HelpCenter";
import PrivacyPolicy from "./components/pages/support/PrivacyPolicy";
import TermsOfService from "./components/pages/support/TermsOfService";
import Unauthorized from "./components/pages/Unauthorized";

// Admin Components
import AdminLayout from "./components/admin/layout/AdminLayout";
import Dashboard from "./components/admin/dashboard/Dashboard";
import UserList from "./components/admin/users/UserList";
import AdminAdList from "./components/admin/ads/AdList";
import StorageManagement from "./components/admin/storage/StorageManagement";
import Settings from "./components/admin/settings/Settings";
import Messages from "./components/admin/messages/Messages";
import Payments from "./components/admin/payments/Payments";
import Analytics from "./components/admin/analytics/Analytics";
import Categories from "./components/admin/categories/Categories";
import Services from "./components/admin/categories/Services";
import AdminGuard from "./guards/AdminGuard";

// Theme and Language
import { useCustomTheme } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  const { theme: customTheme } = useCustomTheme();

  return (
    <LanguageProvider>
      <MUIThemeProvider theme={customTheme}>
        <CssBaseline />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminGuard>
                    <AdminLayout>
                      <Dashboard />
                    </AdminLayout>
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminGuard>
                    <AdminLayout>
                      <Dashboard />
                    </AdminLayout>
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminGuard>
                    <AdminLayout>
                      <UserList />
                    </AdminLayout>
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/ads"
                element={
                  <AdminGuard>
                    <AdminLayout>
                      <AdminAdList />
                    </AdminLayout>
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/storage"
                element={
                  <AdminGuard>
                    <AdminLayout>
                      <StorageManagement />
                    </AdminLayout>
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/messages"
                element={
                  <AdminGuard>
                    <AdminLayout>
                      <Messages />
                    </AdminLayout>
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <AdminGuard>
                    <AdminLayout>
                      <Analytics />
                    </AdminLayout>
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/payments"
                element={
                  <AdminGuard>
                    <AdminLayout>
                      <Payments />
                    </AdminLayout>
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <AdminGuard>
                    <AdminLayout>
                      <Settings />
                    </AdminLayout>
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <AdminGuard>
                    <AdminLayout>
                      <Categories />
                    </AdminLayout>
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <AdminGuard>
                    <AdminLayout>
                      <Services />
                    </AdminLayout>
                  </AdminGuard>
                }
              />

              {/* Main App Routes */}
              <Route
                path="*"
                element={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "100vh",
                    }}
                  >
                    <Navbar />
                    <Box component="main" sx={{ flexGrow: 1 }}>
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                          path="/expert-register"
                          element={<ExpertRegister />}
                        />

                        {/* Kategori ve Servis Detay Sayfaları */}
                        <Route
                          path="/kategori/:id"
                          element={<CategoryDetail />}
                        />
                        <Route path="/servis/:id" element={<ServiceDetail />} />

                        {/* Profile Routes */}
                        <Route
                          path="/expert-profile"
                          element={<ExpertProfile />}
                        />
                        <Route path="/user-profile" element={<UserProfile />} />

                        {/* Payment Routes */}
                        <Route path="/sepa-payment" element={<SepaPayment />} />
                        <Route
                          path="/setup-sepa-payment"
                          element={<SetupSepaPayment />}
                        />
                        <Route
                          path="/payment-confirmation"
                          element={<PaymentConfirmation />}
                        />

                        {/* Ad Routes */}
                        <Route path="/ads" element={<AdList />} />
                        <Route path="/ads/:id" element={<AdDetail />} />
                        <Route path="/create-ad" element={<CreateAd />} />
                        <Route path="/my-ads" element={<MyAds />} />

                        {/* Request Routes */}
                        <Route path="/requests" element={<RequestList />} />

                        {/* Chat Routes */}
                        <Route path="/chat/:chatRoomId" element={<Chat />} />
                        <Route path="/chat-rooms" element={<ChatRoom />} />

                        {/* Company Pages */}
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/careers" element={<Careers />} />
                        <Route path="/contact" element={<ContactUs />} />

                        {/* Services Pages */}
                        <Route
                          path="/services/home-renovation"
                          element={<HomeRenovation />}
                        />
                        <Route
                          path="/services/garden-design"
                          element={<GardenDesign />}
                        />
                        <Route
                          path="/services/special-projects"
                          element={<SpecialProjects />}
                        />
                        {/* Services List Page */}
                        <Route path="/services" element={<ServicesPage />} />

                        {/* Experts List Page */}
                        <Route path="/experts" element={<ExpertPage />} />

                        {/* Support Pages */}
                        <Route path="/help" element={<HelpCenter />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route
                          path="/unauthorized"
                          element={<Unauthorized />}
                        />
                      </Routes>
                    </Box>
                    <Footer />
                  </Box>
                }
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </MUIThemeProvider>
    </LanguageProvider>
  );
}

export default App;
