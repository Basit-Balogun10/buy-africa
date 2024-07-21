import express from "express";
import {
    createAccount,
    getAccount,
    updateAccount,
} from "../../handlers/account/index.js";
import { protect } from "../../middleware/authMiddleware.js";

const accountRouter = express.Router();

accountRouter.post("/", createAccount);
accountRouter.get("/:accountId", protect, getAccount);
accountRouter.put("/:accountId", protect, updateAccount);

export default accountRouter;
