import { Request } from "express";
import mongoose from "mongoose";

export interface User {
  username: string;
  passwordHash: string;
  friends: User[];
}

export interface Conversation {
  id: string;
  users: mongoose.Types.ObjectId[];
  messages: Message[];
  createdAt: Date;
}

export interface Message {
  sender: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  text: string;
  timestamp: Date;
}

export interface RequestWithUser extends Request {
  user?: any;
}
