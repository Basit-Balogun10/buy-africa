import { Router } from "express";
// import AIApiRouter from "./AI.js";
import paystackApiRouter from "./paystack.js";
import { converseWithAI } from "../../../handlers/third-party/AI.js";
import { protect } from "../../../middleware/authMiddleware.js";

const thirdPartyApisRouter = Router();

thirdPartyApisRouter.post("/ai/conversation", protect, converseWithAI);
thirdPartyApisRouter.use("/paystack", paystackApiRouter);

export default thirdPartyApisRouter;
