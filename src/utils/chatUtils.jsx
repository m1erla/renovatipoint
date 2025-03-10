// utils/chatUtils.js
import { toast } from "react-toastify";
import chatService from "../services/chatService";
import expertService from "../services/expertService";
import api from "./api";
import invoiceService from "../services/invoiceService";

export const parseContactInfo = (message) => {
  try {
    const contentData = JSON.parse(message.content);
    if (contentData.type === "contact_info") {
      return contentData;
    }
  } catch (e) {
    console.error("Error parsing message content:", e);
  }
  return null;
};

export const createContactMessage = (user, chatRoomId) => {
  const contactInfo = {
    name: user.name || "",
    surname: user.surname || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    address: user.address || "",
    postCode: user.postCode || "",
  };

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
      ].filter((item) => item.value && item.value !== "undefined undefined"),
    },
  };

  return {
    senderId: user.id,
    chatRoomId: chatRoomId,
    content: JSON.stringify(messageContent),
    messageType: "CONTACT_INFO",
    timestamp: new Date().toISOString(),
  };
};

export const canSendMessage = (chatRoom, user) => {
  if (!chatRoom || !user) return false;

  const isCompleted = chatRoom.isCompleted || chatRoom.status === "COMPLETED";
  const isActive = chatRoom.status === "ACTIVE";

  if (isCompleted) return false;
  if (!isActive) return false;

  const isExpert = user.role === "EXPERT";
  if (isExpert && chatRoom.expertBlocked) return false;

  return true;
};

export const canShareContact = (chatRoom, user) => {
  if (!chatRoom || !user) return false;

  const isUser = user.role === "USER";
  const isActive = chatRoom.status === "ACTIVE";
  const hasSharedContact =
    chatRoom.contactInformationShared ||
    chatRoom.contactShared ||
    chatRoom.hasContactBeenShared;

  return isUser && isActive && !hasSharedContact;
};

export const canCompleteJob = (chatRoom, user) => {
  if (!chatRoom || !user) return false;

  const isExpert = user.role === "EXPERT";
  const isActive = chatRoom.status === "ACTIVE";
  const isCompleted = chatRoom.isCompleted || chatRoom.status === "COMPLETED";
  const hasSharedContact =
    chatRoom.contactInformationShared ||
    chatRoom.contactShared ||
    chatRoom.hasContactBeenShared;

  return isExpert && isActive && !isCompleted && hasSharedContact;
};

