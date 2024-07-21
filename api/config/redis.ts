import { createClient } from "redis";
import { Request } from "express";
import { AppConfig } from "./index";
import hash from "object-hash";
import { RedisClientType } from "@redis/client";
import { RedisCommandArgument } from "@redis/client/dist/lib/commands";
import { SetOptions } from "@redis/client/dist/lib/commands/SET";

let redisClient: RedisClientType | null = null;

export const generateRedisKey = (req: Request) => {
    const reqDataToHash = {
        query: req.query,
        body: req.body,
    };

    // `${req.path}@...` to make it easier to find keys on a Redis client
    return `${req.path}@${hash.sha1(reqDataToHash)}`;
};

export const isRedisWorking = () => {
    // verify whether there is an active connection to a Redis server or not
    return !!redisClient?.isOpen;
};

export const writeData = async (
    key: RedisCommandArgument,
    data: number | RedisCommandArgument,
    options: SetOptions | undefined
) => {
    if (isRedisWorking()) {
        try {
            // write data to the Redis cache
            await redisClient?.set(key, data, options);
        } catch (e) {
            console.error(`Failed to cache data for key=${key}`, e);
        }
    }
};

export const readData = async (key: string) => {
    let cachedValue = undefined;

    if (isRedisWorking()) {
        // try to get the cached response from redis
        cachedValue = await redisClient?.get(key);
        if (cachedValue) {
            return cachedValue;
        }
    }
};

const initializeRedisClient = async () => {
    const redisURL = AppConfig.REDIS_HOST;
    if (redisURL) {
        if (redisClient) {
            // Check if the client is already connected
            if (redisClient.isOpen) {
                console.log("Redis client is already connected");
                return redisClient;
            } else {
                // If the client is not connected, try to reconnect
                try {
                    await redisClient.connect();
                    console.log("Reconnected to Redis successfully!");
                    return redisClient;
                } catch (e) {
                    console.error("Reconnection to Redis failed with error:");
                    console.error(e);
                }
            }
        } else {
            // If the client is not created yet, create a new one
            redisClient = createClient({
                password: AppConfig.REDIS_PASSWORD,
                socket: {
                    host: redisURL,
                    port: AppConfig.REDIS_PORT as number,
                },
            }).on("error", (e) => {
                console.error("Failed to create the Redis client with error:");
                console.error(e);
            }) as RedisClientType;

            try {
                await redisClient.connect();
                console.log("Connected to Redis successfully!");
                return redisClient;
            } catch (e) {
                console.error("Connection to Redis failed with error:");
                console.error(e);
            }
        }
    }
    return null;
};

export default initializeRedisClient;
