import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "notification-send service is running 🚀",
  });
});

export default app;
