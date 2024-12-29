import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Badge, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { chatService } from "../../services/chatService";

export default function UnreadMessages() {
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchUnreadMessages();
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Update count every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadMessages = async () => {
    try {
      const messages = await chatService.getUnreadMessages(userId);
      setUnreadMessages(messages);
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await chatService.getUnreadMessageCount(userId);
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  return (
    <div>
      <Typography variant="h6">
        Unread Messages <Badge badgeContent={unreadCount} color="primary" />
      </Typography>
      <List>
        {unreadMessages.map((message, index) => (
          <ListItem
            key={index}
            component={Link}
            to={`/chat/${message.senderId}`}
          >
            <ListItemText
              primary={`From: ${message.senderId}`}
              secondary={message.content}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
