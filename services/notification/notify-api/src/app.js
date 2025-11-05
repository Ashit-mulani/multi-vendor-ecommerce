import express from "express";
import cors from "cors";
import notifyRouter from "./routes/notify-route.js";
import { errorHandler } from "./utils/errorHandler.js";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "notification api service is running 🚀",
  });
});

app.use(
  "/v1/notify",
  cors({
    origin: "*",
    methods: ["POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
  express.json(),
  notifyRouter
);

app.use(errorHandler);

export default app;
