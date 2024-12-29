import { Client } from "@stomp/stompjs";
import api from "../utils/api";
import SockJS from "sockjs-client";

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
    this.subscriptions.forEach((subscription) => {
      try {
        subscription.unsubscribe();
      } catch (error) {
        console.error("Error unsubscribing:", error);
      }
    });
    this.subscriptions.clear();

    if (this.stompClient) {
      try {
        this.stompClient.deactivate();
      } catch (error) {
        console.error("Error disconnecting:", error);
      }
    }
    this.connected = false;
  }

  // async sendMessage(chatRoomId, content, isSharedInformation = false) {
  //   if (!this.connected) {
  //     throw new Error("WebSocket not connected");
  //   }

  //   const message = {
  //     senderId: localStorage.getItem("userId"),
  //     chatRoomId: chatRoomId,
  //     content: content,
  //     isSharedInformation: isSharedInformation,
  //     timestamp: new Date().toISOString(),
  //     type: "CHAT",
  //   };

  //   return new Promise((resolve, reject) => {
  //     try {
  //       this.stompClient.publish({
  //         destination: "/app/chat",
  //         body: JSON.stringify(message),
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //         },
  //       });
  //       resolve(message);
  //     } catch (error) {
  //       console.error("Error sending message:", error);
  //       reject(error);
  //     }
  //   });
  // }
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
        isSharedInformation: false,
        timestamp: new Date().toISOString(),
        type: "CHAT",
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
      return response.data;
    } catch (error) {
      console.error("Error fetching chat room: ", error);
      throw error;
    }
  }

  async getChatRooms() {
    try {
      const response = await fetch("/api/v1/chat/rooms", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch chat rooms");
      return await response.json();
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
      console.error("Error fetching messages:", error);
      throw error;
    }
  }

  async markMessagesAsRead(chatRoomId) {
    await api.post(`/api/v1/chat/rooms/${chatRoomId}/messages/read`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  }

  async getUnreadCount(chatRoomId) {
    const response = await api.get(`/api/v1/chat/rooms/${chatRoomId}/unread`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch unread count");
    const data = await response.json();
    return data.count;
  }
}

export const chatService = new ChatService();

//let stompClient = null;
// let name = null;
// let surname = null;

// const ChatService = {
//   connect: (userId, onMessageReceived) => {
//     const token = localStorage.getItem("accessToken");
//     const socketUrl = `http://localhost:8080/ws?token=${token}`;
//     const socket = new SockJS(socketUrl);
//     stompClient = new Client({
//       webSocketFactory: () => socket,
//       connectHeaders: {
//         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//       },
//       debug: (str) => {
//         console.log(str);
//       },
//       onConnect: () => {
//         console.log("WebSocket Connected");
//         stompClient.subscribe(
//           `/api/v1/users/user/${userId}/queue/messages`,
//           onMessageReceived
//         );
//         stompClient.subscribe(`/api/v1/users/user/public`, onMessageReceived);

//         stompClient.current.send(
//           "/app/api/v1/users/user.addUser",
//           {},
//           JSON.stringify({ name: name, surname: surname, status: "ONLINE" })
//         );
//       },
//       onStompError: (frame) => {
//         console.error("Broker reported error: " + frame.headers["message"]);
//         console.error("Additional details: " + frame.body);
//       },
//       onWebSocketClose: (event) => {
//         console.error("WebSocket connection closed:", event);
//       },
//     });

//     stompClient.activate();
//   },

//   disconnect: () => {
//     if (stompClient !== null) {
//       stompClient.deactivate();
//     }
//     console.log("Disconnected");
//   },

//   sendMessage: (senderId, recipientId, content) => {
//     const chatMessage = {
//       senderId,
//       recipientId,
//       content,
//       timestamp: new Date(),
//     };
//     console.log("Sending message", chatMessage);
//     if (stompClient && stompClient.active) {
//       stompClient.publish({
//         destination: "/app/api/v1/sendMessage",
//         body: JSON.stringify(chatMessage),
//       });
//     } else {
//       console.error("WebSocket is not connected");
//     }
//   },

//   createChat: async (userId, expertEmail) => {
//     try {
//       console.log(
//         "Creating chat for user:",
//         userId,
//         "and expert:",
//         expertEmail
//       );
//       const token = localStorage.getItem("accessToken");

//       if (!token) {
//         console.error("No access token found");
//         throw new Error("No access token found");
//       }

//       const response = await api.post(
//         `/api/v1/create?userId=${userId}&expertEmail=${expertEmail}`,
//         {}, // Empty object as body
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // Add token here
//           },
//         }
//       );

//       console.log("Chat creation response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Error creating chat:", error);
//       if (error.response) {
//         console.error("Error response:", error.response.data);
//       }
//       throw error;
//     }
//   },
//   shareInformation: async (senderId, recipientId, content) => {
//     const token = localStorage.getItem("accessToken");
//     try {
//       const response = await api.post(
//         `/api/v1/share-information`,
//         { senderId, recipientId, content, isSharedInformation: true },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error sharing information:", error);
//       throw error;
//     }
//   },

//   completeJob: async (chatId) => {
//     const token = localStorage.getItem("accessToken");
//     const expertEmail = localStorage.getItem("userEmail");
//     try {
//       const response = await api.post(
//         `/api/v1/complete-job`,
//         { chatId, expertEmail },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error completing job:", error);
//       throw error;
//     }
//   },

//   getChatMessages: async (chatId) => {
//     const token = localStorage.getItem("accessToken");
//     const userId = localStorage.getItem("userId");
//     try {
//       const response = await api.get(`/api/v1/messages/${userId}/${chatId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching chat messages:", error);
//       throw error;
//     }
//   },
//   getChatRoom: async (adId) => {
//     const token = localStorage.getItem("acessToken");
//     if (!token) {
//       console.error("No access token found");
//       throw new Error("No access token found");
//     }

//     try {
//       const response = await api.get(`/api/v1/room/by-ad/${adId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching chat room:", error);
//     }
//   },
// };

// export default ChatService;