export const handleShareContactInformation = async ({
  chatRoom,
  user,
  setLoading,
  setError,
  setInfoShared,
  setShowShareDialog,
  setPaymentError,
  setPaymentDetails,
  setShowPaymentFailure,
  setMessages,
  navigate,
}) => {
  try {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
    }

    if (!chatRoom?.id || !chatRoom?.expert?.id) {
      throw new Error("Gerekli bilgiler eksik. Lütfen sayfayı yenileyin.");
    }

    if (!chatRoom.contactInformationShared) {
      try {
        const expertId = chatRoom.expert.id;
        const paymentInfo = await expertService.getPaymentInfo(expertId);

        if (
          !paymentInfo ||
          !paymentInfo.hasPaymentSetup ||
          !paymentInfo.stripeCustomerId ||
          !paymentInfo.paymentMethodId
        ) {
          throw new Error("Uzman ödeme bilgilerini tam olarak ayarlamamış");
        }

        const userResponse = await api.get("/api/v1/users/response", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userResponse.data) {
          throw new Error("Kullanıcı detayları alınamadı");
        }

        const currentUser = {
          ...user,
          ...userResponse.data,
        };

        const confirmed = window.confirm(
          "İletişim bilgilerinizi paylaşmak istediğinizden emin misiniz? Uzmanın hesabından 1€ tahsil edilecektir."
        );

        if (!confirmed) {
          setShowShareDialog(false);
          return;
        }

        const paymentResponse = await api.post(
          `/api/v1/payments/charge`,
          {
            expertId: expertId,
            stripeCustomerId: paymentInfo.stripeCustomerId,
            paymentMethodId: paymentInfo.paymentMethodId,
            amount: 1,
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

        if (!paymentResponse.data || !paymentResponse.data.paymentIntentId) {
          throw new Error("Geçersiz ödeme yanıtı");
        }

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

            if (statusCheck.data.status === "succeeded") {
              paymentSucceeded = true;
              break;
            } else if (
              statusCheck.data.status === "failed" ||
              statusCheck.data.status === "canceled"
            ) {
              throw new Error("Ödeme başarısız oldu");
            }

            attempts++;
            await new Promise((resolve) => setTimeout(resolve, 3000));
          }

          if (!paymentSucceeded) {
            throw new Error("Ödeme doğrulama zaman aşımı");
          }
        }

        await invoiceService.generateExpertInvoice(
          expertId,
          1,
          paymentResponse.data.paymentIntentId,
          "CONTACT_INFO"
        );

        const contactInfo = {
          name: currentUser.name || "",
          surname: currentUser.surname || "",
          email: currentUser.email || "",
          phoneNumber: currentUser.phoneNumber || "",
          address: currentUser.address || "",
          postCode: currentUser.postCode || "",
        };

        const messageContent = {
          type: "contact_info",
          userInfo: {
            title: "İletişim Bilgileri",
            data: [
              {
                label: "İsim",
                value: `${contactInfo.name} ${contactInfo.surname}`.trim(),
              },
              { label: "E-posta", value: contactInfo.email },
              { label: "Telefon", value: contactInfo.phoneNumber },
              { label: "Adres", value: contactInfo.address },
              { label: "Posta Kodu", value: contactInfo.postCode },
            ].filter(
              (item) => item.value && item.value !== "undefined undefined"
            ),
          },
        };

        const message = {
          senderId: user.id,
          chatRoomId: chatRoom.id,
          content: JSON.stringify(messageContent),
          messageType: "CONTACT_INFO",
          timestamp: new Date().toISOString(),
        };

        await chatService.sendMessage(chatRoom.id, message);
        setMessages((prev) => [...prev, message]);

        const updatedRoom = {
          ...chatRoom,
          contactInformationShared: true,
          contactShared: true,
          lastPaymentStatus: "succeeded",
          lastPaymentIntentId: paymentResponse.data.paymentIntentId,
        };

        const updatedChatRoom = await chatService.updateChatRoom(
          chatRoom.id,
          updatedRoom
        );
        setInfoShared(true);
        setShowShareDialog(false);

        toast.success(
          "İletişim bilgileri başarıyla paylaşıldı ve uzmanın hesabından 1€ tahsil edildi!"
        );
      } catch (error) {
        handlePaymentError({
          error,
          setShowShareDialog,
          setPaymentError,
          setPaymentDetails,
          setShowPaymentFailure,
          setError,
          navigate,
        });
      }
    } else {
      setShowShareDialog(false);
      toast.info("İletişim bilgileri zaten paylaşılmış!");
    }
  } catch (error) {
    handlePaymentError({
      error,
      setShowShareDialog,
      setPaymentError,
      setPaymentDetails,
      setShowPaymentFailure,
      setError,
      navigate,
    });
  } finally {
    setLoading(false);
  }
};

