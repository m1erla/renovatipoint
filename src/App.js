// src/App.js

import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import Navbar from "./components/Shared/Navbar";
import Footer from "./components/Shared/Footer";
import ExpertRegister from "./components/Auth/ExpertRegister";
import ExpertProfile from "./components/Profile/ExpertProfile";
import PaymentSetup from "./components/Payment/PaymentSetup";
import SepaPayment from "./components/Payment/SepaPayment";
import Login from "./components/Auth/Login";
import PaymentConfirmation from "./components/Shared/PaymentConfirmation";
import Chat from "./components/Chat/Chat";
import CreateAd from "./components/Ads/CreateAd";
import MyAds from "./components/Ads/MyAds";
import { AuthProvider } from "./components/Auth/AuthContext";
import ExpertDashboard from "./components/pages/ExpertDashboard";
import SetupSepaPayment from "./components/Payment/SetupSepaPayment";
import Register from "./components/Auth/Register";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import theme from "./theme";
import UserProfile from "./components/Profile/UserProfile";
import AdList from "./components/Ads/AdList";
import RequestList from "./components/pages/RequestList";
import ChatRoom from "./components/Chat/ChatRoom";
import HomePage from "./components/pages/HomePage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Navbar />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="/expert-register" element={<ExpertRegister />} />
            <Route path="/expert-dashboard" element={<ExpertDashboard />} />
            <Route path="/expert-profile" element={<ExpertProfile />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/payment-setup" element={<PaymentSetup />} />
            <Route path="/sepa-payment" element={<SepaPayment />} />
            <Route
              path="/payment-confirmation"
              element={<PaymentConfirmation />}
            />
            <Route path="/ads" element={<AdList />} />
            <Route path="/requests" element={<RequestList />} />
            <Route path="/chat/:chatRoomId" element={<Chat />} />
            <Route path="/chat-rooms" element={<ChatRoom />} />
            <Route path="/create-ad" element={<CreateAd />} />
            <Route path="/my-ads" element={<MyAds />} />
            <Route path="/setup-sepa" element={<SetupSepaPayment />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
