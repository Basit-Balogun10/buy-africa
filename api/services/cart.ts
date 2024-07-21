import { FilterQuery, Types } from "mongoose";
import Cart, { ICart } from "../models/cart.js";

export class CartService {
    static async createCart(cartInfo: Partial<ICart>) {
        return await Cart.create({
            ...cartInfo,
        });
    }

    static async getCartById(cartId: string) {
        return await Cart.findById(cartId);
    }

    static async getCartByQuery(filterQuery: FilterQuery<ICart>) {
        console.log("filterQuery", filterQuery);
        return await Cart.findOne(filterQuery);
    }

    static async getCarts(ownerId: string) {
        return await Cart.find({ owner: ownerId });
    }

    static async updateCart(cartId: string, updatedFields: Partial<ICart>) {
        return await Cart.findByIdAndUpdate(
            cartId,
            { $set: updatedFields },
            { new: true }
        );
    }
}
