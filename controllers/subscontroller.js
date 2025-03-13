import Subscription from "../model/subscription_model.js";

//  Give acess to only admins
export const getAllSubscriptions = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      const error = new Error("You are not the admin");
      error.status(404);
      throw error;
    }
    const subscriptions = await Subscription.find();
    res.status(200).json({
      status: "success",
      subscription: subscriptions.length,
      data: subscriptions,
    });
  } catch (e) {
    next(e);
  }
};

// Only user can create the subscription (and he can only do crud )
export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body, // Spread request body properties
      user: req.user._id, // Add user ID
    });

    res.status(201).json({
      status: "success",
      data: subscription,
    }); // Send the created subscription as a response
  } catch (e) {
    next(e); // Pass error to error-handling middleware
  }
};

export const getUserSubscription = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      const error = new Error("You are not the owner of this account");
      error.status = 401;
      throw error;
    }
    const subscription = await Subscription.find({ user: req.params.id });
    res.status(200).json({ success: true, data: subscription });
  } catch (e) {
    next(e);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.params; // Subscription ID
    const updates = req.body; // Only provided fields will be updated

    // Find the subscription owned by the logged-in user
    const subscription = await Subscription.findOne({
      user: req.user.id,
      _id: id,
    });

    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, message: "Subscription not found" });
    }

    // Ensure only the owner can update
    if (subscription.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this subscription",
      });
    }

    // Update only provided fields
    Object.keys(updates).forEach((key) => {
      subscription[key] = updates[key];
    });

    await subscription.save(); // Save the updated subscription

    res.status(200).json({
      success: true,
      message: "Subscription updated",
      data: subscription,
    });
  } catch (e) {
    next(e);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    const { id } = req.params; // Subscription ID

    // Find the subscription owned by the logged-in user
    const subscription = await Subscription.findOne({
      user: req.user.id,
      _id: id,
    });

    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, message: "Subscription not found" });
    }

    // Ensure only the owner can delete
    if (subscription.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this subscription",
      });
    }

    await Subscription.deleteOne({ _id: id }); // Delete the subscription

    res
      .status(200)
      .json({ success: true, message: "Subscription deleted successfully" });
  } catch (e) {
    next(e);
  }
};
