import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import RedisStore from "connect-redis";
import v1Router from "./routes/v1/index.js";
import { AppConfig } from "./config/index/.js";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import initializeRedisClient from "./config/redis.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const initializeExpressServer = async () => {
    await connectDB();
    const redisClient = await initializeRedisClient();
    const redisStore = new RedisStore({
        client: redisClient,
    });

    const app = express();
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: false, limit: "50mb" }));
    app.use(
        session({
            store: redisStore,
            secret: AppConfig.SECRET_KEY,
            resave: false,
            saveUninitialized: true,
            cookie: {
                maxAge: 30 * 60 * 1000, // 30 minutes in milliseconds
                secure: true,
                httpOnly: true,
                sameSite: "none",
            },
        })
    );
    app.use(cookieParser());

    app.use("/api/v1", v1Router);

    if (process.env.NODE_ENV === "production") {
        console.log("up here prod");
        app.use(express.static(path.join(__dirname, "../frontend/dist")));

        app.get("*", (req, res) =>
            res.sendFile(
                path.resolve(__dirname, "../", "frontend", "dist", "index.html")
            )
        );
    } else {
        console.log("down here dev");
        app.get("/", (req, res) => res.send("Please set to production"));
    }

    app.use(errorHandler);

    // Start the server
    app.listen(AppConfig.PORT, () => {
        console.log(`Server is running on port ${AppConfig.PORT}`);
    });

    return app;
};

const expressApp = initializeExpressServer();
export default expressApp;
