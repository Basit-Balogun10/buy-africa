import { Response, NextFunction, Request } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { IAccount } from "../models/account";
import { AppConfig } from "../config/index";
import { AccountService } from "../services/account";

export interface IAuthenticatedRequest extends Request {
    account?: Partial<IAccount>;
}

interface JWTPayload extends JwtPayload {
    email: string;
    id: string;
    name: string;
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

            const { id, email, name } = decoded as JWTPayload;

            const account = await AccountService.getAccountById(id);

            if (!account) {
                res.status(401);
                throw new Error("Not authorized, account not found");
            } else {
                req.account = {
                    id,
                    email,
                    name,
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
