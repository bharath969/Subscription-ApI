import { Router } from "express";
import authorize from "../middlewares/authmiddleware.js";
import {
  createSubscription,
  getUserSubscription,
  getAllSubscriptions,
  updateSubscription,
  deleteSubscription,
} from "../controllers/subscontroller.js";

const subsRouter = Router();

export default subsRouter;

subsRouter.get("/", authorize, getAllSubscriptions);

subsRouter.get("/:id", authorize, getUserSubscription);

subsRouter.post("/", authorize, createSubscription);

subsRouter.put("/:id", authorize, updateSubscription);

subsRouter.delete("/:id", authorize, deleteSubscription);

subsRouter.put("/:id/cancel", (req, res) => {
  res.send({ title: "cancel the Subscription of a single user " });
});

subsRouter.put("/renewals", (req, res) => {
  res.send({ title: "Get the Subscription to be renewed" });
});
