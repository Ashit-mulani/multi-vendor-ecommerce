import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/errorHandler.js";
import userRouter from "./routes/user-route.js";
import vendorRouter from "./routes/vendor-route.js";
import adminRouter from "./routes/admin-route.js";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Auth service is running 🚀",
  });
});

const localhostRegex = /^http:\/\/localhost(:\d+)?$/;

app.use(
  "/auth/api",
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (localhostRegex.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

app.use(express.static("public"));

app.use("/auth/api/v1/user", userRouter);

app.use("/auth/api/v1/vendor", vendorRouter);

app.use("/auth/api/v1/admin", adminRouter);

app.use(errorHandler);

export default app;
