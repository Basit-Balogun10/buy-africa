import express from "express";
import {
    createPaystackPaymentLink,
} from "../../../handlers/third-party/paystack.js";
import { protect } from "../../../middleware/authMiddleware.js";

const paystackApiRouter = express.Router();

paystackApiRouter.post("/payment-link", protect, createPaystackPaymentLink);

export default paystackApiRouter;
