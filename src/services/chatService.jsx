import { Client } from "@stomp/stompjs";
import api from "../utils/api";
import SockJS from "sockjs-client";
import axios from "axios";

class ChatService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = new Map();
  }

  async connect(
    userId,
    onMessageReceived,
    onNotificationReceived,
    onErrorReceived
  ) {
    try {
      if (this.stompClient && this.connected) {
        console.log("WebSocket already connected");
        return;
      }

      const token = localStorage.getItem("accessToken");
      const socket = new SockJS(`http://localhost:8080/ws?token=${token}`);

      this.stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: (str) => {
          console.log("STOMP:", str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log("WebSocket Connected");
          this.connected = true;

          // Subscribe to messages
          if (onMessageReceived) {
            const messageSub = this.stompClient.subscribe(
              `/user/${userId}/queue/messages`,
              onMessageReceived
            );
            this.subscriptions.set("messages", messageSub);
          }

          // Subscribe to notifications
          if (onNotificationReceived) {
            const notifSub = this.stompClient.subscribe(
              `/user/${userId}/queue/notifications`,
              onNotificationReceived
            );
            this.subscriptions.set("notifications", notifSub);
          }
          this.stompClient.subscribe(
            `/user/${userId}/queue/errors`,
            onErrorReceived || this.defaultErrorHandler
          );
        },
        onDisconnect: () => {
          console.log("WebSocket Disconnected");
          this.connected = false;
        },
        onStompError: (frame) => {
          console.error("STOMP error:", frame);
        },
        onWebSocketError: (event) => {
          console.error("WebSocket error:", event);
        },
        onWebSocketClose: (event) => {
          console.error("WebSocket closed:", event);
        },
      });

      await this.stompClient.activate();
    } catch (error) {
      console.error("WebSocket connection error:", error);
      throw error;
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.subscriptions.forEach((subscription) => {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error("Error unsubscribing:", error);
        }
      });
      this.subscriptions.clear();

      try {
        this.stompClient.deactivate();
      } catch (error) {
        console.error("Error disconnecting:", error);
      }
      this.connected = false;
    }
  }

  async sendMessage(chatRoomId, messageData) {
    if (!this.connected) {
      throw new Error("WebSocket not connected");
    }

    // If messageData is already a formatted message object
    if (
      typeof messageData === "object" &&
      messageData.hasOwnProperty("content")
    ) {
      // Use the message object directly, but ensure content is a string
      const message = {
        ...messageData,
        content:
          typeof messageData.content === "object"
            ? JSON.stringify(messageData.content)
            : messageData.content,
      };

      return new Promise((resolve, reject) => {
        try {
          this.stompClient.publish({
            destination: "/app/chat",
            body: JSON.stringify(message),
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
          resolve(message);
        } catch (error) {
          console.error("Error sending message:", error);
          reject(error);
        }
      });
    } else {
      // If messageData is just the content, create a standard chat message
      const message = {
        senderId: localStorage.getItem("userId"),
        chatRoomId: chatRoomId,
        content:
          typeof messageData === "object"
            ? JSON.stringify(messageData)
            : messageData,
        timestamp: new Date().toISOString(),
        messageType: "CHAT",
      };

      return new Promise((resolve, reject) => {
        try {
          this.stompClient.publish({
            destination: "/app/chat",
            body: JSON.stringify(message),
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
          resolve(message);
        } catch (error) {
          console.error("Error sending message:", error);
          reject(error);
        }
      });
    }
  }

  async getChatRoom(chatRoomId) {
    try {
      const response = await api.get(`/api/v1/chat/rooms/${chatRoomId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // Debug logları
      console.log("Debug - Raw Chat Room Response:", response.data);

      // Backend'den gelen durumu kontrol et
      const isCompleted = Boolean(
        response.data.status === "COMPLETED" ||
          response.data.completed ||
          response.data.completionPaymentProcessed ||
          response.data.isCompleted ||
          response.data.stripePaymentIntentId // Ödeme yapıldıysa kesinlikle tamamlanmıştır
      );

      // İletişim bilgisi paylaşım durumunu kontrol et
      const hasContactBeenShared = Boolean(
        response.data.contactInformationShared ||
          response.data.hasContactBeenShared ||
          response.data.contactSharingRecords?.length > 0
      );

      // Chat room nesnesini oluştur
      const chatRoom = {
        ...response.data,
        isCompleted: isCompleted,
        status: isCompleted ? "COMPLETED" : response.data.status || "ACTIVE",
        completed: isCompleted,
        completionPaymentProcessed: isCompleted,
        contactInformationShared: hasContactBeenShared,
      };

      console.log("Debug - Final Chat Room State:", chatRoom);
      return chatRoom;
    } catch (error) {
      console.error("Error fetching chat room: ", error);
      throw error;
    }
  }

  async getChatRooms() {
    try {
      const response = await api.get("/api/v1/chat/rooms", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // Her bir chat room için tamamlanma durumunu kontrol et
      const chatRooms = response.data.map((room) => ({
        ...room,
        isCompleted: Boolean(
          room.completed ||
            room.status === "COMPLETED" ||
            room.completionPaymentProcessed
        ),
        status: room.status || "ACTIVE",
        completed: room.completed || false,
        completionPaymentProcessed: room.completionPaymentProcessed || false,
      }));

      return chatRooms;
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      throw error;
    }
  }

  async getChatMessages(chatRoomId, page = 0, size = 20) {
    try {
      const response = await api.get(
        `/api/v1/chat/rooms/${chatRoomId}/messages`,
        {
          params: { page, size },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      throw error;
    }
  }

  async markMessagesAsRead(chatRoomId) {
    try {
      await api.post(`/api/v1/chat/rooms/${chatRoomId}/messages/read`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw error;
    }
  }

  async getUnreadCount(chatRoomId) {
    try {
      const response = await api.get(
        `/api/v1/chat/rooms/${chatRoomId}/unread`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data.count;
    } catch (error) {
      console.error("Error getting unread count:", error);
      throw error;
    }
  }

  async markJobAsComplete(chatRoomId, paymentIntentId) {
    try {
      const response = await api.post(
        `/api/v1/chat/rooms/${chatRoomId}/complete`,
        { paymentIntentId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error completing job:", error);
      throw error;
    }
  }

  async shareContactInformation(chatRoomId) {
    try {
      const response = await api.post(
        `/api/v1/chat/rooms/${chatRoomId}/share-contact`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Failed to share contact information"
        );
      }
      console.error("Error sharing contact information:", error);
      throw error;
    }
  }

  defaultErrorHandler(error) {
    console.error("WebSocket error received:", error);
  }
}

export default new ChatService();
