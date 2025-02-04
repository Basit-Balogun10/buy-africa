import express from "express";
import {
    createProduct,
    getProduct,
    getProducts,
    // deleteProduct,
    // updateProduct,
} from "../../handlers/product/index.js";
import { protect } from "../../middleware/authMiddleware.js";

const productRouter = express.Router();

productRouter.post("/", protect, createProduct);
productRouter.get("/", protect, getProducts);

productRouter.get("/:productId", protect, getProduct);
// productRouter.put("/:productId", protect, updateProduct);
// productRouter.delete("/:productId", protect, deleteProduct);

export default productRouter;
