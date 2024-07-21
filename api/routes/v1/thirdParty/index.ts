import { Router } from "express";
import AIApiRouter from "./ai.js";
import paystackApiRouter from "./paystack.js";

const thirdPartyApisRouter = Router();

thirdPartyApisRouter.use("/ai", AIApiRouter);
thirdPartyApisRouter.use("/paystack", paystackApiRouter);

export default thirdPartyApisRouter;
