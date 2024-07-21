import type { Request, Response, NextFunction } from "express";

export const corsHandler = (
    err: TypeError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.header("Access-Control-Allow-Origin", process.env.NODE_ENV === "production" ? process.env.APP_LIVE_URL : process.env.BASE_FRONTEND_URL);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
};