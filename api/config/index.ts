import dotenv from "dotenv";

dotenv.config();

const AppConfig = {
    APP_LIVE_URL: process.env.LIVE_BACKEND_URL as string,
    AUTH_HEADER_NAME: process.env.AUTH_HEADER_NAME as string,
    ENCRYPTION_ALGORITHM: process.env.ENCRYPTION_ALGORITHM as string,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY as string,
    INIT_VECTOR: process.env.INIT_VECTOR as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    LOCAL_BACKEND_URL: process.env.LOCAL_BACKEND_URL as string,
    LOCAL_FRONTEND_URL: process.env.LOCAL_MOBILE_APP_DEEP_LINK as string,
    MONGODB_URI: process.env.MONGODB_URI as string,
    NODE_ENV: process.env.NODE_ENV as string,
    NODEMAILER_USER_EMAIL: process.env.NODEMAILER_USER_EMAIL as string,
    NODEMAILER_USER_PASSWORD: process.env.NODEMAILER_USER_PASSWORD as string,
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY as string,
    PORT: process.env.PORT || (3000 as string | number),
    REDIS_HOST: process.env.REDIS_HOST as string,
    REDIS_PORT: process.env.REDIS_PORT || (6379 as string | number),
    REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
    SECRET_KEY: process.env.SECRET_KEY as string,
};

export { AppConfig };
