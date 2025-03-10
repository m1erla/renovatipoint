import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatService from "../../services/chatService";
import { Stomp } from "@stomp/stompjs";
import api from "../../utils/api";
import SockJS from "sockjs-client";

export default function Chat() {
  const { chatRoomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [chatRoom, setChatRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [infoShared, setInfoShared] = useState(false);
  const [jobCompleted, setJobCompleted] = useState(false);
  const messagesEndRef = useRef(null);
  const [page] = useState(0);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");
  const [pendingPayment, setPendingPayment] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentType, setPaymentType] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [messageData, setMessageData] = useState(null);
  const shouldScrollRef = useRef(true);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get chat room details
        console.log("Fetching chat room:", chatRoomId); // Debug log
        const room = await chatService.getChatRoom(chatRoomId);
        console.log("Received chat room:", room); // Debug log
        setChatRoom(room);

        // Get messages
        const messageData = await chatService.getChatMessages(chatRoomId, page);
        setMessages(messageData.content || []);

        // Connect WebSocket
        const userId = localStorage.getItem("userId");
        chatService.connect(
          userId,
          handleMessageReceived,
          handleNotificationReceived
        );

        // Sayfa yüklendiğinde en alta kaydır
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      } catch (error) {
        console.error("Chat initialization error:", error);
        setError("Failed to initialize chat. " + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (chatRoomId) {
      initializeChat();
    }

    return () => {
      chatService.disconnect();
    };
  }, [chatRoomId]);
  const handleMessageReceived = (payload) => {
    try {
      const message = JSON.parse(payload.body);
      setMessages((prevMessages) => {
        // Check if message already exists to prevent duplicates
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

        // Only scroll for new messages
        shouldScrollRef.current = true;
        return [...prevMessages, message];
      });
    } catch (error) {
      console.error("Error handling received message:", error);
    }
  };
  useEffect(() => {
    if (shouldScrollRef.current) {
      scrollToBottom();
      shouldScrollRef.current = false;
    }
  }, [messages]); // This will run whenever messages change

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };
  // Chat room ve kullanıcı kontrolü
  if (!chatRoom?.id || !user?.id) {
    throw new Error("Gerekli bilgiler eksik. Lütfen sayfayı yenileyin.");
  }

  if (!infoShared) {
    try {
      // Expert ID kontrolü
      const expertId = chatRoom?.expert?.id;
      console.log("Debug - Expert ID for payment:", expertId);

      if (!expertId) {
        throw new Error(
          "Uzman bilgisi bulunamadı. Lütfen daha sonra tekrar deneyin."
        );
      }

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

      // İşlem öncesi onay al
      const confirmed = window.confirm(
        "Are you sure you want to share your contact information? €1 will be charged from expert's account."
      );

      if (!confirmed) {
        setShowShareDialog(false);
        return;
      }

      // Token'ı yeniden kontrol et
      const currentToken = localStorage.getItem("accessToken");
      if (!currentToken || currentToken !== token) {
        throw new Error(
          "Oturum bilgisi değişti. Lütfen tekrar giriş yapın."
        );
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
        // Başarı kontrolü - paymentResponse.data.success yerine status kontrolü yapıyoruz
        if (!paymentResponse.data || !paymentResponse.data.paymentIntentId) {
          throw new Error("Ödeme yanıtı geçersiz");
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
              throw new Error("Ödeme işlemi başarısız oldu");
            }

            attempts++;
            await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 saniye bekle
          }

          if (!paymentSucceeded) {
            throw new Error("Ödeme doğrulama zaman aşımına uğradı");
          }
        } else if (paymentResponse.data.status !== "succeeded") {
          throw new Error(
            "Ödeme işlemi başarısız oldu: " + paymentResponse.data.status
          );
        }
        toast.success(
          "Contact information shared successfully and €1 has been charged from expert's account!"
        );
      } catch (error) {
        console.error("Ödeme kontrolü sırasında hata:", error);
        setShowShareDialog(false);

        // Oturum ve yetkilendirme hatalarını kontrol et
        if (
          error.response?.status === 401 ||
          error.message.includes("Oturum süresi dolmuş") ||
          error.message.includes("Oturum bilgisi değişti")
        ) {
          localStorage.clear();
          setError("Oturumunuz sonlanmış. Lütfen tekrar giriş yapın.");
          navigate("/login");
          return;
        }

        let errorMessage = error.message;
        // Hata mesajlarını İngilizceleştir
        if (errorMessage.includes("Expert payment setup is incomplete")) {
          errorMessage =
            "Expert has not completed payment setup. Please try again later.";
        } else if (
          errorMessage.includes("Expert Stripe customer ID is missing")
        ) {
          errorMessage =
            "Expert's payment account is missing. Please try again later.";
        } else if (
          errorMessage.includes("Expert payment method ID is missing")
        ) {
          errorMessage =
            "Expert's payment method is missing. Please try again later.";
        } else if (
          errorMessage.includes(
            "Expert bank account information is incomplete"
          )
        ) {
          errorMessage =
            "Expert's bank account information is incomplete. Please try again later.";
        } else if (errorMessage.includes("Payment verification timeout")) {
          errorMessage =
            "Payment verification timed out. Please try again later.";
        }

        setError(errorMessage);
        toast.error(
          errorMessage || "Payment failed. Please try again later."
        );
      }
    } else {
      setShowShareDialog(false);
      toast.info("Contact information has already been shared!");
    }

  const handleNotificationReceived = (payload) => {
    const notification = JSON.parse(payload.body);
    // Handle different notification types if needed
    console.log("Received notification:", notification);
  };

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      // Create message object with a unique ID
      const messageData = {
        id: `temp-${Date.now()}`, // Temporary ID for optimistic update
        senderId: userId,
        chatRoomId: chatRoomId,
        content: newMessage.trim(),
        isSharedInformation: false,
        timestamp: new Date().toISOString(),
        type: "CHAT",
        pending: true, // Add a flag to mark message as pending
      };

      // Optimistically add message to UI
      setMessages((prevMessages) => [...prevMessages, messageData]);

      // Clear input immediately
      setNewMessage("");

      // Ensure scroll happens after message is added
      shouldScrollRef.current = true;

      // Send message to server
      await chatService.sendMessage(chatRoomId, messageData.content);

      // Update message to remove pending state
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageData.id ? { ...msg, pending: false } : msg
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);

      // Remove failed message from UI
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageData.id)
      );

      setError("Failed to send message");

      // Restore message to input
      setNewMessage(messageData.content);
    }
  };

  // Enhanced contact sharing flow
  const handleShareContactInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user's information
      const userInfo = await userService.getCurrentUserInfo();

      // Show confirmation dialog
      const confirmed = await showConfirmDialog({
        title: "Share Contact Information",
        message:
          "Your contact information will be shared with the expert. They will be charged €1 after accepting it.",
        confirmText: "Share Info",
        cancelText: "Cancel",
      });

      if (!confirmed) {
        return;
      }

      // Verify expert can receive contact information
      try {
        await paymentService.checkExpertPaymentEligibility(chatRoom.expert.id);
      } catch (error) {
        showSnackbar(error.message, "error");
        return;
      }

      // Create and send contact information message
      const contactInfoMessage = {
        senderId: userId,
        chatRoomId: chatRoomId,
        content: `CONTACT_INFO\nName: ${userInfo.name}\nPhone: ${userInfo.phone}\nEmail: ${userInfo.email}`,
        isSharedInformation: true,
        type: "USER_INFO",
        timestamp: new Date().toISOString(),
      };

      // Use the enhanced sendMessage method from your ChatService
      await chatService.sendMessage(chatRoomId, contactInfoMessage);

      // Send payment request message
      const paymentRequestMessage = {
        senderId: userId,
        chatRoomId: chatRoomId,
        content:
          "PAYMENT_REQUEST\nContact information has been shared. Please accept to pay €1.",
        type: "PAYMENT_REQUEST",
        timestamp: new Date().toISOString(),
      };

      await chatService.sendMessage(chatRoomId, paymentRequestMessage);

      setInfoShared(true);
      showSnackbar("Contact information shared successfully", "success");
      scrollToBottom();
    } catch (error) {
      console.error("Contact sharing error:", error);
      handleContactSharingError(error);
    } finally {
      setLoading(false);
    }
  };
  // Expert's payment acceptance handler
  const handlePaymentAcceptance = async () => {
    try {
      setLoading(true);

      const confirmed = await showConfirmDialog({
        title: "Accept Payment",
        message:
          "You will be charged €1 for receiving the contact information. Continue?",
        confirmText: "Accept & Pay",
        cancelText: "Cancel",
      });

      if (!confirmed) {
        return;
      }

      setPaymentInProgress(true);

      // Process the payment using our enhanced service
      const paymentResult = await paymentService.processContactInfoPayment(
        userId, // Expert's ID
        1.0 // €1.00
      );

      // Send payment confirmation message using your ChatService
      const confirmationMessage = {
        senderId: userId,
        chatRoomId: chatRoomId,
        content: "Payment successful - Contact information is now accessible",
        type: "SYSTEM",
        timestamp: new Date().toISOString(),
      };

      await chatService.sendMessage(chatRoomId, confirmationMessage);

      setInfoShared(true);
      setPendingPayment(null);
      showSnackbar("Payment processed successfully", "success");
    } catch (error) {
      console.error("Payment error:", error);
      handlePaymentError(error);
    } finally {
      setLoading(false);
      setPaymentInProgress(false);
    }
  };
  const handlePaymentRequest = async (type, amount) => {
    try {
      // First confirm with the user
      const confirmed = await showConfirmDialog({
        title:
          type === "CONTACT_INFO"
            ? "Access Contact Information"
            : "Complete Job",
        message: `You will be charged €${amount} for ${
          type === "CONTACT_INFO"
            ? "accessing contact information"
            : "completing this job"
        }. Continue?`,
        confirmText: `Pay €${amount}`,
        cancelText: "Cancel",
      });

      if (!confirmed) return;

      setPaymentInProgress(true);

      // Process the payment
      const paymentResult = await paymentService.chargeExpert(
        chatRoom.expert.id,
        amount,
        type
      );

      if (paymentResult.status === "succeeded") {
        // Handle successful payment
        if (type === "CONTACT_INFO") {
          setInfoShared(true);
          // Send confirmation message as a simple string
          await chatService.sendMessage(chatRoomId, {
            senderId: "SYSTEM",
            chatRoomId: chatRoomId,
            content:
              "Payment successful - Contact information is now accessible",
            type: "SYSTEM",
            timestamp: new Date().toISOString(),
          });
        } else if (type === "JOB_COMPLETION") {
          setJobCompleted(true);
          await chatService.sendMessage(chatRoomId, {
            senderId: "SYSTEM",
            chatRoomId: chatRoomId,
            content: "Job marked as complete - Payment processed successfully",
            type: "SYSTEM",
            timestamp: new Date().toISOString(),
          });
          setTimeout(() => navigate("/chat-rooms"), 2000);
        }
        showSnackbar("Payment processed successfully", "success");
      } else {
        throw new Error("Payment was not completed successfully");
      }
    } catch (error) {
      console.error("Payment error:", error);
      showSnackbar(error.message || "Payment failed", "error");
    } finally {
      setPaymentInProgress(false);
    }
  };

  const handleCompleteJob = async () => {
    try {
      setLoading(true);

      const confirmed = await showConfirmDialog({
        title: "Complete Job",
        message:
          "Completing the job will charge €5 from your account. Continue?",
        confirmText: "Complete",
        cancelText: "Cancel",
      });

      if (confirmed) {
        await chatService.completeJob(chatRoomId);
        await paymentService.chargeExpert(
          chatRoom.expert.id,
          5,
          "JOB_COMPLETION"
        );
        setJobCompleted(true);
        navigate("/chat-rooms");
      }
    } catch (error) {
      setError("Failed to complete job: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Error handling utilities
  const handleContactSharingError = (error) => {
    let errorMessage = "Failed to share contact information";

    if (error.message.includes("EntityNotFoundException")) {
      errorMessage = "Expert not found. Please try again.";
    } else if (error.message.includes("InsufficientBalanceException")) {
      errorMessage = "Expert has insufficient balance for this action";
    } else if (error.message.includes("not set up payment")) {
      errorMessage = "Expert has not set up payment information";
    }

    setError(errorMessage);
    showSnackbar(errorMessage, "error");
  };

  const handlePaymentError = (error) => {
    let errorMessage = "Payment failed";

    if (error.message.includes("insufficient_funds")) {
      errorMessage = "Insufficient funds for this transaction";
    } else if (error.message.includes("payment_method_not_available")) {
      errorMessage =
        "Payment method is not available. Please check your payment setup";
    }

    setError(errorMessage);
    showSnackbar(errorMessage, "error");
  };

  const renderMessage = (message) => {
    // Special rendering for contact information
    if (
      message.type === "USER_INFO" &&
      message.content.includes("CONTACT_INFO_START")
    ) {
      // Extract the contact info from the content
      const infoContent = message.content
        .replace("CONTACT_INFO_START\n", "")
        .replace("\nCONTACT_INFO_END", "")
        .split("\n");

      return (
        <Paper
          sx={{
            p: 2,
            bgcolor: "#2c3e50",
            border: "1px solid #90caf9",
            borderRadius: 2,
            mb: 1,
          }}
        >
          <Typography variant="subtitle1" gutterBottom color="white">
            Contact Information
          </Typography>
          {infoContent.map((line, index) => (
            <Typography key={index} variant="body2" color="white">
              {line}
            </Typography>
          ))}
          <Typography
            variant="caption"
            color="white"
            sx={{ mt: 1, display: "block" }}
          >
            {new Date(message.timestamp).toLocaleString()}
          </Typography>
        </Paper>
      );
    }

    // Special rendering for payment request messages
    if (message.type === "PAYMENT_REQUEST") {
      return (
        <Paper
          sx={{
            p: 2,
            bgcolor: "#fff3e0",
            border: "1px solid #ffe0b2",
            borderRadius: 2,
            mb: 1,
          }}
        >
          <Typography variant="body1" gutterBottom>
            {message.content}
          </Typography>
          {userRole === "EXPERT" && !infoShared && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handlePaymentRequest("CONTACT_INFO", 1)}
              sx={{ mt: 1 }}
            >
              Accept & Pay €1
            </Button>
          )}
        </Paper>
      );
    }

    // Regular message rendering
    return (
      <Paper
        sx={{
          p: 2,
          bgcolor: message.senderId === userId ? "#2c3e50" : "grey.100",
          color: message.senderId === userId ? "white" : "black",
          maxWidth: "70%",
          alignSelf: message.senderId === userId ? "flex-end" : "flex-start",
          mb: 1,
          opacity: message.pending ? 0.7 : 1, // Show pending state visually
          position: "relative",
        }}
      >
        <Typography variant="body1">{message.content}</Typography>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          {new Date(message.timestamp).toLocaleString()}
          {message.pending && " (sending...)"}
        </Typography>
      </Paper>
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
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  const isExpert = localStorage.getItem("role") === "EXPERT";

  // Add a snackbar for notifications

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{
        height: "85vh",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 3,
        bgcolor: "#f5f5f7",
      }}
    >
      {/* Job completion header for experts */}
      {userRole === "EXPERT" && pendingPayment && (
        <Paper
          elevation={2}
          sx={{
            p: 2.5,
            bgcolor: "#fff",
            borderRadius: 2,
            border: "1px solid #e0e0e0",
          }}
        >
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle1" sx={{ color: "#2c3e50" }}>
                Contact information has been shared. Accept payment to view?
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#2c3e50",
                  "&:hover": {
                    bgcolor: "#1a252f",
                  },
                }}
                onClick={handlePaymentAcceptance}
                disabled={loading}
              >
                Accept & Pay €1
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Loading overlay */}
      {paymentInProgress && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          }}
        >
          <Paper
            elevation={4}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              borderRadius: 2,
            }}
          >
            <CircularProgress sx={{ color: "#2c3e50" }} />
            <Typography variant="h6" sx={{ color: "#2c3e50" }}>
              Processing payment...
            </Typography>
          </Paper>
        </Box>
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
      </Paper>

      {/* Messages area */}
      <Paper
        elevation={2}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 3,
          display: "flex",
          flexDirection: "column-reverse", // Changed from column to column-reverse
          gap: 2,
          borderRadius: 2,
          bgcolor: "#fff",
          border: "1px solid #e0e0e0",
          scrollBehavior: "smooth",
        }}
        ref={messagesEndRef}
      >
        {[...messages]
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Reversed sort order
          .map((message) => (
            <Box
              key={message.id}
              sx={{
                alignSelf:
                  message.senderId === userId ? "flex-end" : "flex-start",
                maxWidth: "70%",
                color: "#fff",
                bgcolor: message.senderId === userId ? "#fff" : "transparent",
                p: message.senderId === userId ? 2 : 0,
                borderRadius: message.senderId === userId ? 2 : 0,
              }}
            >
              {renderMessage(message)}
            </Box>
          ))}
      </Paper>

      {/* Message input area */}
      <Paper
        elevation={2}
        sx={{
          p: 2.5,
          borderRadius: 2,
          bgcolor: "#fff",
          border: "1px solid #e0e0e0",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <TextField
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              variant="outlined"
              size="medium"
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#2c3e50",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2c3e50",
                  },
                },
              }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleSendMessage}
              startIcon={<SendIcon />}
              disabled={loading}
              sx={{
                bgcolor: "#2c3e50",
                "&:hover": {
                  bgcolor: "#1a252f",
                },
              }}
            >
              Send
            </Button>
          </Grid>
          {userRole === "USER" && !infoShared && (
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleShareContactInfo}
                startIcon={<InfoIcon />}
                disabled={loading}
                sx={{
                  borderColor: "#2c3e50",
                  color: "#2c3e50",
                  "&:hover": {
                    borderColor: "#1a252f",
                    bgcolor: "rgba(44, 62, 80, 0.04)",
                  },
                }}
              >
                Share Info (€1)
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
