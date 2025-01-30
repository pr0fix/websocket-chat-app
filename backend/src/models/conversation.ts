import mongoose from "mongoose";
import { Conversation, Message } from "../utils/types";

const messageSchema = new mongoose.Schema<Message>({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema<Conversation>({
  users: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
});

// Transform _id to id for JSON responses
conversationSchema.set("toJSON", {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Conversation = mongoose.model<Conversation>(
  "Conversation",
  conversationSchema
);

export default Conversation;
