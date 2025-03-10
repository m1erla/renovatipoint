import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider as MUIThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { Box } from "@mui/material";

// Layout Components
import Navbar from "./components/Shared/Navbar";
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

// Page Components
import HomePage from "./components/pages/HomePage";
import RequestList from "./components/pages/RequestList";
import CategoryDetail from "./components/pages/CategoryDetail";
import ServiceDetail from "./components/pages/ServiceDetail";

// Company Pages
import AboutUs from "./components/pages/company/AboutUs";
import Careers from "./components/pages/company/Careers";
import ContactUs from "./components/pages/company/ContactUs";

// Services Pages
import HomeRenovation from "./components/pages/services/HomeRenovation";
import GardenDesign from "./components/pages/services/GardenDesign";
import SpecialProjects from "./components/pages/services/SpecialProjects";

// Support Pages
import HelpCenter from "./components/pages/support/HelpCenter";
import PrivacyPolicy from "./components/pages/support/PrivacyPolicy";
import TermsOfService from "./components/pages/support/TermsOfService";

// Theme
import theme from "./theme";
import { useCustomTheme } from "./context/ThemeContext";

function App() {
  const { theme: customTheme } = useCustomTheme();

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
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
                <Route path="/expert-register" element={<ExpertRegister />} />

                {/* Kategori ve Servis Detay Sayfaları */}
                <Route path="/kategori/:id" element={<CategoryDetail />} />
                <Route path="/servis/:id" element={<ServiceDetail />} />

                {/* Profile Routes */}
                <Route path="/expert-profile" element={<ExpertProfile />} />
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

                {/* Support Pages */}
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </BrowserRouter>
      </AuthProvider>
    </MUIThemeProvider>
  );
}

export default App;
