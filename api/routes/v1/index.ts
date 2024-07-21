import { Router } from "express";
import accountRouter from "./account.js";
import authRouter from "./auth.js";
import cartRouter from "./cart.js";
import orderRouter from "./order.js";
import productRouter from "./product.js";
import thirdPartyApisRouter from "./thirdParty/index.js";

const v1Router = Router();

v1Router.use("/accounts", accountRouter);
v1Router.use("/auth", authRouter);
v1Router.use("/carts", cartRouter);
v1Router.use("/orders", orderRouter);
v1Router.use("/products", productRouter);
v1Router.use("/third-party", thirdPartyApisRouter);

export default v1Router;
