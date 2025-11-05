import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { produceSendEmailEvent } from "../controller/email-control.js";

const notifyRouter = Router();

notifyRouter.route("/email").post(auth, produceSendEmailEvent);

export default notifyRouter;
