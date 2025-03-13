import express from "express";

import { PORT } from "./config/env.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";

// Importing Routes
import userRouter from "./routes/user_router.js";
import authRouter from "./routes/auth_router.js";
import subsRouter from "./routes/subscription_router.js";
import connectToDataBase from "./Database/mongodb.js";
import errorMiddleWare from "./middlewares/globalerror.js";
import arcjetMiddleware from "./middlewares/arcjetmiddleware.js";

//  middleware

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(arcjetMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subsRouter);
app.use(errorMiddleWare);

app.listen(PORT, async () => {
  console.log(`Subscription Tracker APi running on http://localhost:${PORT}`);
  await connectToDataBase();
});
