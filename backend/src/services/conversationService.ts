import mongoose from "mongoose";
import Conversation from "../models/conversation";

const findConversation = async (users: mongoose.Types.ObjectId[]) => {
  try {
    return await Conversation.findOne({
      users: {
        $all: users,
        $size: users.length,
      },
    });
  } catch (error) {
    console.error("Error finding conversation:", error);
    throw new Error("Failed to find conversation");
  }
};

const createConversation = async (users: mongoose.Types.ObjectId[]) => {
  try {
    const existingConversation = findConversation(users);

    if (existingConversation) return existingConversation;

    const newConversation = new Conversation({
      users,
      messages: [],
      createdAt: new Date(),
    });
    await newConversation.save();
    return newConversation;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw new Error("Failed to create conversation");
  }
};

const saveMessage = async (
  conversationId: mongoose.Types.ObjectId,
  sender: mongoose.Types.ObjectId,
  text: string,
  timestamp: Date
) => {
  try {
    if (!conversationId || !sender || !text || !timestamp) {
      throw new Error("All properties of a message are required");
    }
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const newMessage = {
      sender,
      conversationId,
      text,
      timestamp,
    };

    conversation.messages.push(newMessage);
    await conversation.save();

    return newMessage;
  } catch (error) {
    console.error("Error saving message:", error);
    throw new Error("Failed to save message");
  }
};

export default { findConversation, createConversation, saveMessage };
