import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  PaperAirplaneIcon,
  InformationCircleIcon,
  ShareIcon,
  UserIcon,
  CreditCardIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

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
  const scrollContainerRef = useRef(null);
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 500, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.9 },
  };

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
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
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

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return "Time not available";
    }
  };

  const renderMessage = (message, index) => {
    if (!message || !message.content) {
      return null;
    }

    const isCurrentUser = message.senderId === user?.id;
    const isSystemMessage =
      message.senderId === "SYSTEM" || message.messageType === "SYSTEM";

    // Handle contact info message
    if (message.messageType === "CONTACT_INFO") {
      let contentData;
      try {
        contentData = JSON.parse(message.content);
        if (contentData.type === "contact_info") {
          return (
            <motion.div
              key={message.id || index}
              variants={messageVariants}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div className="rounded-2xl bg-blue-50 dark:bg-blue-900/30 p-4 max-w-md shadow-sm border border-blue-200 dark:border-blue-800/50">
                <div className="flex items-center gap-2 mb-3 text-blue-700 dark:text-blue-300 font-semibold">
                  <UserIcon className="w-5 h-5" />
                  {contentData.userInfo.title}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
                  {contentData.userInfo.data.map((item, idx) => (
                    <div
                      key={idx}
                      className={`py-2 flex justify-between ${
                        idx < contentData.userInfo.data.length - 1
                          ? "border-b border-gray-100 dark:border-gray-700"
                          : ""
                      }`}
                    >
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {item.label}:
                      </span>
                      <span className="text-gray-900 dark:text-gray-200 break-all">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                  {formatDate(message.timestamp)}
                </div>
              </div>
            </motion.div>
          );
        }
      } catch (e) {
        console.error("Error parsing message content:", e);
      }
    }

    // System message
    if (isSystemMessage) {
      return (
        <motion.div
          key={message.id || index}
          variants={messageVariants}
          className="flex justify-center my-4"
        >
          <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-full px-4 py-2 text-sm flex items-center">
            <InformationCircleIcon className="w-4 h-4 mr-2" />
            {message.content}
          </div>
        </motion.div>
      );
    }

    // Regular chat message
    return (
      <motion.div
        key={message.id || index}
        variants={messageVariants}
        className={`flex ${
          isCurrentUser ? "justify-end" : "justify-start"
        } mb-4`}
      >
        <div
          className={`relative rounded-2xl p-4 max-w-md shadow-sm ${
            isCurrentUser
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-card dark:bg-gray-800 text-foreground dark:text-white rounded-bl-none border border-border/50 dark:border-gray-700/50"
          } ${message.pending ? "opacity-70" : ""}`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          <div
            className={`text-xs ${
              isCurrentUser
                ? "text-primary-foreground/70"
                : "text-muted-foreground dark:text-gray-400"
            } mt-2 flex items-center justify-end gap-1`}
          >
            {message.pending && (
              <span className="inline-flex items-center gap-1">
                <ClockIcon className="w-3 h-3" />
                Sending...
              </span>
            )}
            <span>{formatDate(message.timestamp)}</span>
          </div>
        </div>
      </motion.div>
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
      <div className="flex flex-wrap gap-2 mt-3">
        {/* Share Contact Button - Only for Users */}
        {isUser && !hasSharedContact && isActive && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowShareDialog(true)}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShareIcon className="w-5 h-5" />
            İletişim Bilgilerini Paylaş (€1)
          </motion.button>
        )}

        {/* Complete Job Button - Only for Experts */}
        {isExpert && !isCompleted && hasSharedContact && isActive && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowCompleteDialog(true)}
            disabled={loading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCardIcon className="w-5 h-5" />
            İşi Tamamla (€5)
          </motion.button>
        )}

        {/* Status Indicators */}
        {hasSharedContact && (
          <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 flex items-center gap-1">
            <InformationCircleIcon className="w-4 h-4" />
            İletişim Bilgileri Paylaşıldı
          </div>
        )}
        {isCompleted && (
          <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 flex items-center gap-1">
            <CheckCircleIcon className="w-4 h-4" />
            İş Tamamlandı
          </div>
        )}
      </div>
    );
  };

  if (loading && !chatRoom) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-primary/50 border-r-transparent border-b-transparent border-l-transparent animate-spin-slow"></div>
        </div>
      </div>
    );
  }

  if (error && !chatRoom) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md p-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl shadow-lg"
        >
          <div className="flex items-center gap-3 mb-3">
            <XCircleIcon className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Hata</h3>
          </div>
          <p>{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Tekrar Dene
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-b from-background to-background/95 dark:from-gray-900 dark:to-gray-950 pt-8 sm:pt-12 pb-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col h-[calc(100vh-240px)]"
        >
          {/* Chat Header */}
          <motion.div variants={itemVariants} className="mb-4">
            <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-lg p-5 border border-border/50 dark:border-gray-700/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 dark:bg-primary-foreground/10 rounded-full flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-primary dark:text-primary-foreground" />
                  </div>
                  <h1 className="text-xl font-bold text-foreground dark:text-white">
                    {chatRoom?.ad?.title || "Sohbet"}
                  </h1>
                </div>

                {chatRoom?.expertBlocked && (
                  <div className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 flex items-center gap-1">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    Uzman hesabı bloke edildi
                  </div>
                )}
              </div>

              {renderActionButtons()}
            </div>
          </motion.div>

          {/* Chat Messages Container */}
          <motion.div
            variants={itemVariants}
            className="flex-1 bg-card dark:bg-gray-800 rounded-2xl shadow-lg border border-border/50 dark:border-gray-700/50 p-5 mb-4 overflow-hidden flex flex-col"
          >
            {/* Messages Area */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
            >
              <AnimatePresence>
                {messages
                  .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                  .map((message, index) => renderMessage(message, index))}
              </AnimatePresence>
              <div ref={messagesEndRef}></div>
            </div>
          </motion.div>

          {/* Message Input Area */}
          {!chatRoom?.isCompleted && (
            <motion.div
              variants={itemVariants}
              className="bg-card dark:bg-gray-800 rounded-2xl shadow-lg border border-border/50 dark:border-gray-700/50 p-4"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-3"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={loading}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-border dark:border-gray-600 bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!newMessage.trim() || loading}
                  className="p-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <PaperAirplaneIcon className="w-6 h-6" />
                </motion.button>
              </form>
            </motion.div>
          )}
        </motion.div>

        {/* Share Contact Dialog */}
        <AnimatePresence>
          {showShareDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => !loading && setShowShareDialog(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-background dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold text-foreground dark:text-white mb-4 flex items-center gap-2">
                  <ShareIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  İletişim Bilgilerini Paylaş
                </h2>

                <p className="text-muted-foreground dark:text-gray-300 mb-6">
                  İletişim bilgilerinizi paylaşarak, uzmanın hesabından €1 ücret
                  alınacaktır. Bu, uzmanla doğrudan iletişim kurmanıza olanak
                  tanıyacaktır.
                </p>

                <div className="flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowShareDialog(false)}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    İptal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShareContact}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>İşleniyor...</span>
                      </>
                    ) : (
                      <>
                        <ShareIcon className="w-5 h-5" />
                        <span>Paylaş ve €1 Ücret Al</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Complete Job Dialog */}
        <AnimatePresence>
          {showCompleteDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => !loading && setShowCompleteDialog(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-background dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold text-foreground dark:text-white mb-4 flex items-center gap-2">
                  <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  İşi Tamamla
                </h2>

                <p className="text-muted-foreground dark:text-gray-300 mb-6">
                  Bu işi tamamlayarak, hesabınızdan €5 ücret alınacaktır. Bu
                  işlem geri alınamaz.
                </p>

                <div className="flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCompleteDialog(false)}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    İptal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMarkJobAsComplete}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {processingPayment ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>İşleniyor...</span>
                      </>
                    ) : (
                      <>
                        <CreditCardIcon className="w-5 h-5" />
                        <span>Tamamla ve €5 Öde</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Components */}
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
      </div>
    </div>
  );
}
