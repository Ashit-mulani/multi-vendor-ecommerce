import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/errorHandler.js";
import storeRouter from "./routes/store-route.js";
import productRouter from "./routes/product-route.js";

const app = express();

const ALLOWED_ORIGINS = [""];

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/BFF-vendor/catalogue/api/v1/store", storeRouter);

app.use("/BFF-vendor/product/api/v1/product", productRouter);

app.use(errorHandler);

export default app;
