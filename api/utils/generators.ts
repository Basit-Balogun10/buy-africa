import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AppConfig } from "../config/index";
import { IAccount, IUser } from "../models/account";

export const generateToken = (user: IUser, account: IAccount) => {
    const issuedAt = new Date().getTime();

    const tokenPayload = {
        accountId: account._id,
        email: account.email,
        iat: issuedAt,
        role: account.role,
        userId: user._id,
    };

    return jwt.sign(tokenPayload, AppConfig.JWT_SECRET, {
        expiresIn: "7d",
    });
};

export const generateRandomCharacters = (length: number) => {
    return crypto.randomBytes(length).toString("hex");
};

export const generateCode = (length?: number) => {
    const randomBytes = crypto.getRandomValues(new Uint32Array(1));
    const OTP = Math.floor(randomBytes[0] / (0xffffffff / 1000000))
        .toString()
        .padStart(length || 6, "0");
    return OTP;
};
