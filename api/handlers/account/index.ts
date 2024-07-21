import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { AccountService } from "../../services/account";
import { generateToken } from "../../utils/generators";
import { AppConfig } from "../../config/index";
import { IAccount, IBuyer, IVendor } from "../../models/account";

export const createAccount = asyncHandler(
    async (req: Request, res: Response) => {
        const { baseProfile, profileByRole } = req.body as {
            baseProfile: IAccount;
            profileByRole: Partial<IBuyer & IVendor>;
        };

        console.log("Base profile: ", baseProfile);
        console.log("Profile by user role: ", profileByRole);

        if (!baseProfile && !profileByRole) {
            res.status(400).json({
                error: "Invalid Request. Please provide baseProfile and profileByRole",
            });
        }

        try {
            if (baseProfile.email) {
                const account = await AccountService.getAccountByQuery({
                    email: baseProfile.email,
                });

                if (account) {
                    res.status(400).json({
                        error: "Account with email already exists",
                    });
                } else {
                    const { newAccount, newUser } =
                        await AccountService.createAccount(
                            baseProfile,
                            profileByRole
                        );

                    const token = generateToken(newUser, newAccount);

                    const newProfile = {
                        baseProfile: newAccount,
                        token,
                        profileByRole: newUser,
                    };

                    console.log("NEW: ", newProfile);

                    const cookieOptions = {
                        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
                        secure: true,
                        httpOnly: true,
                        sameSite: "lax" as const,
                    };

                    res.cookie(
                        AppConfig.AUTH_HEADER_NAME,
                        token,
                        cookieOptions
                    );
                    res.status(201).json(newProfile);
                }
            } else {
                res.status(400).json({
                    error: "Invalid Request. Please provide email in baseProfile",
                });
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
