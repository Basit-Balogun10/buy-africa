import { model, Schema } from "mongoose";
import {
    DocumentWithTimeStamps,
    ProductVariant,
    ProductPreference,
} from "../types/index.js";
import { IProduct } from "./product.js";
import { IBuyer, IVendor } from "./account.js";
import { IStore } from "./store.js";

export type CartItem = {
    product: IProduct;
    quantity: number;
    price: number;
    selectedVariants: ProductVariant[];
    selectedPreferences: ProductPreference[];
};
export interface ICart extends DocumentWithTimeStamps {
    items: CartItem[];
    owner: Schema.Types.ObjectId | IBuyer;
    store?: Schema.Types.ObjectId | IStore;
    total: number;
    vendor?: Schema.Types.ObjectId | IVendor;
}

const cartSchema = new Schema<ICart>(
    {
        items: {
            type: [
                {
                    product: {
                        type: Schema.Types.ObjectId,
                        ref: "Product",
                        required: true,
                    },
                    quantity: { type: Number, required: true },
                    price: { type: Number, required: true },
                    selectedVariants: {
                        type: [
                            {
                                id: { type: String, required: true },
                                imageURL: { type: String, required: true },
                                name: { type: String, required: true },
                                isReady: { type: Boolean, required: true },
                                price: { type: Number, required: true },
                                quantity: { type: Number, required: true },
                            },
                        ],
                    },
                    selectedPreferences: {
                        type: [
                            {
                                id: { type: String, required: true },
                                name: { type: String, required: true },
                                isReady: { type: Boolean, required: true },
                                price: { type: Number, required: true },
                            },
                        ],
                    },
                },
            ],
            required: true,
        },
        owner: { type: Schema.Types.ObjectId, ref: "Buyer", required: true },
        store: { type: Schema.Types.ObjectId, ref: "Store", required: false },
        total: { type: Number, required: true },
        vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: false },
    },

    { _id: true, timestamps: true }
);

const Cart = model<ICart>("Cart", cartSchema);

export default Cart;
