import express from "express";
import cors from "cors";
import { errorHandler } from "./utils/errorHandler.js";
import productRouter from "./routes/product-route.js";

const app = express();

app.get("/", (_, res) => {
  return res.status(200).json({ message: "_ok catalogue write 6001" });
});

const ALLOWED_ORIGINs = ["http://localhost:5002", "http://localhost:5001"];

app.use(
  cors({
    origin: ALLOWED_ORIGINs,
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/product/api/v1/product", productRouter);

app.use(errorHandler);

export default app;
