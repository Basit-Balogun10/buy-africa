import express from "express";
import { logout, sendOTP, verifyOTP } from "../../handlers/auth/index.js";

const authRouter = express.Router();

authRouter.delete("/logout", logout);
authRouter.post("/send-otp", sendOTP);
authRouter.post("/verify-otp", verifyOTP);

export default authRouter;
