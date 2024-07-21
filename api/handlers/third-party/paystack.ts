import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import { PaystackService } from "../../services/third-party/paystack.js";
import {
    PaystackPaymentChannels,
    PaystackPaymentDetails,
} from "../../types/index.js";
import { AppConfig } from "../../config/index.js";

export const createPaystackPaymentLink = asyncHandler(
    async (req: Request, res: Response) => {
        console.log("callback: ", req.body.callback_url);

        const paymentDetails: PaystackPaymentDetails = {
            reference: uuidv4(),
            callback_url: AppConfig.APP_LIVE_URL,
            amount: Number(500000) * 100,
            email: "basitbalogun10@gmail.com",
            channels: [
                "card",
                "bank",
                "ussd",
                "qr",
                "mobile_money",
                "bank_transfer",
                "eft",
            ] as PaystackPaymentChannels[],
            metadata: {
                cancel_action: AppConfig.APP_LIVE_URL,
            },
        };

        try {
            const response = await PaystackService.createPaymentLink(
                paymentDetails
            );

            res.status(200).json(response);
        } catch (err) {
            console.error("Unable to create Paystack payment link: ", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);
