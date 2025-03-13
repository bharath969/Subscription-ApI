import mongoose from "mongoose";
import User from "../model/user_model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2NmZDNkMzdmMThkMzNjNjJlNDQ4NDUiLCJpYXQiOjE3NDE2NzM0MjcsImV4cCI6MTc0MTc1OTgyN30.cLsoC8dKm3EYPDfJAAR4tphU4t-pIqj7zFQibidFlXM

export const signUp = async (req, res, next) => {
  // console.log(req.body);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, email, password, role } = req.body;

    // Check if the user exists or not
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUsers = await User.create(
      [{ name, email, password: hashedPassword, role }],
      { session }
    );

    // Generate a JWT token
    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Commit the transaction and end the session
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { token, userId: newUsers[0] },
    });
  } catch (error) {
    // Rollback the transaction in case of an error
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //  Lets check whether the user exists
    const userExists = await User.findOne({ email });

    // If user does not exist
    if (!userExists) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // Check the password
    const isValidPassword = await bcrypt.compare(password, userExists.password);

    if (!isValidPassword) {
      const error = new Error("Invalid Password");
      error.statusCode = 401;
      throw error;
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: userExists._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Send response with token
    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        userId: userExists,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.status(200).json({
      status: "success",
      message: "Logged out",
    });
  } catch (e) {
    next(e);
  }
};
