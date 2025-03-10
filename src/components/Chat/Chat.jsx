import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Chip,
} from "@mui/material";
import {
  Send as SendIcon,
  Info as InfoIcon,
  Share as ShareIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import chatService from "../../services/chatService";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../utils/api";
import { paymentService } from "../../services/paymentService";
import { loadStripe } from "@stripe/stripe-js";
import expertService from "../../services/expertService";
import PaymentConfirmation from "../Payment/PaymentConfirmation";
import PaymentFailure from "../Payment/PaymentFailure";
import invoiceService from "../../services/invoiceService";

export default function Chat() {
  const { chatRoomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatRoom, setChatRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [infoShared, setInfoShared] = useState(false);
  const [jobCompleted, setJobCompleted] = useState(false);
  const messagesEndRef = useRef(null);
  const shouldScrollRef = useRef(true);
  const { user } = useContext(AuthContext);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [showPaymentFailure, setShowPaymentFailure] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const navigate = useNavigate();
  const [hasSharedContactInfo, setHasSharedContactInfo] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const handleError = (error) => {
    console.error("Error occurred:", error);

    if (error.response?.status === 401) {
      localStorage.clear();
      setError("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
      navigate("/login");
      return;
    }

    let errorMessage = error.message;
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    setError(errorMessage);
  };

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        setError(null);

        // Token kontrolü
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
        }

        if (!user?.id) {
          throw new Error(
            "Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın."
          );
        }

        await chatService.connect(
          user.id,
          handleMessageReceived,
          handleNotificationReceived
        );

        const room = await chatService.getChatRoom(chatRoomId);
        console.log("Debug - Chat Room Data:", room);

        if (!room) {
          throw new Error("Sohbet odası bulunamadı.");
        }

        // Chat room state'ini güvenli bir şekilde güncelle
        const updatedRoom = {
          ...room,
          id: room.id || chatRoomId,
          expert: {
            id: room.expert?.id || room.expertId,
            name: room.expert?.name || "Expert",
            email: room.expert?.email,
            companyName: room.expert?.companyName,
          },
          isCompleted: Boolean(
            room.status === "COMPLETED" ||
              room.completed ||
              room.completionPaymentProcessed ||
              room.isCompleted
          ),
          contactInformationShared: Boolean(
            room.contactInformationShared ||
              room.contactShared ||
              room.hasContactBeenShared
          ),
          status: room.status || "ACTIVE",
        };

        console.log("Debug - Updated Room State:", updatedRoom);

        setChatRoom(updatedRoom);
        setJobCompleted(updatedRoom.isCompleted);
        setInfoShared(updatedRoom.contactInformationShared);

        const messageData = await chatService.getChatMessages(chatRoomId);
        if (messageData?.content) {
          setMessages(messageData.content);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    if (chatRoomId && user) {
      initializeChat();
    }

    return () => {
      chatService.disconnect();
    };
  }, [chatRoomId, user, navigate]);

  const handleMessageReceived = (payload) => {
    try {
      const message = JSON.parse(payload.body);

      // Check if this is a shared info message
      if (
        message.messageType === "CONTACT_INFO" ||
        (message.content &&
          message.content.includes("Contact information has been shared"))
      ) {
        setInfoShared(true);
      }

      setMessages((prevMessages) => {
        const messageExists = prevMessages.some(
          (msg) =>
            msg.id === message.id ||
            (msg.content === message.content &&
              msg.timestamp === message.timestamp &&
              msg.senderId === message.senderId)
        );

        if (messageExists) {
          return prevMessages;
        }

        shouldScrollRef.current = true;
        return [...prevMessages, message];
      });
    } catch (error) {
      console.error("Error receiving message:", error);
    }
  };

  useEffect(() => {
    if (shouldScrollRef.current) {
      scrollToBottom();
      shouldScrollRef.current = false;
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  const handleNotificationReceived = (payload) => {
    const notification = JSON.parse(payload.body);
    console.log("Notification received:", notification);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const tempMessageData = {
      id: `temp-${Date.now()}`,
      senderId: user?.id,
      chatRoomId: chatRoomId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      messageType: "CHAT",
      pending: true,
    };

    try {
      setMessages((prevMessages) => [...prevMessages, tempMessageData]);
      setNewMessage("");
      shouldScrollRef.current = true;

      await chatService.sendMessage(chatRoomId, tempMessageData);

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === tempMessageData.id ? { ...msg, pending: false } : msg
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== tempMessageData.id)
      );
      setError("Failed to send message");
      setNewMessage(tempMessageData.content);
    }
  };

  const handleMarkJobAsComplete = async () => {
    try {
      setLoading(true);
      setError(null);

      // Token kontrolü
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Session expired. Please login again.");
      }

      // Expert ve chat room kontrolü
      if (!chatRoom?.id || !user?.id) {
        throw new Error("Required information is missing");
      }

      // Ödeme onayı
      const confirmed = window.confirm(
        "Are you sure you want to complete this job? €5 will be charged from your account."
      );
      setProcessingPayment(true);

      if (!confirmed) {
        setShowCompleteDialog(false);
        return;
      }

      // Expert ödeme bilgilerini kontrol et
      const paymentInfo = await expertService.getPaymentInfo(user.id);

      if (
        !paymentInfo?.hasPaymentSetup ||
        !paymentInfo?.stripeCustomerId ||
        !paymentInfo?.paymentMethodId
      ) {
        throw new Error("Please complete your payment setup first");
      }

      // Ödeme işlemini başlat
      const paymentResponse = await api.post(
        `/api/v1/payments/charge`,
        {
          expertId: user.id,
          stripeCustomerId: paymentInfo.stripeCustomerId,
          paymentMethodId: paymentInfo.paymentMethodId,
          amount: 5, // 5 Euro
          currency: "eur",
          paymentType: "JOB_COMPLETION",
          chatRoomId: chatRoom.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Ödeme yanıtını kontrol et
      if (!paymentResponse.data || !paymentResponse.data.paymentIntentId) {
        throw new Error("Invalid payment response");
      }

      // Ödeme durumunu kontrol et
      if (
        paymentResponse.data.status === "succeeded" ||
        paymentResponse.data.status === "processing" ||
        paymentResponse.data.status === "requires_confirmation"
      ) {
        let attempts = 0;
        const maxAttempts = 10;
        let paymentSucceeded = false;

        while (attempts < maxAttempts) {
          const statusCheck = await api.get(
            `/api/v1/payments/payment-intents/${paymentResponse.data.paymentIntentId}/status`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Debug - Payment status check:", statusCheck.data);

          if (statusCheck.data.status === "succeeded") {
            paymentSucceeded = true;
            break;
          } else if (
            statusCheck.data.status === "failed" ||
            statusCheck.data.status === "canceled"
          ) {
            throw new Error("Payment failed");
          }

          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }

        if (!paymentSucceeded) {
          throw new Error("Payment verification timeout");
        }

        if (paymentSucceeded) {
          setPaymentDetails({
            amount: 5,
            paymentType: "JOB_COMPLETION",
            paymentIntentId: paymentResponse.data.paymentIntentId,
          });
          setShowPaymentConfirmation(true);

          try {
            // Fatura oluştur
            await invoiceService.generateExpertInvoice(
              user.id,
              5,
              paymentResponse.data.paymentIntentId,
              "JOB_COMPLETION"
            );

            // İşi tamamla ve ödeme ID'sini gönder
            await chatService.markJobAsComplete(
              chatRoomId,
              paymentResponse.data.paymentIntentId
            );

            // Chat room'u güncelle
            const updatedRoom = await chatService.getChatRoom(chatRoomId);
            setChatRoom(updatedRoom);
            setShowCompleteDialog(false);

            // Sistem mesajı ekle
            const systemMessage = {
              senderId: "SYSTEM",
              chatRoomId: chatRoomId,
              content: `Job has been marked as completed by the expert. Completion fee (€5) has been charged.`,
              messageType: "SYSTEM",
              timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, systemMessage]);
            toast.success(
              "Job completed successfully and €5 has been charged from your account!"
            );
          } catch (error) {
            console.error("Error in completion process:", error);
            throw error;
          }
        }
      } else {
        throw new Error(
          `Payment failed with status: ${paymentResponse.data.status}`
        );
      }
    } catch (error) {
      console.error("Job completion error:", error);
      setShowCompleteDialog(false);

      if (error.response?.status === 401) {
        localStorage.clear();
        setError("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      let errorMessage = error.message;
      if (errorMessage.includes("Payment verification timeout")) {
        errorMessage =
          "Payment is still processing. Please check your dashboard for the status.";
      } else if (errorMessage.includes("Payment failed")) {
        errorMessage = "Payment failed. Please try again later.";
      }

      setPaymentError(errorMessage);
      setPaymentDetails({
        amount: 5,
        paymentType: "JOB_COMPLETION",
      });
      setShowPaymentFailure(true);
      setError(errorMessage);
    } finally {
      setLoading(false);
      setProcessingPayment(false);
    }
  };

  const handleShareContact = async () => {
    try {
      setLoading(true);
      setError(null);

      // Token kontrolü
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Session expired. Please login again.");
      }

      // Chat room ve expert kontrolü
      if (!chatRoom?.id || !chatRoom?.expert?.id) {
        throw new Error(
          "Required information is missing. Please refresh the page."
        );
      }

      if (!infoShared) {
        try {
          // Expert ID kontrolü
          const expertId = chatRoom.expert.id;
          console.log("Debug - Expert ID for payment:", expertId);

          // Get expert's payment info
          const paymentInfo = await expertService.getPaymentInfo(expertId);
          console.log("Debug - Expert payment info:", {
            hasPaymentSetup: paymentInfo?.hasPaymentSetup,
            stripeCustomerId: paymentInfo?.stripeCustomerId,
            paymentMethodId: paymentInfo?.paymentMethodId,
          });

          if (
            !paymentInfo ||
            !paymentInfo.hasPaymentSetup ||
            !paymentInfo.stripeCustomerId ||
            !paymentInfo.paymentMethodId
          ) {
            throw new Error(
              "Expert has not set up payment information completely"
            );
          }

          // Get fresh user data
          const userResponse = await api.get("/api/v1/users/response", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!userResponse.data) {
            throw new Error("Could not fetch user details");
          }

          const currentUser = {
            ...user,
            ...userResponse.data,
          };

          // İşlem öncesi onay al
          const confirmed = window.confirm(
            "Are you sure you want to share your contact information? €1 will be charged from expert's account."
          );

          if (!confirmed) {
            setShowShareDialog(false);
            return;
          }

          // Ödeme işlemini başlat
          const paymentResponse = await api.post(
            `/api/v1/payments/charge`,
            {
              expertId: expertId,
              stripeCustomerId: paymentInfo.stripeCustomerId,
              paymentMethodId: paymentInfo.paymentMethodId,
              amount: 1, // 1 Euro in cents
              currency: "eur",
              paymentType: "CONTACT_INFO",
              chatRoomId: chatRoom.id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Debug - Payment Response:", paymentResponse.data);

          if (!paymentResponse.data || !paymentResponse.data.paymentIntentId) {
            throw new Error("Invalid payment response");
          }

          // Ödeme durumunu kontrol et
          if (
            paymentResponse.data.status === "processing" ||
            paymentResponse.data.status === "requires_confirmation"
          ) {
            let attempts = 0;
            const maxAttempts = 10;
            let paymentSucceeded = false;

            while (attempts < maxAttempts) {
              const statusCheck = await api.get(
                `/api/v1/payments/payment-intents/${paymentResponse.data.paymentIntentId}/status`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              console.log("Debug - Payment status check:", statusCheck.data);

              if (statusCheck.data.status === "succeeded") {
                paymentSucceeded = true;
                break;
              } else if (
                statusCheck.data.status === "failed" ||
                statusCheck.data.status === "canceled"
              ) {
                throw new Error("Payment failed");
              }

              attempts++;
              await new Promise((resolve) => setTimeout(resolve, 3000));
            }

            if (!paymentSucceeded) {
              throw new Error("Payment verification timeout");
            }
          } else if (paymentResponse.data.status !== "succeeded") {
            throw new Error("Payment failed: " + paymentResponse.data.status);
          }

          try {
            // Fatura oluştur
            await invoiceService.generateExpertInvoice(
              expertId,
              1,
              paymentResponse.data.paymentIntentId,
              "CONTACT_INFO"
            );

            // İletişim bilgilerini hazırla
            const contactInfo = {
              name: currentUser.name || "",
              surname: currentUser.surname || "",
              email: currentUser.email || "",
              phoneNumber: currentUser.phoneNumber || "",
              address: currentUser.address || "",
              postCode: currentUser.postCode || "",
            };

            console.log("Debug - User Contact Info:", {
              userDetails: currentUser,
              preparedContactInfo: contactInfo,
            });

            // Mesaj içeriğini hazırla
            const messageContent = {
              type: "contact_info",
              userInfo: {
                title: "Contact Information",
                data: [
                  {
                    label: "Name",
                    value: `${contactInfo.name} ${contactInfo.surname}`.trim(),
                  },
                  { label: "Email", value: contactInfo.email },
                  { label: "Phone", value: contactInfo.phoneNumber },
                  { label: "Address", value: contactInfo.address },
                  { label: "Post Code", value: contactInfo.postCode },
                ].filter(
                  (item) => item.value && item.value !== "undefined undefined"
                ),
              },
            };

            // Mesajı gönder
            const message = {
              senderId: user.id,
              chatRoomId: chatRoom.id,
              content: JSON.stringify(messageContent),
              messageType: "CONTACT_INFO",
              timestamp: new Date().toISOString(),
            };

            await chatService.sendMessage(chatRoom.id, message);
            setMessages((prev) => [...prev, message]);

            // Chat room durumunu güncelle
            const updatedRoom = {
              ...chatRoom,
              contactInformationShared: true,
              contactShared: true,
              lastPaymentStatus: "succeeded",
              lastPaymentIntentId: paymentResponse.data.paymentIntentId,
            };

            // chatService üzerinden güncelleme yap
            const updatedChatRoom = await chatService.updateChatRoom(
              chatRoom.id,
              updatedRoom
            );
            setChatRoom(updatedChatRoom);
            setInfoShared(true);
            setShowShareDialog(false);

            toast.success(
              "Contact information shared successfully and €1 has been charged from expert's account!"
            );
          } catch (error) {
            console.error("Error in contact info process:", error);
            throw error;
          }
        } catch (error) {
          console.error("Payment process error:", error);
          handlePaymentError(error);
        }
      } else {
        setShowShareDialog(false);
        toast.info("Contact information has already been shared!");
      }
    } catch (error) {
      console.error("Contact information sharing error:", error);
      handlePaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  // Yardımcı fonksiyon: Ödeme hatalarını işle
  const handlePaymentError = (error) => {
    setShowShareDialog(false);

    if (error.response?.status === 401) {
      localStorage.clear();
      setError("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    let errorMessage = error.message;
    if (errorMessage.includes("Expert payment setup is incomplete")) {
      errorMessage =
        "Expert has not completed payment setup. Please try again later.";
    } else if (errorMessage.includes("Expert Stripe customer ID is missing")) {
      errorMessage =
        "Expert's payment account is missing. Please try again later.";
    } else if (errorMessage.includes("Expert payment method ID is missing")) {
      errorMessage =
        "Expert's payment method is missing. Please try again later.";
    } else if (
      errorMessage.includes("Expert bank account information is incomplete")
    ) {
      errorMessage =
        "Expert's bank account information is incomplete. Please try again later.";
    } else if (errorMessage.includes("Payment verification timeout")) {
      errorMessage = "Payment verification timed out. Please try again later.";
    }

    setPaymentError(errorMessage);
    setPaymentDetails({
      amount: 1,
      paymentType: "CONTACT_INFO",
    });
    setShowPaymentFailure(true);
    setError(errorMessage);
  };

  const renderMessage = (message) => {
    if (!message || !message.content) {
      return null;
    }

    if (message.messageType === "CONTACT_INFO") {
      let contentData;
      try {
        contentData = JSON.parse(message.content);
        if (contentData.type === "contact_info") {
          return (
            <Paper
              sx={{
                p: 2,
                bgcolor: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                mb: 1,
                width: "100%",
                maxWidth: "500px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                  color: "#1976d2",
                  fontWeight: "600",
                }}
              >
                <PersonIcon fontSize="small" />
                {contentData.userInfo.title}
              </Typography>

              <Box
                sx={{
                  bgcolor: "#f8f9fa",
                  borderRadius: 1,
                  p: 2,
                  border: "1px solid #e9ecef",
                }}
              >
                {contentData.userInfo.data.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 1,
                      borderBottom:
                        index < contentData.userInfo.data.length - 1
                          ? "1px solid #dee2e6"
                          : "none",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6c757d",
                        fontWeight: "500",
                        minWidth: "100px",
                      }}
                    >
                      {item.label}:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#212529",
                        fontWeight: "400",
                        wordBreak: "break-all",
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 2,
                  color: "#6c757d",
                  textAlign: "right",
                }}
              >
                {new Date(message.timestamp).toLocaleString()}
              </Typography>
            </Paper>
          );
        }
      } catch (e) {
        console.error("Error parsing message content:", e);
      }
    }

    // Default message render
    return (
      <Paper
        sx={{
          p: 2,
          bgcolor: message.senderId === user?.id ? "#2c3e50" : "grey.100",
          color: message.senderId === user?.id ? "white" : "black",
          maxWidth: "100%",
          alignSelf: message.senderId === user?.id ? "flex-end" : "flex-start",
          mb: 1,
          opacity: message.pending ? 0.7 : 1,
          position: "relative",
          wordBreak: "break-word",
        }}
      >
        <Typography variant="body1">{message.content}</Typography>
        <Typography
          variant="caption"
          sx={{ opacity: 0.7, display: "block", mt: 1 }}
        >
          {message.timestamp
            ? new Date(message.timestamp).toLocaleString()
            : "Time not available"}
          {message.pending && " (sending...)"}
        </Typography>
      </Paper>
    );
  };

  const renderActionButtons = () => {
    // Kullanıcı ve chat room kontrolü
    if (!user || !chatRoom) {
      return null;
    }

    const isExpert = user.role === "EXPERT";
    const isUser = user.role === "USER";
    const isActive = chatRoom.status === "ACTIVE";
    const isCompleted = chatRoom.isCompleted || chatRoom.status === "COMPLETED";
    const hasSharedContact =
      chatRoom.contactInformationShared ||
      chatRoom.contactShared ||
      chatRoom.hasContactBeenShared ||
      messages.some((msg) => msg.messageType === "CONTACT_INFO");

    console.log("Debug - Action Buttons State:", {
      userRole: user.role,
      isExpert,
      isUser,
      isActive,
      isCompleted,
      hasSharedContact,
      chatRoomStatus: chatRoom.status,
      contactShared: chatRoom.contactShared,
      contactInformationShared: chatRoom.contactInformationShared,
      hasContactBeenShared: chatRoom.hasContactBeenShared,
      messagesWithContactInfo: messages.filter(
        (msg) => msg.messageType === "CONTACT_INFO"
      ).length,
    });

    return (
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        {/* Share Contact Button - Only for Users */}
        {isUser && !hasSharedContact && isActive && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShareIcon />}
            onClick={() => setShowShareDialog(true)}
            disabled={loading}
          >
            Share Contact Info (€1)
          </Button>
        )}

        {/* Complete Job Button - Only for Experts */}
        {isExpert && !isCompleted && hasSharedContact && isActive && (
          <Button
            variant="contained"
            color="success"
            startIcon={<PaymentIcon />}
            onClick={() => setShowCompleteDialog(true)}
            disabled={loading}
          >
            Complete Job (€5)
          </Button>
        )}

        {/* Status Indicators */}
        {hasSharedContact && (
          <Chip
            label="Contact Info Shared"
            color="info"
            variant="outlined"
            size="small"
          />
        )}
        {isCompleted && (
          <Chip
            label="Job Completed"
            color="success"
            variant="outlined"
            size="small"
          />
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 200px)",
        backgroundColor: "#f5f5f7",
        pt: { xs: 8, sm: 9 },
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        {loading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Chat title */}
        <Paper
          elevation={2}
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: "#fff",
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h5" sx={{ color: "#2c3e50", fontWeight: 600 }}>
            {chatRoom?.ad?.title || "Chat Room"}
          </Typography>
          {chatRoom?.expertBlocked && (
            <Alert severity="error" sx={{ mt: 1 }}>
              Expert account is blocked
            </Alert>
          )}
          {renderActionButtons()}
        </Paper>

        {/* Messages area */}
        <Paper
          elevation={2}
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 3,
            mt: 3,
            display: "flex",
            flexDirection: "column-reverse",
            gap: 2,
            borderRadius: 2,
            bgcolor: "#fff",
            border: "1px solid #e0e0e0",
            minHeight: "60vh",
          }}
          ref={messagesEndRef}
        >
          {messages
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((message) => (
              <Box
                key={message.id}
                sx={{
                  alignSelf:
                    message.senderId === user?.id ? "flex-end" : "flex-start",
                  maxWidth: "70%",
                }}
              >
                {renderMessage(message)}
              </Box>
            ))}
        </Paper>

        {/* Message input */}
        {!chatRoom?.isCompleted && (
          <Paper
            component="form"
            sx={{
              p: 2,
              mt: 3,
              display: "flex",
              gap: 2,
              borderRadius: 2,
              bgcolor: "#fff",
              border: "1px solid #e0e0e0",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={loading}
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || loading}
            >
              Send
            </Button>
          </Paper>
        )}

        {/* Share Contact Dialog */}
        <Dialog
          open={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Share Contact Information</DialogTitle>
          <DialogContent>
            <Typography>
              By sharing your contact information, €1 will be charged from the
              expert's account. This will allow direct communication with the
              expert.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowShareDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleShareContact}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Share and Charge €1
            </Button>
          </DialogActions>
        </Dialog>

        {/* Complete Job Dialog */}
        <Dialog
          open={showCompleteDialog}
          onClose={() => setShowCompleteDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Complete Job</DialogTitle>
          <DialogContent>
            <Typography>
              By marking this job as complete, €5 will be charged from your
              account. This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowCompleteDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMarkJobAsComplete}
              variant="contained"
              color="success"
              disabled={loading}
            >
              Complete and Pay €5
            </Button>
          </DialogActions>
        </Dialog>

        {showPaymentConfirmation && paymentDetails && (
          <PaymentConfirmation
            amount={paymentDetails.amount}
            paymentType={paymentDetails.paymentType}
            redirectUrl={`/chat/${chatRoomId}`}
            onComplete={() => {
              setShowPaymentConfirmation(false);
              setPaymentDetails(null);
            }}
          />
        )}

        {showPaymentFailure && paymentDetails && (
          <PaymentFailure
            amount={paymentDetails.amount}
            paymentType={paymentDetails.paymentType}
            errorMessage={paymentError}
            redirectUrl={`/chat/${chatRoomId}`}
            onRetry={() => {
              setShowPaymentFailure(false);
              setPaymentDetails(null);
              setPaymentError(null);
              if (paymentDetails.paymentType === "JOB_COMPLETION") {
                setShowCompleteDialog(true);
              } else {
                setShowShareDialog(true);
              }
            }}
            onComplete={() => {
              setShowPaymentFailure(false);
              setPaymentDetails(null);
              setPaymentError(null);
            }}
          />
        )}
      </Container>
    </Box>
  );
}
