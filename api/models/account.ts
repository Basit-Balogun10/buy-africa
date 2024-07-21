import { model, Schema } from "mongoose";
import { DocumentWithTimeStamps } from "../types";
import { IEvent } from "./event";

export interface IAccount extends DocumentWithTimeStamps {
    name: string;
    email: string;
    events: IEvent[];
}

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
const Account = model<IAccount>("Account", accountSchema);

export default Account;
