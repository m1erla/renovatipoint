const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  const userId = socket.handshake.query.userId;
  const chatRoomId = socket.handshake.query.chatRoomId;

  socket.join(chatRoomId);

  socket.on("sendMessage", async (messageData, callback) => {
    try {
      // Save the message to the database
      const savedMessage = await saveMessageToDatabase(messageData);

      // Broadcast the message to the room
      io.to(chatRoomId).emit("message", savedMessage);

      callback();
    } catch (error) {
      callback(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(8080, () => {
  console.log("Server is running on port 8080");
});

async function saveMessageToDatabase(messageData) {
  // Implement your database saving logic here
  // Return the saved message
}
