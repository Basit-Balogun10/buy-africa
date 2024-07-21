import { model, Schema } from "mongoose";
import { AccountRole, DocumentWithTimeStamps } from "../types";
import { IProduct } from "./product";

export interface IAccount extends DocumentWithTimeStamps {
    name: string;
    email: string;
    role: AccountRole;
}

export interface IBuyer extends DocumentWithTimeStamps {
    account: Schema.Types.ObjectId | IAccount;
}

export interface IVendor extends DocumentWithTimeStamps {
    account: Schema.Types.ObjectId | IAccount;
    products: IProduct[];
}

export type IUser = IBuyer | IVendor;

const accountSchema = new Schema<IAccount>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: false,
            sparse: true,
            trim: true,
        },
    },
    {
        _id: true,
        timestamps: true,
    }
);

const buyerSchema = new Schema<IBuyer>(
    {
        account: {
            type: Schema.Types.ObjectId,
            ref: "Account",
            required: true,
        },
    },
    {
        _id: true,
        timestamps: true,
    }
);

const vendorSchema = new Schema<IVendor>(
    {
        account: {
            type: Schema.Types.ObjectId,
            ref: "Account",
            required: true,
        },
        products: [
            { type: Schema.Types.ObjectId, ref: "Product", required: true },
        ],
    },
    {
        _id: true,
        timestamps: true,
    }
);

const Account = model<IAccount>("Account", accountSchema);
export const Buyer = model<IBuyer>("Buyer", buyerSchema);
export const Vendor = model<IVendor>("Vendor", vendorSchema);

export type UserModel = typeof Buyer & typeof Vendor;

export default Account;
