import crypto from "crypto";
import { AppConfig } from "../config/index";

const initVector = AppConfig.INIT_VECTOR;
const secretKey = AppConfig.SECRET_KEY;
const algorithm = AppConfig.ENCRYPTION_ALGORITHM;

export const encryptData = (data: string) => {
    const cipher = crypto.createCipheriv(
        algorithm,
        Buffer.from(secretKey, "hex"),
        Buffer.from(initVector, "hex")
    );
    const encryptedData =
        cipher.update(data, "utf-8", "hex") + cipher.final("hex");

    return encryptedData;
};

export const decryptData = (encryptedData: string) => {
    const decipher = crypto.createDecipheriv(
        algorithm,
        Buffer.from(secretKey, "hex"),
        Buffer.from(initVector, "hex")
    );
    const decryptedData =
        decipher.update(encryptedData, "hex", "utf-8") +
        decipher.final("utf-8");

    return decryptedData;
};