export const handleMarkJobAsComplete = async ({
  chatRoomId,
  user,
  setLoading,
  setError,
  setShowCompleteDialog,
  setPaymentDetails,
  setShowPaymentConfirmation,
  setPaymentError,
  setShowPaymentFailure,
  setChatRoom,
  setMessages,
  navigate,
}) => {
  try {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
    }

    if (!chatRoomId || !user?.id) {
      throw new Error("Gerekli bilgiler eksik");
    }

    const confirmed = window.confirm(
      "Bu işi tamamlamak istediğinizden emin misiniz? Hesabınızdan 5€ tahsil edilecektir."
    );

    if (!confirmed) {
      setShowCompleteDialog(false);
      return;
    }

    const paymentInfo = await expertService.getPaymentInfo(user.id);

    if (
      !paymentInfo?.hasPaymentSetup ||
      !paymentInfo?.stripeCustomerId ||
      !paymentInfo?.paymentMethodId
    ) {
      throw new Error("Lütfen önce ödeme kurulumunuzu tamamlayın");
    }

    const paymentResponse = await api.post(
      `/api/v1/payments/charge`,
      {
        expertId: user.id,
        stripeCustomerId: paymentInfo.stripeCustomerId,
        paymentMethodId: paymentInfo.paymentMethodId,
        amount: 5,
        currency: "eur",
        paymentType: "JOB_COMPLETION",
        chatRoomId: chatRoomId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!paymentResponse.data || !paymentResponse.data.paymentIntentId) {
      throw new Error("Geçersiz ödeme yanıtı");
    }

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

        if (statusCheck.data.status === "succeeded") {
          paymentSucceeded = true;
          break;
        } else if (
          statusCheck.data.status === "failed" ||
          statusCheck.data.status === "canceled"
        ) {
          throw new Error("Ödeme başarısız oldu");
        }

        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      if (!paymentSucceeded) {
        throw new Error("Ödeme doğrulama zaman aşımı");
      }

      if (paymentSucceeded) {
        setPaymentDetails({
          amount: 5,
          paymentType: "JOB_COMPLETION",
          paymentIntentId: paymentResponse.data.paymentIntentId,
        });
        setShowPaymentConfirmation(true);

        try {
          await invoiceService.generateExpertInvoice(
            user.id,
            5,
            paymentResponse.data.paymentIntentId,
            "JOB_COMPLETION"
          );

          await chatService.markJobAsComplete(
            chatRoomId,
            paymentResponse.paymentIntentId
          );

          const updatedRoom = await chatService.getChatRoom(chatRoomId);
          setChatRoom(updatedRoom);
          setShowCompleteDialog(false);

          const systemMessage = {
            senderId: "SYSTEM",
            chatRoomId: chatRoomId,
            content: `İş uzman tarafından tamamlandı olarak işaretlendi. Tamamlama ücreti (5€) tahsil edildi.`,
            messageType: "SYSTEM",
            timestamp: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, systemMessage]);
          toast.success(
            "İş başarıyla tamamlandı ve hesabınızdan 5€ tahsil edildi!"
          );
        } catch (error) {
          console.error("Tamamlama sürecinde hata:", error);
          throw error;
        }
      }
    } else {
      throw new Error(
        `Ödeme şu durumda başarısız oldu: ${paymentResponse.data.status}`
      );
    }
  } catch (error) {
    console.error("İş tamamlama hatası:", error);
    setShowCompleteDialog(false);

    if (error.response?.status === 401) {
      localStorage.clear();
      setError("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
      navigate("/login");
      return;
    }

    let errorMessage = error.message;
    if (errorMessage.includes("Payment verification timeout")) {
      errorMessage =
        "Ödeme hala işleniyor. Lütfen durumu kontrol panelinden kontrol edin.";
    } else if (errorMessage.includes("Payment failed")) {
      errorMessage = "Ödeme başarısız oldu. Lütfen daha sonra tekrar deneyin.";
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
  }
};

const handlePaymentError = ({
  error,
  setShowShareDialog,
  setPaymentError,
  setPaymentDetails,
  setShowPaymentFailure,
  setError,
  navigate,
}) => {
  setShowShareDialog(false);

  if (error.response?.status === 401) {
    localStorage.clear();
    setError("Oturum süresi dolmuş. Lütfen tekrar giriş yapın.");
    navigate("/login");
    return;
  }

  let errorMessage = error.message;
  if (errorMessage.includes("Expert payment setup is incomplete")) {
    errorMessage =
      "Uzman ödeme kurulumunu tamamlamamış. Lütfen daha sonra tekrar deneyin.";
  } else if (errorMessage.includes("Expert Stripe customer ID is missing")) {
    errorMessage =
      "Uzmanın ödeme hesabı eksik. Lütfen daha sonra tekrar deneyin.";
  } else if (errorMessage.includes("Expert payment method ID is missing")) {
    errorMessage =
      "Uzmanın ödeme yöntemi eksik. Lütfen daha sonra tekrar deneyin.";
  } else if (
    errorMessage.includes("Expert bank account information is incomplete")
  ) {
    errorMessage =
      "Uzmanın banka hesap bilgileri eksik. Lütfen daha sonra tekrar deneyin.";
  } else if (errorMessage.includes("Payment verification timeout")) {
    errorMessage =
      "Ödeme doğrulama zaman aşımına uğradı. Lütfen daha sonra tekrar deneyin.";
  }

  setPaymentError(errorMessage);
  setPaymentDetails({
    amount: 1,
    paymentType: "CONTACT_INFO",
  });
  setShowPaymentFailure(true);
  setError(errorMessage);
};
