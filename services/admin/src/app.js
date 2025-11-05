import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/errorHandler.js";
import categoryRoute from "./routes/category-route.js";
import attributeRoute from "./routes/attribute-route.js";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "admin service is running 🚀",
  });
});

app.use(
  cors({
    origin: [
      "http://localhost:3002",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
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

app.use("/admin/api/v1/attribute", attributeRoute);

app.use("/admin/api/v1/category", categoryRoute);

app.use(errorHandler);

export default app;
