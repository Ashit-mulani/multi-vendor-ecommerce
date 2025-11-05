import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, body) => {
  const mailOptions = {
    from: `"ApnaBazaar" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: body,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error(
      { error, to, subject, body },
      "_F email send failed now in deadEmailQueue"
    );
  }
};
