import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user";

const getAllUsers = async () => {
  try {
    const users = User.find();
    if (!users) {
      throw new Error("No users found");
    }
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return { error: "Internal server error" };
  }
};

const getUserById = async (userId: mongoose.Types.ObjectId) => {
  try {
    const user = User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return { error: "Internal server error" };
  }
};

const login = async (username: string, password: string) => {
  try {
    const user = await User.findOne({ username });

    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
      return { error: "Invalid username or password" };
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.JWT_SECRET as string, {
      expiresIn: 60 * 60,
    });

    return { token, userId: user.id, username: user.username };
  } catch (error) {
    console.error("Error during login:", error);
    return { error: "Internal server error" };
  }
};

const signup = async (username: string, password: string) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const userExists = await User.findOne({ username });
  if (userExists) {
    throw new Error("Username is already in use");
  }
  const user = new User({
    username,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    if (savedUser !== null) {
      const loginResult = await login(username, password);
      if (loginResult.error) {
        throw new Error(loginResult.error);
      }
      return loginResult;
    } else {
      throw new Error("An error occurred while saving the user");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during signup:", error.message);
    }
    console.error("An error occurred while signing up:", error);
    throw new Error("An error occurred while saving the user");
  }
};

const addFriend = async (senderId: string, friendId: string) => {
  try {
    if (!senderId || !friendId) {
      throw new Error("Both senderId and friendId are required");
    }
    const user = await User.findById(senderId);
    const friendToAdd = await User.findById(friendId).select("-friends");

    if (!user || !friendToAdd) {
      throw new Error("User or friend not found");
    }
    if (user.id === friendToAdd.id) {
      throw new Error("User cannot add themselves as a friend");
    }

    if (user.friends.includes(friendToAdd.id)) {
      throw new Error("Friend is already added");
    }

    user.friends.push(friendToAdd);
    const updatedUser = await user.save();

    return updatedUser;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error adding friend:", error.message);
      throw new Error(error.message);
    }
    throw new Error("An error occurred while adding a friend");
  }
};

export default { getAllUsers, getUserById, login, signup, addFriend };
