import { model, Schema } from "mongoose";
import {
    DocumentWithTimeStamps,
    ProductPreference,
    ProductVariant,
} from "../types";

export interface IProduct extends DocumentWithTimeStamps {
    name: string;
    vendor?: Schema.Types.ObjectId;
    store?: Schema.Types.ObjectId;
    aliases: string[];
    preferences: ProductPreference[];
    defaultImageURL: string;
    shortDesc: string;
    rating: number;
    ratingsCount: number;
    unit?: string;
    pricePerUnit?: number;
    hasVariants: boolean;
    variants?: ProductVariant[];
    minPriceOfVariants?: number;
    maxPriceOfVariants?: number;
    longDesc?: string;
    isAvailable: boolean;
    category: "Agriculture" | "Electronics" | "Pets";
}

const productSchema = new Schema<IProduct>(
    {
        name: String,
        vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: false },
        store: { type: Schema.Types.ObjectId, ref: "Store", required: false },
        aliases: {
            type: [String],
            required: false,
        },
        defaultImageURL: {
            type: String,
            required: true,
        },
        shortDesc: {
            type: String,
            required: true,
        },
        unit: {
            type: String,
            required: false,
        },
        pricePerUnit: {
            type: Number,
            required: false,
        },
        hasVariants: {
            type: Boolean,
            required: true,
        },
        preferences: {
            type: [
                {
                    name: { type: String, required: true },
                    price: { type: Number, required: true },
                },
            ],
        },
        variants: {
            type: [
                {
                    imageURL: { type: String, required: true },
                    name: { type: String, required: true },
                    price: { type: Number, required: true },
                },
            ],
        },
        minPriceOfVariants: {
            type: Number,
            required: false,
        },
        maxPriceOfVariants: {
            type: Number,
            required: false,
        },
        longDesc: {
            type: String,
            required: false,
        },
        rating: {
            type: Number,
            required: true,
        },
        ratingsCount: {
            type: Number,
            required: true,
        },
        isAvailable: {
            type: Boolean,
            required: true,
        },
        category: {
            type: String,
            enum: ["Vegetables", "Electronics", "Pets"],
        },
    },
    {
        _id: true,
        timestamps: true,
    }
);

const Product = model<IProduct>("Product", productSchema);

export default Product;
