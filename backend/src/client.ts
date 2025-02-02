import { Message } from "./utils/types";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

// Replace with the actual user ID of the logged-in user and conversation ID
const userId = "679a0c7ed09b02bc39624b9c";
const conversationId = "679a409b725129bd47fa99ed";

socket.on("connect", () => {
  console.log("Connected to server");

  // Send a message to the server
  socket.emit("message", {
    sender: userId,
    text: "Hello, server!",
    conversationId: conversationId,
  });

  // Listen for messages from the server
  socket.on("message", (message: Message) => {
    console.log(`Received message from ${message.sender}: ${message.text}`);
  });

  // Disconnect after 5 seconds
  setTimeout(() => {
    socket.disconnect();
  }, 5000);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
