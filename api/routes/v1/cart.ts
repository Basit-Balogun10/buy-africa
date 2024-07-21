import express from "express";
import {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
} from "../../handlers/order/index.js";
import { protect } from "../../middleware/authMiddleware.js";

const orderRouter = express.Router();

orderRouter.get("/", protect, getOrders);
orderRouter.post("/", protect, createOrder);
orderRouter.get("/:orderId", protect, getOrder);
orderRouter.put("/:orderId", protect, updateOrder);

export default orderRouter;
