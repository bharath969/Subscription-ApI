import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../model/user_model.js";

const authorize = async (req, res, next) => {
  try {
    console.log("Headers received:", req.headers); // Debugging
    console.log(`req.params is ${req.params}`);

    const token = req.headers.authorization?.split(" ")[1]; // Safe token extraction

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Decode the token
    const decoded = jwt.verify(token, JWT_SECRET); // Make sure to replace `JWT_SECRET` with your actual secret
    console.log("Decoded Token:", decoded); // Debugging

    if (!decoded.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid token payload" });
    }

    // Find user by ID from decoded token
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user; // Attach the user object to the request
    // console.log(`user is ${user}`);
    // Handle update (PUT/PATCH)
    if (req.method === "PUT" || req.method === "PATCH") {
      // Check if the user is trying to update their own data or an admin is updating
      if (req.body._id !== user._id.toString() && user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Forbidden: You can only update your own data" });
      }
    }

    // Handle delete (DELETE)
    if (req.method === "DELETE") {
      // Check if the user is trying to delete their own data or an admin is deleting
      if (req.params.id !== user._id.toString() && user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Forbidden: You can only delete your own account" });
      }
    }

    // Proceed to the next middleware if all checks pass
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    res.status(401).json({
      message: "Unauthorized: Invalid token",
      error: error.message,
    });
  }
};

export default authorize;
