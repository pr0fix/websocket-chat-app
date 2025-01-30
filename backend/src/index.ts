import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { PORT } from "./utils/constants";
import userRouter from "./routes/user";
import conversationRouter from "./routes/conversation";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server);

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

io.on("connection", (socket: Socket) => {
  console.log("New client connected");
  socket.on("message", async ({ sender, text, conversationId }) => {
    try {
      const response = await axios.post(
        `http://localhost:${PORT}/api/conversation/${conversationId}/messages`,
        { sender, text }
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error saving message to database", error.message);
      }
      console.error("Unknown error occurred while saving message to database");
    }
    io.emit("message", { sender, text });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// server health check
app.get("/ping", (_req: Request, res: Response) => {
  res.send("pong");
});

app.use("/api", [userRouter, conversationRouter]);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.message);
  res.status(400).json({ error: err.message });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
