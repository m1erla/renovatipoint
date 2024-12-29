import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { MessageCircle, Clock, CheckCircle, AlertCircle } from "lucide-react";

const ChatRoomList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      const response = await (userRole === "EXPERT"
        ? ChatService.getExpertChatRooms(userId)
        : ChatService.getUserChatRooms(userId));

      setChatRooms(response);
    } catch (err) {
      setError("Failed to load chat rooms");
      console.error("Error fetching chat rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChatRoomClick = (chatRoomId) => {
    navigate(`/chat/${chatRoomId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Your Chat Rooms</h2>
      <div className="space-y-4">
        {chatRooms.map((room) => (
          <div
            key={room.id}
            onClick={() => handleChatRoomClick(room.id)}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">
                  {room.ad?.title || "Untitled Job"}
                </h3>
                <p className="text-sm text-gray-600">
                  {userRole === "EXPERT"
                    ? `Client: ${room.user?.name}`
                    : `Expert: ${room.expert?.name}`}
                </p>
              </div>
              <div className="flex items-center">
                {room.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                    {room.unreadCount}
                  </span>
                )}
                <MessageCircle className="w-5 h-5 ml-2 text-gray-500" />
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {format(new Date(room.lastActivity), "MMM d, yyyy HH:mm")}
              </div>
              <div className="flex items-center">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    room.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : room.status === "COMPLETED"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {room.status}
                </span>
              </div>
            </div>
          </div>
        ))}

        {chatRooms.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4" />
            <p>No chat rooms available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoomList;
