import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import api from "../../utils/api";

const ChatComponent = () => {
  const [name, setname] = useState("");
  const [surname, setSurname] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const chatAreaRef = useRef(null);
  const stompClient = useRef(null);

  const connect = (event) => {
    const token = localStorage.getItem("accessToken");
    event.preventDefault();
    if (name && surname) {
      const socket = new SockJS(`http://localhost:8080/ws?token=${token}`); // Adjust to your backend URL
      stompClient.current = Stomp.over(socket);

      stompClient.current.connect({}, onConnected, onError);
    }
  };

  const onConnected = () => {
    setIsConnected(true);
    stompClient.current.subscribe(
      `/api/v1/users/user/${name}/queue/messages`,
      onMessageReceived
    );
    stompClient.current.subscribe(
      `/api/v1/users/user/public`,
      onMessageReceived
    );

    // Register the connected user
    stompClient.current.send(
      "/app/api/v1/users/user.addUser",
      {},
      JSON.stringify({ name: name, surname: surname, status: "ONLINE" })
    );
    findAndDisplayConnectedUsers();
  };

  const findAndDisplayConnectedUsers = async () => {
    try {
      const response = await api.get("/api/v1/users/users");
      let users = await response.data;
      users = users.filter((user) => user.name !== name);
      setConnectedUsers(users);
    } catch (error) {
      console.error("Error fetching connected users:", error);
    }
  };

  const appendUserElement = (user) => {
    return (
      <li
        key={user.name}
        className={`user-item ${user.name === selectedUserId ? "active" : ""}`}
        onClick={() => userItemClick(user.name)}
      >
        <img src="../img/user_icon.png" alt={user.surname} />
        <span>{user.surname}</span>
        <span className="nbr-msg hidden">0</span>
      </li>
    );
  };

  const userItemClick = (userId) => {
    setSelectedUserId(userId);
    fetchAndDisplayUserChat(userId);
  };

  const fetchAndDisplayUserChat = async (userId) => {
    try {
      const response = await api.get(`/messages/${name}/${userId}`);
      const userChat = await response.json();
      setMessages(userChat);
      if (chatAreaRef.current) {
        chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      }
    } catch (error) {
      console.error("Error fetching user chat:", error);
    }
  };

  const displayMessage = (senderId, content) => {
    setMessages((prevMessages) => [...prevMessages, { senderId, content }]);
  };

  const onMessageReceived = (message) => {
    const parsedMessage = JSON.parse(message.body);
    if (parsedMessage.senderId === selectedUserId) {
      displayMessage(parsedMessage.senderId, parsedMessage.content);
    }
  };

  const onError = (error) => {
    console.error("WebSocket connection error:", error);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (newMessage.trim() && stompClient.current) {
      const chatMessage = {
        senderId: name,
        recipientId: selectedUserId,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
      };
      stompClient.current.send("/app/chat", {}, JSON.stringify(chatMessage));
      displayMessage(name, newMessage);
      setNewMessage("");
    }
  };

  const onLogout = () => {
    stompClient.current.send(
      "/app/api/v1/users/user.disconnectUser",
      {},
      JSON.stringify({ name: name, surname: surname, status: "OFFLINE" })
    );
    window.location.reload();
  };

  useEffect(() => {
    window.addEventListener("beforeunload", onLogout);
    return () => {
      window.removeEventListener("beforeunload", onLogout);
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  return (
    <div>
      {!isConnected ? (
        <div id="username-page">
          <form id="usernameForm" onSubmit={connect}>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              required
            />
            <input
              type="text"
              id="surname"
              placeholder="Enter your full name"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
            <button type="submit">Connect</button>
          </form>
        </div>
      ) : (
        <div id="chat-page">
          <div id="connectedUsers">
            <ul>{connectedUsers.map((user) => appendUserElement(user))}</ul>
          </div>
          <div id="chat-messages" ref={chatAreaRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.senderId === name ? "sender" : "receiver"}
              >
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
          <form id="messageForm" onSubmit={sendMessage}>
            <input
              type="text"
              id="message"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              required
            />
            <button type="submit">Send</button>
          </form>
          <button id="logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
