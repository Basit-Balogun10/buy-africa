import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { FilterQuery, ObjectId, Types } from "mongoose";
import { AccountService } from "../../services/account";
import { generateToken } from "../../utils/generators";
import { AppConfig } from "../../config/index";

export const createAccount = asyncHandler(
    async (req: Request, res: Response) => {
        const { accountInfo } = req.body;

        if (!accountInfo.email || !accountInfo.name) {
            res.status(400);
            throw new Error("Email and name are required");
        }

        try {
            const account = await AccountService.getAccountByEmail(
                accountInfo.email
            );

            if (account) {
                res.status(400).json({
                    error: "Account with email already exists",
                });
            } else {
                const newAccount = await AccountService.createAccount(
                    accountInfo
                );

                const token = generateToken(newAccount);

                const resData = {
                    account: newAccount,
                    token,
                };

                const cookieOptions = {
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
                    secure: true,
                    httpOnly: true,
                    sameSite: "lax" as const,
                };

                res.cookie(AppConfig.AUTH_HEADER_NAME, token, cookieOptions);
                res.status(201).json(resData);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Unable to create account" });
        }
    }
);

export const getAccount = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;

    if (!accountId) {
        res.status(400).json({
            error: "Invalid Request. Please provide an account ID",
        });
    }

    try {
        const account = await AccountService.getAccountById(accountId);

        if (!account) {
            res.status(404).json({ error: "Account not found" });
        }

        res.status(200).json(account);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to get account" });
    }
});

export const updateAccount = asyncHandler(
    async (req: Request, res: Response) => {
        const { accountId } = req.params;
        const { updatedFields } = req.body;

        if (!accountId || !updatedFields) {
            res.status(400).json({
                error: "Invalid Request. Please provide account ID and updatedFields",
            });
        }

        try {
            const account = await AccountService.getAccountById(accountId);

            if (!account) {
                res.status(404).json({ error: "Account not found" });
            }

            const updatedAccount = await AccountService.updateAccount(
                accountId,
                updatedFields
            );

            console.log("NEW: ", updatedAccount);

            res.status(200).json(updatedAccount);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Unable to update account" });
        }
    }
);
