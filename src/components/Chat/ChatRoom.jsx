import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function ChatRoom() {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await fetch(`/api/v1/chat/rooms`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const data = await response.json();
        setChatRooms(data);
      } catch (error) {
        setError("Failed to load chat rooms");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, [userId]);

  const handleChatRoomClick = (chatRoomId) => {
    navigate(`/chat/${chatRoomId}`);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (chatRooms.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">No chat rooms available</Typography>
        <Typography variant="body2" color="textSecondary">
          {userRole === "EXPERT"
            ? "Send requests to job postings to start chatting"
            : "Accept requests from experts to start chatting"}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 600,
          background: "linear-gradient(45deg, #2c3e50 30%, #FFA726 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Chat Rooms
      </Typography>

      <Grid container spacing={3}>
        {chatRooms.map((room) => (
          <Grid item xs={12} md={6} key={room.id}>
            <Card
              elevation={0}
              sx={{
                cursor: "pointer",
                borderRadius: 2,
                transition: "all 0.3s ease",
                border: "1px solid rgba(0,0,0,0.08)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  borderColor: "#FF5722",
                },
              }}
              onClick={() => handleChatRoomClick(room.id)}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {room.ad.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#2c3e50",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {userRole === "EXPERT"
                    ? `Owner: ${room.user.name}`
                    : `Expert: ${room.expert.name}`}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "text.secondary",
                    mb: 1,
                  }}
                >
                  Last active: {new Date(room.lastActivity).toLocaleString()}
                </Typography>
                {room.recentMessages?.length > 0 && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: "rgba(0,0,0,0.02)",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Latest: {room.recentMessages[0].content}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ChatRoom;
