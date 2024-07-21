import express from "express";
import {
    createCart,
    getCarts,
    getCart,
    updateCart,
} from "../../handlers/cart/index.js";
import { protect } from "../../middleware/authMiddleware.js";

const cartRouter = express.Router();

cartRouter.get("/", protect, getCarts);
cartRouter.post("/", protect, createCart);
cartRouter.get("/:cartId", protect, getCart);
cartRouter.put("/:cartId", protect, updateCart);

export default cartRouter;
