import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  useTheme,
  Container,
  Badge,
  Chip,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useCustomTheme } from "../../context/ThemeContext";
import chatService from "../../services/chatService";
import { PaymentRounded as PaymentIcon } from "@mui/icons-material";

function ChatRoom() {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const { isDarkMode } = useCustomTheme();

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        console.log("Current user role:", user?.role);
        const rooms = await chatService.getChatRooms();
        setChatRooms(rooms);

        // Her chat room için okunmamış mesaj sayısını al
        const counts = {};
        for (const room of rooms) {
          try {
            const count = await chatService.getUnreadCount(room.id);
            counts[room.id] = count;
          } catch (err) {
            console.error(
              `Error fetching unread count for room ${room.id}:`,
              err
            );
          }
        }
        setUnreadCounts(counts);
      } catch (error) {
        setError("Failed to load chat rooms");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, [user]);

  const handleChatRoomClick = (chatRoomId) => {
    navigate(`/chat/${chatRoomId}`);
  };

  const isChatRoomCompleted = (room) => {
    return (
      room.completed ||
      room.status === "COMPLETED" ||
      room.completionPaymentProcessed ||
      room.isCompleted
    );
  };

  const hasSharedContactInfo = (room) => {
    return (
      room.contactInformationShared ||
      room.contactShared ||
      room.hasContactBeenShared ||
      (room.recentMessages &&
        room.recentMessages.some((msg) => msg.messageType === "CONTACT_INFO"))
    );
  };

  const canShowCompleteButton = (room) => {
    return (
      user?.role === "EXPERT" &&
      !isChatRoomCompleted(room) &&
      hasSharedContactInfo(room) &&
      room.status === "ACTIVE"
    );
  };

  const getStatusChip = (room) => {
    if (isChatRoomCompleted(room)) {
      return (
        <Chip label="Completed" color="success" size="small" sx={{ mr: 1 }} />
      );
    }
    if (hasSharedContactInfo(room)) {
      return (
        <Chip label="Contact Shared" color="info" size="small" sx={{ mr: 1 }} />
      );
    }
    if (room.expertBlocked) {
      return (
        <Chip
          label="Expert Blocked"
          color="error"
          size="small"
          sx={{ mr: 1 }}
        />
      );
    }
    return <Chip label="Active" color="primary" size="small" sx={{ mr: 1 }} />;
  };

  const renderActionButtons = (room) => {
    if (canShowCompleteButton(room)) {
      return (
        <Button
          variant="contained"
          color="success"
          size="small"
          startIcon={<PaymentIcon />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/chat/${room.id}`);
          }}
          sx={{ mt: 2 }}
        >
          Complete Job (€5)
        </Button>
      );
    }
    return null;
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (chatRooms.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 200px)",
          p: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f7",
        }}
      >
        <Paper
          sx={{
            p: 3,
            textAlign: "center",
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            maxWidth: 400,
            width: "100%",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">No chat rooms found</Typography>
          <Typography variant="body2" color="textSecondary">
            {user?.role === "EXPERT"
              ? "Send offers to job postings to start chatting"
              : "Accept expert offers to start chatting"}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 200px)",
        backgroundColor: "#f5f5f7",
        pt: { xs: 8, sm: 9 },
        pb: 4,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: "#2c3e50",
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
            }}
          >
            Chat Rooms
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            View and manage your conversations
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {chatRooms.map((room) => (
            <Grid item xs={12} md={6} key={room.id}>
              <Badge
                badgeContent={unreadCounts[room.id] || 0}
                color="primary"
                sx={{ width: "100%" }}
              >
                <Card
                  elevation={0}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "background.paper",
                    width: "100%",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    },
                  }}
                  onClick={() => handleChatRoomClick(room.id)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      {getStatusChip(room)}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#2c3e50",
                        mb: 1,
                      }}
                    >
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
                      {user?.role === "EXPERT"
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
                      Last activity:{" "}
                      {new Date(room.lastActivity).toLocaleString()}
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
                    {renderActionButtons(room)}
                  </CardContent>
                </Card>
              </Badge>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default ChatRoom;
