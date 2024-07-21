import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AppConfig } from "../../config/index";
import { generateRandomCharacters, encryptData } from "../../utils/index";
import "../../types/index";
import initializeRedisClient from "../../config/redis";
import sendEmail from "../../config/nodemailer";
import { generateCode, generateToken } from "../../utils/generators";
import axios from "axios";
import { AccountService } from "../../services/account";
import { IAuthenticatedRequest } from "../../middleware/authMiddleware";

export const sendOTP = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({
            error: "Please provide email address in the request body",
        });
    }
    const redisClient = await initializeRedisClient();

    const OTP = generateCode();
    const emailData = {
        subject: "Just a Friendly Confirmation Check",
        website: AppConfig.APP_LIVE_URL,
        email,
        OTP,
    };

    await sendEmail(emailData, "api/templates/emails/verifyOTP.pug");
    console.log("Email sent");

    const OTPObject = {
        email,
        value: OTP,
        retries: 0,
    };

    const OTPKey = `email-otp:${email}`;
    await redisClient?.setEx(OTPKey, 300, JSON.stringify(OTPObject));
    res.status(200).json({ success: true, message: "OTP sent successfully" });
});

export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
    const { email, OTPFromUser } = req.body;

    // Validate input
    if (!OTPFromUser) {
        res.status(400).json({ error: "OTP is required" });
    } else if (!email) {
        res.status(400).json({ error: "Email is required" });
    }
    const redisClient = await initializeRedisClient();

    const otpKey = `email-otp:${email}`;

    const otpObjectString = await redisClient?.get(otpKey);

    console.log("Object string: ", otpObjectString);

    if (!otpObjectString) {
        console.log("OTP has expired");
        res.status(403).json({
            error: "OTP has expired",
            message:
                "The OTP has expired. Tap the resend button to request for a new one.",
        });
        return;
    }

    const otpObject = JSON.parse(otpObjectString);
    const otpExpiry = await redisClient?.TTL(otpKey); // Get the original expiry time in milliseconds

    if (otpObject.email !== email) {
        console.log("Invalid email");
        res.status(401).json({
            error: "Invalid email",
            message:
                "We encountered an issue verifying your OTP, please try using other sign-in methods.",
        });
        return;
    }

    if (otpObject.value !== OTPFromUser) {
        otpObject.retries += 1;

        // Update the object in Redis without changing the expiration time
        otpExpiry &&
            (await redisClient?.setEx(
                otpKey,
                otpExpiry,
                JSON.stringify(otpObject)
            ));

        // Check if maximum retries have been reached
        if (otpObject.retries >= 3) {
            console.log("Maximum retries reached");
            res.status(401).json({
                error: "Maximum retries reached",
                message:
                    "You've reached the maximum number of retries for this OTP. Tap the resend button to request for a new one.",
            });
            return;
        }

        const newExpiry = await redisClient?.TTL(otpKey); // Get the new expiry time in milliseconds

        if (newExpiry !== otpExpiry) {
            console.log(`Expiry time has changed ${newExpiry} VS ${otpExpiry}`);
            // Handle the case where the expiry time has changed
        } else {
            console.log(`No change in expiry ${newExpiry} VS ${otpExpiry}`);
        }

        console.log("Invalid OTP");
        res.status(401).json({
            error: "Invalid OTP",
            message: "You have entered an invalid OTP. Please try again.",
        });
    } else {
        console.log("OTP verification successful");

        // Check if user exists and return user
        const account = await AccountService.getAccountByEmail(email);

        if (account) {
            console.log("Account exists");
            const token = generateToken(account);

            const resData = {
                account,
                isNewAccount: false,
                message: "OTP verification successful",
                success: true,
                token,
            };

            const cookieOptions = {
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
                secure: true,
                httpOnly: true,
                sameSite: "lax" as const,
            };

            res.cookie(AppConfig.AUTH_HEADER_NAME, token, cookieOptions);
            res.status(200).json(resData);
        } else {
            console.log("New account");

            res.status(200).json({
                account: { email },
                isNewAccount: true,
                message: "OTP verification successful",
                success: true,
            });
        }
    }
});

export const logout = asyncHandler(
    async (req: IAuthenticatedRequest, res: Response) => {
        const cookieOptions = {
            secure: true,
            httpOnly: true,
            sameSite: "lax" as const,
        };

        res.clearCookie(AppConfig.AUTH_HEADER_NAME, cookieOptions);
        res.status(204).json(req.account);
    }
);
