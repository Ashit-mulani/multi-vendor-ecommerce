import { asyncFunc } from "../utils/asyncFunc.js";
import { sendEmailEvent } from "../utils/send.js";
import { validateFields } from "../utils/validateFields.js";
import { apiRes } from "../utils/apiRes.js";
import { apiError } from "../utils/apiError.js";
import logger from "../utils/logger.js";

export const produceSendEmailEvent = asyncFunc(async (req, res) => {
  const { to, subject, body } = req.body;

  validateFields({ to, subject, body });

  const data = {
    to,
    subject,
    body,
  };

  try {
    await sendEmailEvent(data);
    return res.status(200).json(new apiRes(200, "Email successfully queued"));
  } catch (error) {
    logger.error({ error }, "Failed to queue Email !");
    throw new apiError(500, "Failed to queue Email !");
  }
});
