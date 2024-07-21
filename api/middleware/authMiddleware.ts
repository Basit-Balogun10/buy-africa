import { Response, NextFunction, Request } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { IAccount, IUser, UserModel } from "../models/account";
import { AppConfig } from "../config/index.js";
import { AccountService } from "../services/account.js";
import { AccountRole } from "../types/index.js";

export interface IAuthenticatedRequest extends Request {
    user?: IUser;
    account?: Partial<IAccount>;
}

interface JWTPayload extends JwtPayload {
    accountId: string;
    email: string;
    role: AccountRole;
    userId: string;
}

export const protect = asyncHandler(
    async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
        const token = req.cookies[AppConfig.AUTH_HEADER_NAME] as string;

        if (!token) {
            res.status(401);
            throw new Error("Not authorized, no token");
        }

        try {
            // Get token from headers
            console.log(`AUTH TOKEN: , ${token}`);

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

            console.log("DECODED TOKEN: ", decoded);

            const { accountId, email, role, userId } = decoded as JWTPayload;
            const userModel = AccountService.getUserModelByRole(
                (decoded as JWTPayload).role
            );
            const user = await (userModel as UserModel).findById(userId);

            if (!user) {
                res.status(401);
                throw new Error("Not authorized, account not found");
            } else {
                req.user = user;
                req.account = {
                    _id: accountId,
                    email,
                    role,
                };

                next();
            }
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error("Not authorized");
        }
    }
);
