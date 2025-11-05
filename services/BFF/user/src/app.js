import express from "express";
import cors from "cors";
import { errorHandler } from "./utils/errorHandler.js";

const app = express();

const ALLOWED_ORIGINS = ["*"];

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(errorHandler);

export default app;
