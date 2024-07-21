import express from "express";
import {
    createAccount,
    getAccount,
    updateAccount,
} from "../../handlers/account/index";
import { protect } from "../../middleware/authMiddleware";

const accountRouter = express.Router();

accountRouter.post("/", createAccount);
accountRouter.get("/:accountId", protect, getAccount);
accountRouter.put("/:accountId", protect, updateAccount);

export default accountRouter;
