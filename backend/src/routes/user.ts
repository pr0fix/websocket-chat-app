import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import userService from "../services/userService";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();

router.get(
  "/user/:id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = new mongoose.Types.ObjectId(req.params.id);
    try {
      const result = await userService.getUserById(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    try {
      const result = await userService.login(username, password);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    try {
      const result = await userService.signup(username, password);
      res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/add-friend",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const { senderId, friendId } = req.body;

    try {
      const result = await userService.addFriend(senderId, friendId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
